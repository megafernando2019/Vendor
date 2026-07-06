import { NextResponse } from "next/server";
import { loadDeparturesTours } from "@/lib/departuresToursLoad";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const blockadeUid = searchParams.get("blockade_uid") ?? "";
  const result = await loadDeparturesTours(blockadeUid);

  return NextResponse.json(
    {
      success: result.success,
      data: result.data,
      message: result.message,
    },
    { status: result.status },
  );
}
