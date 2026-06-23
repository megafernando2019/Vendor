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

export function isProviderMetaKey(key: string): boolean {
  return PROVIDER_META_KEYS.has(key) || key.startsWith("tc_");
}

/** Normaliza la respuesta de /api/getInsurances o del API externo */
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

    map[key] = { seguros, addons };
  }

  return map;
}

/** Tarifa diaria del seguro; addons tipo “mayor de 70” activan tarifa elder */
export function addonAppliesElderRate(addon: InsuranceProduct): boolean {
  const name = addon.name_insurance.toLowerCase();
  if (name.includes("infinity")) return false;
  return /mayor|elder|edad|60|70|80/.test(name);
}

export function getSeguroDailyRate(
  product: InsuranceProduct,
  useElderRate: boolean
): number {
  const standard = Number(product.price_day ?? product.price_days ?? 0);
  const elder = Number(product.price_day_elder ?? standard);
  return useElderRate ? elder : standard;
}

export function getAddonCharge(addon: InsuranceProduct): number {
  const travel = Number(addon.price_travel ?? 0);
  if (travel > 0) return travel;
  return Number(addon.price_day ?? addon.price_days ?? 0);
}

export function calcularPrecioAsistencia(
  lineas: CoberturaLinea[],
  seguros: InsuranceProduct[],
  days: number,
  selectedAddons: InsuranceProduct[] = []
): number {
  const numDays = Number(days) || 0;
  const useElderRate = selectedAddons.some(addonAppliesElderRate);
  let total = 0;

  for (const linea of lineas) {
    const product = seguros.find((s) => s.id === linea.productId);
    if (product) {
      total += getSeguroDailyRate(product, useElderRate) * numDays;
    }
  }

  for (const addon of selectedAddons) {
    const charge = getAddonCharge(addon);
    if (addon.price_travel != null && Number(addon.price_travel) > 0) {
      total += charge;
    } else if (numDays > 0) {
      total += charge * numDays;
    } else {
      total += charge;
    }
  }

  return total;
}

export const INSURANCE_PROVIDER_LABELS: Record<string, string> = {
  AXA: "Asistencia AXA",
  AC: "Asistencia Assist Card",
};

export const INSURANCE_PROVIDER_COLORS: Record<string, string> = {
  AXA: "#00008F",
  AC: "#E11D48",
};
