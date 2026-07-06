export interface InsuranceProduct {
  id: number;
  name_insurance: string;
  price_days?: number;
  price_day?: number | string;
  price_day_elder?: number | string | null;
  price_travel?: number | string;
  age_elder?: number;
  max_age_elder?: number;
  min_days?: number;
  max_days?: number;
}

export interface CoberturaLinea {
  productId: number;
  name: string;
  price_day?: string;
  is_elderly?: string;
}

export interface AddonSeleccionado {
  id: number;
  name: string;
  price: number;
}

export interface CoberturaFormValues {
  cantidad: number;
  lineas: CoberturaLinea[];
  addonsSeleccionados: AddonSeleccionado[];
}

export interface InsuranceProviderData {
  seguros: InsuranceProduct[];
  addons: InsuranceProduct[];
}

export type InsuranceProvidersMap = Record<string, InsuranceProviderData>;

export type InsuranceProductType = "seguro" | "addon";

export interface AsistenciaSeleccionada {
  id: string;
  productId: number;
  providerKey: string;
  providerName: string;
  name: string;
  price: number;
  type: InsuranceProductType;
  coberturas?: CoberturaLinea[];
  addonsSeleccionados?: AddonSeleccionado[];
}

const PROVIDER_META_KEYS = new Set(["status"]);

function parseInsuranceAmount(value: unknown): number {
  if (value == null || value === "") return 0;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const cleaned = String(value).replace(/[^0-9.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeInsuranceId(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeInsuranceProduct(raw: InsuranceProduct): InsuranceProduct {
  const record = raw as InsuranceProduct & Record<string, unknown>;
  const priceDay =
    record.price_day ??
    record.price ??
    record.day_price ??
    record.daily_price;
  const priceDays = record.price_days ?? record.price_travel;

  return {
    ...raw,
    id: normalizeInsuranceId(raw.id),
    name_insurance: String(raw.name_insurance ?? record.name ?? ""),
    price_day: parseInsuranceAmount(priceDay),
    price_days: parseInsuranceAmount(priceDays),
    price_day_elder: raw.price_day_elder != null
      ? parseInsuranceAmount(raw.price_day_elder)
      : null,
    price_travel:
      raw.price_travel != null ? parseInsuranceAmount(raw.price_travel) : undefined,
  };
}

function isProviderMetaKey(key: string): boolean {
  return PROVIDER_META_KEYS.has(key) || key.startsWith("tc_");
}

/** Normaliza la respuesta de /api/getInsurances (POST) o del API externo */
export function parseInsuranceProvidersMap(source: unknown): InsuranceProvidersMap {
  if (!source || typeof source !== "object") return {};

  const root = source as Record<string, unknown>;
  let candidates: Record<string, unknown> = root;

  if (root.insurances && typeof root.insurances === "object") {
    candidates = root.insurances as Record<string, unknown>;
  } else if (root.data && typeof root.data === "object") {
    const data = root.data as Record<string, unknown>;
    if (data.insurances && typeof data.insurances === "object") {
      candidates = data.insurances as Record<string, unknown>;
    } else {
      candidates = data;
    }
  }

  const map: InsuranceProvidersMap = {};

  for (const [key, value] of Object.entries(candidates)) {
    if (isProviderMetaKey(key)) continue;
    if (!value || typeof value !== "object") continue;

    const entry = value as Partial<InsuranceProviderData>;
    const seguros = Array.isArray(entry.seguros) ? entry.seguros : [];
    const addons = Array.isArray(entry.addons) ? entry.addons : [];

    if (seguros.length === 0 && addons.length === 0) continue;

    map[key] = {
      seguros: seguros.map((item) => normalizeInsuranceProduct(item)),
      addons: addons.map((item) => normalizeInsuranceProduct(item)),
    };
  }

  return map;
}

/** Tarifa diaria del seguro; addons tipo “mayor de 70” activan tarifa elder */
function addonAppliesElderRate(addon: InsuranceProduct): boolean {
  const name = addon.name_insurance.toLowerCase();
  if (name.includes("infinity")) return false;
  return /mayor|elder|edad|60|70|80/.test(name);
}

function getSeguroDailyRate(
  product: InsuranceProduct,
  useElderRate: boolean
): number {
  const standard = parseInsuranceAmount(product.price_day ?? product.price_days ?? 0);
  const elder = parseInsuranceAmount(product.price_day_elder ?? standard);
  return useElderRate ? elder : standard;
}

function getAddonCharge(addon: InsuranceProduct): number {
  const travel = parseInsuranceAmount(addon.price_travel ?? 0);
  if (travel > 0) return travel;
  return parseInsuranceAmount(addon.price_day ?? addon.price_days ?? 0);
}

export function resolveInsuranceDays(
  tourDays: number,
  departuredAt?: string,
  returnedAt?: string,
): number {
  if (tourDays > 0) return tourDays;

  if (departuredAt && returnedAt) {
    const start = new Date(departuredAt);
    const end = new Date(returnedAt);
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
      const diffMs = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays > 0) return diffDays;
    }
  }

  return 1;
}

export function calcularPrecioAsistencia(
  lineas: CoberturaLinea[],
  seguros: InsuranceProduct[],
  days: number,
  selectedAddons: InsuranceProduct[] = []
): number {
  const numDays = resolveInsuranceDays(days);
  const useElderRate = selectedAddons.some(addonAppliesElderRate);
  const segurosById = new Map(
    seguros.map((seguro) => [normalizeInsuranceId(seguro.id), seguro]),
  );
  let total = 0;

  for (const linea of lineas) {
    const product =
      segurosById.get(normalizeInsuranceId(linea.productId)) ?? null;
    const dailyFromLinea = parseInsuranceAmount(linea.price_day);
    const dailyRate = product
      ? getSeguroDailyRate(product, useElderRate)
      : dailyFromLinea;

    if (dailyRate > 0) {
      total += dailyRate * numDays;
    }
  }

  for (const addon of selectedAddons) {
    const charge = getAddonCharge(addon);
    if (parseInsuranceAmount(addon.price_travel) > 0) {
      total += charge;
    } else if (numDays > 0) {
      total += charge * numDays;
    } else {
      total += charge;
    }
  }

  return total;
}

const INSURANCE_PROVIDER_LABELS: Record<string, string> = {
  AXA: "Asistencia AXA",
  AC: "Asistencia Assist Card",
};

const INSURANCE_PROVIDER_COLORS: Record<string, string> = {
  AXA: "#00008F",
  AC: "#E11D48",
};

const INSURANCE_PROVIDER_LOGOS: Record<string, string> = {
  AXA: "/assets/img/galeria/asistencias.webp",
  AC: "/assets/img/galeria/asistencias.webp",
};

const INSURANCE_PROVIDER_ORDER = ["AXA", "AC"];

export function getInsuranceProviderLabel(key: string): string {
  return INSURANCE_PROVIDER_LABELS[key] ?? `Asistencia ${key}`;
}

export function getInsuranceProviderColor(key: string): string {
  return INSURANCE_PROVIDER_COLORS[key] ?? "#6f42c1";
}

export function getInsuranceProviderLogo(key: string): string | null {
  return INSURANCE_PROVIDER_LOGOS[key] ?? null;
}

export function sortInsuranceProviderKeys(keys: string[]): string[] {
  return [...keys].sort((a, b) => {
    const ai = INSURANCE_PROVIDER_ORDER.indexOf(a);
    const bi = INSURANCE_PROVIDER_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export function formatInsuranceAddonPrice(addon: InsuranceProduct): string {
  const travel = parseInsuranceAmount(addon.price_travel ?? 0);
  if (travel > 0) return travel.toFixed(2);
  return parseInsuranceAmount(addon.price_day ?? addon.price_days ?? 0).toFixed(2);
}

export function buildCoberturaLineas(
  product: InsuranceProduct,
  cantidad: number,
): CoberturaLinea[] {
  const daily = String(
    parseInsuranceAmount(product.price_day ?? product.price_days ?? 0),
  );
  return Array.from({ length: cantidad }, () => ({
    productId: normalizeInsuranceId(product.id),
    name: product.name_insurance,
    price_day: daily,
  }));
}

export function getAsistenciaCoberturaCount(item: AsistenciaSeleccionada): number {
  return item.coberturas?.length ?? 1;
}

export function getAsistenciaCartSubtitle(item: AsistenciaSeleccionada): string {
  const count = getAsistenciaCoberturaCount(item);
  const label = count === 1 ? "cobertura" : "coberturas";
  return `${item.providerName} ${count} ${label}`;
}
