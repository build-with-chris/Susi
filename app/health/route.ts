import { NextResponse } from "next/server";

/**
 * Health-Check unter /health (ohne /api).
 * Falls /api/health auf Vercel 404 liefert, diesen Endpoint testen.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const supabaseConfigured = Boolean(url && key && !key.includes("<<"));

  return NextResponse.json({
    ok: true,
    supabaseConfigured,
    envUrlPresent: Boolean(url),
    envKeyPresent: Boolean(key),
  });
}
