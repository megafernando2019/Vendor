"use server";

import { loadCotizar, type CotizarLoadParams } from "@/lib/cotizarLoad";
import { requireAuth } from "@/lib/requireAuth";

export async function getCotizarAction(params: CotizarLoadParams) {
  await requireAuth();
  return loadCotizar(params);
}
