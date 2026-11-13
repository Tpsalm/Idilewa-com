# Idilewa.com — repository notes

AI-powered African language-learning SPA (Yorùbá, Igbo, Hausa, Kiswahili and more).

## Stack
- Vanilla ES modules + Vite. No React/TypeScript.
- Single-page app: `app.js` (~9k lines) renders every route by string templating into `#main`.
- Routing: hash/query based (`?route=<page>` or `#/<page>`), handled by `parseLocation()` + `render()`.
- Auth/data: Supabase (`src/supabaseClient.js`). Serverless functions in `api/` (Vercel).
- Styles: `styles.css` (large), `code-play.css`.

## Commands
- `npm test` — Node built-in test runner over `tests/*.test.js` (no framework).
- `npm run build` — Vite production build.
- `npm run dev` — Vite dev server.

## Route map (key)
- `renderPage(page, params)` is the dispatcher (`switch (page)`).
- `coding` → `renderCoding()` (designed Code landing page).
- `coding-studio` → `renderCodingStudio()` (block IDE).
- `games` → `renderCodePlayRoute()` (state-driven Code & Play flow: choose → studio → preview → success → library).
- `ai-conversation` → `renderAIConversation()` (own route; the AI chat UI).
- `voice-translation` → `renderVoiceToolPage('voice-translation')` (the real translation tool).
- `REMOVED_ROUTES` in `app.js` lists routes that redirect to `index`.

## Conventions and gotchas
- Pages are plain template strings; markup must be escaped with `esc()` for user data.
- Global delegated listeners: `click` (`[data-route]` then `[data-action]`), `change`, `input`, `submit`, `drop`.
- `handleAction(action, el)` is a big `switch`; its `default` silently ignores unknown actions, so an
  unhandled `data-action` produces a dead control with no console error. Audit new `data-action`s against it.
- Asset paths: images live in `public/assets/` (served at `/assets/...`). `assignUniqueRouteImages()`
  rewrites `src="./assets/..."` to `/assets/...`. Bundled imports (e.g. `assets/idilewa-brand.svg`)
  resolve to hashed/inlined URLs — reference those via the imported binding, not a raw path.
- `coding`, `coding-studio` and `games` render full-screen (own header/footer chrome); other routes
  get the shared header/footer plus information layers.

## Environment
- `.env` (gitignored) holds `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (and legacy `SUPABASE_PUBLIC_URL`,
  `SUPABASE_ANON_KEY`). See `.env.example` for the full server-side list.
- Server-side secrets still required for full functionality: `PLOTWEAVER_API_KEY`, `GOOGLE_TRANSLATE_API_KEY`,
  `JUDGE0_URL`/`JUDGE0_AUTH_TOKEN`, `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GUARDIAN_TOKEN_SECRET`.
  Without them, AI speech/translation, code execution, and guardian email flows report real errors rather than faking success.

## Deployment reality (re-verified 2026-11-13)
- `https://www.idilewa.com` serves a bundle titled "Ìdíléwa Language Academy" that is **not built
  from this repo**. `https://idilewa-com.vercel.app` returns the identical bytes, so the custom
  domain is attached to a Vercel project whose source is not in `Tpsalm/Idilewa-com` (searched every
  local and remote branch and the full commit history: no "Language Academy" markup anywhere).
- This repo **is** wired to Vercel: GitHub Deployments for `Tpsalm/Idilewa-com` are created by
  `vercel[bot]` (environments `Production`, `Preview`, `Production – idilewa`, `Production – idileewa-com`,
  …). The repo project's own aliases (`https://idilewa.vercel.app`, `https://idileewa-com.vercel.app`)
  serve THIS repo's build ("Idilewa — Keep your language close").
- Therefore pointing `www.idilewa.com` at this repo's project requires the Vercel dashboard
  (Domains → move `www.idilewa.com` / `idilewa.com` to the repo's project). No `VERCEL_TOKEN` or
  `.vercel/` link exists in this environment, so it cannot be done from here. It is a config change,
  not a code change.
- Prod `/api/contact` and `/api/ai-conversation` return 404 while `/api/auth/welcome` answers 405 (GET):
  the auth function is deployed to the domain's project, the other two are not.

## Pages added (2026-11-13)
- `heritage.html` + `src/heritagePage.js` — "Heritage & Stories" library from
  `Idilewa_Heritage_17_5_Consolidated_18_Editorial_Lessons.html`. 18 editorial lessons, 6 collections,
  ages 3–5 … 16+. Images extracted to `public/assets/heritage/art-01..51.*`. The module mirrors the
  page's `localStorage` lesson writes (`idilewa_174_<id>`, `idilewa16sample`) into the Supabase
  `progress` table (`lesson_type = 'heritage'`) for signed-in learners.
- `signin.html` + `src/signinPage.js` — "Premium Sign-In v18.1" from `Idilewa_SignIn_Premium_v18_1-3.html`,
  rewritten to use the real `src/supabaseClient.js` helpers (`signIn`, `signUp`, `sendWelcomeEmail`,
  `requestPasswordReset`, `normalizeAuthError`). Demo config UI and mock mode removed; unreachable
  `settingsBtn` handler dropped (it threw and halted the module).
- Both are Vite build inputs (`vite.config.ts` `routes`) and are linked from the header CTAs, the
  mobile menu, the footer and the `base` ("Explore all pages") directory.
- `vite.config.js` was a stale duplicate and was deleted; `package.json` `build` now pins
  `--config vite.config.ts`.
- `base` was missing from `ROUTES`, so the whole "Explore all pages" directory was unreachable —
  fixed by adding it to `ROUTES` and `LABELS`.

- `https://www.idilewa.com` currently serves a DIFFERENT app: a single-page bundle
  (`/assets/app-Ca81aC0V.js`, ~1.2 MB) titled "Ìdíléwa Language Academy" whose markup uses
  `h("play",17)` helper calls (React-style) and strings such as `tutor-signup-feature-icon`,
  `Live Zoom lessons`, and `family-button`. None of those strings exist anywhere in this repo
  (checked across all local and remote branches).
- By contrast, THIS repo's `npm run build` produces `dist/assets/index-*.js` + `index-*.css`
  and no `modulepreload-polyfill-*`/`supabaseClient-*.js` chunks. The prod HTML references the
  latter, so the live site is NOT built from this repo's Vite config.
- Prod `/api/contact` and `/api/ai-conversation` return 404, while `/api/auth/welcome` answers
  405 (GET) — i.e. the auth function is deployed but contact/AI functions are not.
- Consequence: fixing the "Live Zoom lessons" label and email-routing on the LIVE site requires
  the source of that deployed React-style bundle (not this repo). This repo can only ship its own
  `www.idilewa.com` build once the correct project/domain wiring is confirmed.

## Vercel function limit (root cause of the failed previews, 2026-11-13)
- The `tapee2` Vercel team is on the **Hobby** plan, which is capped at **12 Vercel Functions per
  deployment** (https://vercel.com/docs/functions/limitations). A deployment with a 13th function
  fails with only "Deployment has failed" (no build error) — `npm run build` still passes locally.
- `main` had exactly 12 functions (`api/**/*.js`) and deployed. The two new serverless endpoints in
  this branch (`api/contact.js`, `api/ai-conversation.js`) pushed it to 14, which is why every
  preview for this branch failed. Probes confirmed the boundary: 12 functions → success,
  14 functions → failure.
- Fix: the three `api/guardian/{request,verify,approve}.js` handlers were merged into one
  catch-all `api/guardian/[...path].js` that dispatches on the trailing path segment via
  `src/server/guardianRoutes.js`. Public URLs and per-route behaviour are unchanged; the
  deployment is back to 12 functions. Keep the total at or below 12 when adding endpoints.
