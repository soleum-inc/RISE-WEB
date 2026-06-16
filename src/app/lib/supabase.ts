/* ──────────────────────────────────────────────────────────────────────────
   Supabase client — the shared RISE backend (project "rise").

   Both the web admin and the mobile companion point at this same project so a
   case created on one surfaces on the other in real time. The anon key is a
   PUBLIC key by design (row-level security is the boundary, not key secrecy),
   and these are public GitHub Pages bundles, so it's committed as a fallback —
   the build always works. A local `.env.local` with VITE_SUPABASE_URL /
   VITE_SUPABASE_ANON_KEY overrides it for pointing at a different project.

   NOTE: open RLS + no auth is a DEMO posture on seeded fake data. Tighten with
   Supabase Auth + ownership policies before any real/PII use.
   ────────────────────────────────────────────────────────────────────────── */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  'https://lzuqjprysxucocjcktca.supabase.co';

const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dXFqcHJ5c3h1Y29jamNrdGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1OTAwOTYsImV4cCI6MjA5NzE2NjA5Nn0.SGi6vJmF7k6QF30eZtEyw_VSmdkC0DBEevnQ0tSW6zA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false }, // no login in the demo
  realtime: { params: { eventsPerSecond: 10 } },
});

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
