# Recruitment Platform

Single Next.js app lives at the repository root.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.local.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL` – Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` – Supabase service role key (required for org setup and server-side operations)

Get these from the Supabase dashboard: Project → Settings → API.

## Database

Apply Supabase migrations so the app can resolve the current user and organization. In particular, the `set_user_context` migration (`supabase/migrations/20260227500000_set_user_context_name.sql`) must be applied so `createAdminClient` and server actions that need user context work correctly.

## Active app structure

- `app/` - App Router pages and layouts
- `lib/` - server/auth utilities
- `middleware.ts` - request middleware
- `package.json` - root runtime scripts

## Legacy archive

The previous secondary app has been archived to:

- `_archive/clerk-nextjs-legacy/`

It is kept for historical reference and is not part of the active runtime app.