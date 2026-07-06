"use server";

import { loadInsurances } from "@/lib/insurancesLoad";
import { requireAuth } from "@/lib/requireAuth";

export async function getInsurancesAction(mt: string, days: number) {
  await requireAuth();
  return loadInsurances(mt, days);
}
