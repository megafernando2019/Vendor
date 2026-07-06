"use server";

import { loadDeparturesTours } from "@/lib/departuresToursLoad";
import { requireAuth } from "@/lib/requireAuth";

export async function getDeparturesToursAction(blockadeUid: string) {
  await requireAuth();
  return loadDeparturesTours(blockadeUid);
}
