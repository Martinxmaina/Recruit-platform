# Vercel deploy checklist

1. **Root Directory** (required): In Vercel project settings, set **Root
   Directory** to the repository root (`.`), not `clerk-nextjs`.
2. **Environment variables**: In Vercel -> Settings -> Environment Variables,
   add at least:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (e.g. `https://your-app.vercel.app`)
   See `.env.example` for optional vars (OpenAI, Google).
3. **Build**: Use `npm ci` and `npm run build` from the repository root.
   Ensure your root `package.json` and `package-lock.json` stay in sync.
