import { NextResponse } from "next/server";

/**
 * Einfacher Check für Vercel: Läuft die App, sind Supabase-Env gesetzt?
 * GET /api/health – gibt keine geheimen Werte aus.
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
