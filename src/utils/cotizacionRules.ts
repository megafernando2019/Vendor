import type {
  CotizacionRulesData,
  HabitacionCosts,
  RoomRule,
  RoomRules,
  RoutesImages,
  RulesText,
} from "@/interfaces/cotizacion-components";
import { DEFAULT_DESTINATION } from "@/interfaces/search";

const DEFAULT_RULES_TEXT: RulesText = {
  sencilla: "Habitación individual con espacio funcional para un pasajero.",
  doble:
    "Espacio cómodo y funcional ideal para compartir, equipada con cama doble o dos camas individuales.",
  triple: "Habitación amplia configurada para tres pasajeros.",
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function firstRecordFromArray(value: unknown): Record<string, unknown> | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  return asRecord(value[0]);
}

function hasRulesFields(record: Record<string, unknown>): boolean {
  return Boolean(
    record.room_rules ??
      record.roomRules ??
      record.rules ??
      record.destination_id ??
      record.destinationId,
  );
}

function unwrapPayload(payload: unknown): Record<string, unknown> | null {
  const root = asRecord(payload);
  if (!root) return null;

  if (Array.isArray(root.data)) {
    return root;
  }

  const nested = asRecord(root.data);
  if (nested) return nested;

  return root;
}

function resolveRulesInner(
  record: Record<string, unknown>,
): Record<string, unknown> | null {
  if (hasRulesFields(record) && !Array.isArray(record.data)) {
    return record;
  }

  const fromTopLevelArray = firstRecordFromArray(record.data);
  if (fromTopLevelArray && hasRulesFields(fromTopLevelArray)) {
    return fromTopLevelArray;
  }

  const dataField = record.data;
  if (dataField && typeof dataField === "object") {
    if (Array.isArray(dataField)) {
      const item = firstRecordFromArray(dataField);
      if (item && hasRulesFields(item)) return item;
    } else {
      const dataRecord = asRecord(dataField);
      if (dataRecord) {
        const fromNestedArray = firstRecordFromArray(dataRecord.data);
        if (fromNestedArray && hasRulesFields(fromNestedArray)) {
          return fromNestedArray;
        }
        if (hasRulesFields(dataRecord)) return dataRecord;
      }
    }
  }

  return hasRulesFields(record) ? record : null;
}

function normalizeRoomRule(raw: unknown): RoomRule {
  const rule = asRecord(raw) ?? {};
  const adt = Number(rule.adt ?? rule.ADT ?? 0);
  const mnrA = Number(
    rule.mnrA ?? rule.mnr ?? rule.mnr1 ?? rule.mnr_a ?? rule.MNR1 ?? 0,
  );
  const inf = Number(rule.inf ?? rule.INF ?? 0);

  return {
    adt: adt > 0 ? adt : undefined,
    mnrA: mnrA > 0 ? mnrA : undefined,
    inf: inf > 0 ? inf : undefined,
  };
}

function pickRoomRuleList(
  rules: Record<string, unknown>,
  ...keys: string[]
): RoomRule[] {
  for (const key of keys) {
    const value = rules[key];
    if (Array.isArray(value) && value.length > 0) {
      return value.map(normalizeRoomRule);
    }
  }
  return [];
}

function normalizeRoomRules(source: Record<string, unknown>): RoomRules {
  const rules =
    asRecord(source.room_rules) ??
    asRecord(source.roomRules) ??
    asRecord(source.rules) ??
    source;

  return {
    sgl: pickRoomRuleList(rules, "sgl", "SGL", "sencilla"),
    dbl: pickRoomRuleList(rules, "dbl", "DBL", "doble"),
    tpl: pickRoomRuleList(rules, "tpl", "TPL", "triple"),
    cpl: pickRoomRuleList(rules, "cpl", "CPL", "cuadruple"),
  };
}

function normalizeRulesText(source: Record<string, unknown>): RulesText {
  const rulesText =
    asRecord(source.rules_text) ?? asRecord(source.rulesText) ?? {};

  return {
    sencilla: String(rulesText.sencilla ?? DEFAULT_RULES_TEXT.sencilla),
    doble: String(rulesText.doble ?? DEFAULT_RULES_TEXT.doble),
    triple: String(rulesText.triple ?? DEFAULT_RULES_TEXT.triple),
  };
}

function normalizeRoutesImages(source: Record<string, unknown>): RoutesImages {
  const images =
    asRecord(source.routes_images) ?? asRecord(source.routesImages) ?? {};
  return {
    sencilla: images.sencilla as string | undefined,
    doble: images.doble as string | undefined,
    triple: images.triple as string | undefined,
  };
}

export function parseRulesCotizacionResponse(
  payload: unknown,
  fallbackCurrency = "USD",
): CotizacionRulesData | null {
  const record = unwrapPayload(payload);
  if (!record) return null;

  const inner = resolveRulesInner(record);
  if (!inner) return null;

  const destinationId = Number(
    inner.destination_id ?? inner.destinationId ?? DEFAULT_DESTINATION,
  );
  const roomRules = normalizeRoomRules(inner);
  const hasRules =
    (roomRules.sgl?.length ?? 0) > 0 ||
    (roomRules.dbl?.length ?? 0) > 0 ||
    (roomRules.tpl?.length ?? 0) > 0 ||
    (roomRules.cpl?.length ?? 0) > 0;

  if (!hasRules) return null;

  return {
    destinationId,
    roomRules,
    rulesText: normalizeRulesText(inner),
    routesImages: normalizeRoutesImages(inner),
    currency: String(inner.currency ?? fallbackCurrency),
  };
}

export function parseRoomCostsResponse(payload: unknown): HabitacionCosts | null {
  const record = unwrapPayload(payload);
  if (!record) return null;

  const costs = resolveCostsInner(record);
  if (!costs) return null;

  const grand_base = Number(costs.grand_base ?? costs.base ?? 0);
  const grand_tax = Number(costs.grand_tax ?? costs.tax ?? 0);
  const grand_suplements = Number(
    costs.grand_suplements ??
      costs.grand_supplements ??
      costs.suplements ??
      costs.supplements ??
      0,
  );
  const grand_total = Number(
    costs.grand_total ??
      costs.total ??
      grand_base + grand_tax + grand_suplements,
  );

  if (grand_total <= 0 && grand_base <= 0 && grand_tax <= 0 && grand_suplements <= 0) {
    return null;
  }

  return {
    grand_base,
    grand_tax,
    grand_suplements,
    grand_total,
  };
}

function resolveCostsInner(
  record: Record<string, unknown>,
): Record<string, unknown> | null {
  if (record.grand_total != null || record.grand_base != null) {
    return record;
  }

  const scenarios = asRecord(record.scenarios);
  if (scenarios) {
    const original = asRecord(scenarios.original);
    if (original?.grand_total != null || original?.grand_base != null) {
      return original;
    }

    for (const value of Object.values(scenarios)) {
      const scenario = asRecord(value);
      if (scenario?.grand_total != null || scenario?.grand_base != null) {
        return scenario;
      }
    }
  }

  const nested = asRecord(record.data);
  if (nested) {
    return resolveCostsInner(nested);
  }

  return null;
}

export function formatUsdAmount(amount: number, currency = "USD"): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

export const DEFAULT_EXCHANGE_RATE_MXN = 17.89;

export function formatMxnAmount(amount: number): string {
  return `$${amount.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} MXN`;
}

export function convertUsdToMxn(
  amountUsd: number,
  exchangeRate = DEFAULT_EXCHANGE_RATE_MXN,
): number {
  return amountUsd * exchangeRate;
}

export function departureDateForRulesApi(departuredAt: string): string {
  return departuredAt.split("T")[0] ?? departuredAt;
}

export function getRulePassengerLines(rule: RoomRule): {
  code: string;
  label: string;
  tone: "adt" | "mnr" | "inf";
  icon: string;
}[] {
  const lines: {
    code: string;
    label: string;
    tone: "adt" | "mnr" | "inf";
    icon: string;
  }[] = [];

  if ((rule.adt ?? 0) > 0) {
    lines.push({
      code: "ADT",
      label: "ADT - Mayor o igual a 12 años",
      tone: "adt",
      icon: "fa-user",
    });
  }
  if ((rule.inf ?? 0) > 0) {
    lines.push({
      code: "INF",
      label: "INF - Menor a 2 años",
      tone: "inf",
      icon: "fa-baby-carriage",
    });
  }
  if ((rule.mnrA ?? 0) > 0) {
    lines.push({
      code: "MNR1",
      label: "MNR1 - Mayor igual a 2 años y menor a 12 años",
      tone: "mnr",
      icon: "fa-child",
    });
  }

  return lines;
}
