# idílẹ́wà — Preserving African Culture. Promoting Technology.

A family- and community-centered web application for African language learning, oral traditions, cultural storytelling, and K–8 indigenous coding and STEAM.

---

## 1. Product Purpose & Philosophy

Idilewa (branded in the interface as **“idílẹ́wà”**) connects language acquisition with oral memory, listening, cultural context, and future-facing technology education. 
Culture is treated as **living knowledge carried by people** across generations—not as static decoration.

The experience unifies:
- **Language Discovery:** Foundation learning for Yorùbá, Igbo, Hausa, and Kiswahili, alongside planned paths for Twi, Wolof, isiZulu, and Fulfulde.
- **African Voice Trainer & Sound Studio:** 60 structured lessons across Beginner, Intermediate, and Advanced tiers, Do-Re-Mi tone melodies, and phonetic visualizers.
- **Living Stories & Oral Traditions:** Òwe (proverbs), Oríkì (praise poetry & remembrance), Ifá educational overviews, and intergenerational family stories.
- **Code for Kids (K–8 STEAM):** Indigenous coding environment (*ÈdèKoodu*) with turtle graphics, bilingual keyword maps, and grade-band curriculums.
- **Family & Educator Stewardship:** Parent/guardian consent demonstrations and tutor discovery with privacy-conscious safeguarding.

---

## 2. Design System & Tokens

The visual identity is warm, calm, editorial, and rooted in nature. It strictly adheres to the project's designated design tokens:

| Token Name | Hex Code | Role & Usage |
| :--- | :--- | :--- |
| **Ink** | `#18231d` | Primary headings, prominent copy, high-contrast marks |
| **Soft Ink** | `#334139` | Secondary text, subheadings, labels |
| **Muted Text** | `#6b776f` | Body descriptions, helper text |
| **Low-Emphasis Text** | `#89938c` | Metadata, timestamps, captions |
| **Primary Green** | `#15764a` | Primary brand color, key buttons, links |
| **Dark Green** | `#0c5737` | Hover states, brand wordmark, contrast focus |
| **Bright Green** | `#17864e` | Action badges, energy accents |
| **Border Line** | `#e7ebe5` | Subtle separators, card outlines |
| **Main Paper** | `#fffefa` | Primary application canvas |
| **Warm Cream** | `#faf9f2` | Alternate canvas, section containers |
| **Mint** | `#eaf6ec` | Language and foundational learning surfaces |
| **Blue** | `#e7f5fb` | Voice and audio accent surfaces |
| **Yellow** | `#fff5d9` | Tone highlights, code and attention tags |
| **Peach** | `#fff0e8` | Story, proverbs, and oral tradition surfaces |
| **Pink** | `#fff0f2` | Secondary soft highlights and cultural tags |
| **Lilac** | `#f2effb` | Categorical badge highlights |

- **Typography:** Inter-first sans-serif stack (`Inter, system-ui, -apple-system, sans-serif`).
- **Layout:** Maximum container width around `1200px`, soft green-tinted shadows, `22px` / `30px` rounded cards and buttons.
- **Header:** Light translucent sticky navigation with active link indicators and instant search overlay.

---

## 3. 3D Engine & Interactive Scroll Experience

The application incorporates a restrained, performant Three.js 3D engine integrated directly into the live application runtime (`src/threeScene.js`):

1. **3D Hero Talking Drum Stage (`init3DHeroCanvas`):**
   - Realistic 3D African talking drum (*Gángan*) featuring curved cedarwood body, tension cords, brass resonance rings, and an emerald gem belt.
   - Orbiting Yoruba glyph spheres (`È`, `Ẹ`, `Ọ`, `Ṣ`) with soft emissive glow.
   - Golden ambient dust and firefly particle cloud.
   - Interactive touch/drag rotation and gentle floating parallax.
2. **Scroll-Driven 5-Pillar Visual Journey:**
   - Landing page visual timeline smoothly transitioning across:
     - **Pillar 01 (Èdè):** Language & Everyday Speech
     - **Pillar 02 (Ohùn):** Voice & Tonal Melody Studio
     - **Pillar 03 (Òwe & Oríkì):** Oral Traditions & Attributed Wisdom
     - **Pillar 04 (Ìtàn):** Stories That Travel & Family Reading
     - **Pillar 05 (Koodu):** Indigenous STEAM & Code for Kids
3. **Route 3D Stages:**
   - **Coding (`#/coding`):** 3D Yoruba Hologram Matrix Cube & Rotating Glyphs (`init3DCodingCanvas`).
   - **Stories (`#/ere`, `#/oral`):** 3D Sacred Story Drum, Cowrie Shell & Magic Story Orb (`init3DStoryCanvas`).
   - **Auth & Consent (`#/login`, `#/consent`):** 3D Sacred Shield & Gateway Key (`init3DAuthCanvas`).
   - **Audio Studio (`#/trainer`):** 3D Waveform Audio Visualizer (`init3DAudioVisualizer`).
4. **Interactive 3D Perspective Card Tilt (`init3DTiltEngine`):**
   - Dynamic 3D depth and radial light glare on cards during mouse hover.
5. **Accessibility & Fallbacks:**
   - **WebGL Fallback:** If WebGL is unavailable or fails, gracefully displays an accessible cultural fallback card (`.webgl-fallback-stage`).
   - **prefers-reduced-motion:** Fully respects user motion preferences. Disables continuous spin loops, eliminates hover tilts, and renders static 3D models with instant transitions.

---

## 4. Architecture & Module Integration

The application is bundled with Vite as an ES module web application:

- **`app.js`:** Central routing, state management, UI rendering, event delegation, and module coordinator.
- **`src/threeScene.js`:** Three.js 3D scene engine, orbit controls, audio visualizer, card tilt engine, and WebGL fallbacks.
- **`src/translationEngine.js`:** Multi-language dictionary, word lexicons, Web Speech API audio playback (`speakText`), and Web Audio API tone pitch synthesizer (`playTonePitch` for Dò-Re-Mí).
- **`src/yorubaCodeEngine.js`:** *ÈdèKoodu* Yoruba coding keywords, curriculum lessons, transpiler, turtle graphics canvas, and safe sandbox executor (`executeYorubaCode`).
- **`src/vowelsConsonantsData.js`:** Yoruba oral vowels, nasal vowels, consonants, and tone pitch reference guides with interactive soundboard.
- **`src/supabaseClient.js`:** Supabase authentication and database persistence layer with local browser storage offline-first fallback.
- **`styles.css`:** Curated design tokens, responsive breakpoints, typography, 3D scroll animations, and accessibility styles.

---

## 5. Page & Route Inventory (36 HTML Entries)

All 36 HTML entries declared in `vite.config.ts` are supported:

| Group | Route | Purpose & Key Features |
| :--- | :--- | :--- |
| **Home & Discovery** | `#/index` (`index.html`) | Main landing page, dual-view 3D hero switcher, 5-pillar visual journey, audience paths. |
| | `#/base` (`base.html`) | Complete platform directory classified by learning, culture, and technology. |
| | `#/languages` (`languages.html`) | Primary paths (Yorùbá, Igbo, Hausa, Swahili) + growing paths + interactive soundboard. |
| | `#/course` (`course.html`) | Language course tracks (3 levels, 4 modules per level, 5 lessons per module). |
| | `#/lesson` (`lesson.html`) | Focused lesson practice, prompts, answer validation, and progress rewards. |
| | `#/kids` (`kids.html`) | Child-centered learning portal with playful stories and coding. |
| | `#/individuals` (`individuals.html`) | Independent learner & heritage reconnection pathways. |
| | `#/schools` (`schools.html`) | Classroom educator guide with preview-only school interest inquiry. |
| | `#/tutor` (`tutor.html`) | Informational introduction to tutor-led conversational learning. |
| | `#/profile` (`profile.html`) | Learner progress dashboard, points, streaks, badges (stored in local browser state). |
| | `#/login` (`login.html`) | Persona-based authentication (child, adult, parent, educator) with 3D shield and Supabase notice. |
| | `#/pricing` (`pricing.html`) | Preview family/explorer plans; explicitly non-billing demonstration. |
| **Voice & Speech** | `#/trainer` (`trainer.html`) | Voice African Language Trainer: 6 languages, 60 audio lessons, Do-Re-Mi soundboard, 3D visualizer. |
| | `#/voice_lessons` (`voice_lessons.html`) | Route alias & standalone shell resolving to the Voice Trainer studio. |
| | `#/voices` (`voices.html`) | Sample greeting library for Yorùbá, Igbo, Hausa, and Swahili with native speech audio. |
| **Culture & Stories** | `#/ere` (`ere.html`) | Living story shelf featuring shared family tales and save controls. |
| | `#/ere_game` (`ere_game.html`) | “The story that travelled” interactive reading and comprehension reflection. |
| | `#/oral` (`oral.html`) | Oral traditions gateway (Oríkì, Òwe, spoken word, and song). |
| | `#/oral_genre` (`oral_genre.html`) | Guided genre index linking attribution, speaker context, and consent. |
| | `#/oriki` (`oriki.html`) | Yorùbá praise poetry & remembrance, exploring rhythm, speaker, and permission. |
| | `#/owe` (`owe.html`) | Proverb gateway: original text, translations, stories, and reflection journey. |
| | `#/owe_add` (`owe_add.html`) | Proverb contribution form with consent checkbox (stored on current device only). |
| | `#/owe_detail` (`owe_detail.html`) | Proverb breakdown for *“Sùúrù ni baba ìwà”* (noted as one common rendering). |
| | `#/owe_story` (`owe_story.html`) | Educational classroom story about Dami & the okra seed (explicitly not a traditional folktale). |
| | `#/owe_reflection` (`owe_reflection.html`) | Personal reflection step with explicit privacy notice. |
| | `#/ifa` (`ifa.html`) | Educational context for Ifá and Yorùbá knowledge systems (not spiritual advice). |
| | `#/ifa_odu` (`ifa_odu.html`) | Cultural note on Odu poetry with community attribution guidance. |
| | `#/guides` (`guides.html`) | Living culture guides: greetings, naming traditions, customs, and festivals. |
| | `#/human` (`human.html`) | People and community portal highlighting educators and culture bearers. |
| | `#/keepers` (`keepers.html`) | Culture keepers page foregrounding attribution, privacy, and community agency. |
| **Coding & STEAM** | `#/coding` (`coding.html`) | Code for Kids (K–8): grade bands, African-language coding lessons, browser HTML/CSS/JavaScript previews, and additional compiler runtimes when the private runner is configured. |
| **Community & Safety**| `#/about` (`about.html`) | Origin story and philosophy of Idilewa. |
| | `#/method` (`method.html`) | Pedagogical progression connecting listening, cultural context, and practice. |
| | `#/connect_teachers` (`connect_teachers.html`)| Sample tutor directory requiring parent-approved code (demo-only, no live bookings). |
| | `#/connect_students` (`connect_students.html`)| Tutor-facing view for sample student assignments with guardian verification. |
| | `#/consent` (`consent.html`) | Guardian consent demonstration issuing local verification codes with safety disclosures. |

---

## 6. Prototype Boundaries & Safeguarding Disclosures

To ensure transparency and protect learner privacy:
1. **Speech Recognition & Fluency:** Audio playback utilizes Web Speech API and Web Audio synthesizer tone generators. Voice evaluation is a prototype scoring demonstration and does not claim certified native speech AI. Authentic media requires fluent native speaker verification.
2. **Authentication & Data Storage:** Sign-up, email-code verification, sign-in and sign-out use Supabase Auth when configured. Account metadata and learner-record APIs are available, but not every progress, code or voice interaction in the app is yet connected to remote storage; unconnected state remains browser-local. Remote account/database delivery has not been verified against the production project.
3. **Child Safeguarding & Consent:** Child sign-up requires a guardian email approval request and one-time code through the Vercel API. The educator path requires a server-verified, single-use invitation. Both paths remain unavailable until their database migration and server email settings are configured. This workflow does not replace legal identity verification or educator background checks; live tutoring remains disabled.
4. **Payments & Subscriptions:** Pricing cards are preview concepts only. No live financial transactions or payment gateways are configured.
5. **Cultural Attribution:** Proverbs, Oríkì, and Ifá introductions are educational overviews and explicitly emphasize community permission, speaker context, and oral attribution.

---

## 7. Running & Building Locally

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
npm install
```

### Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Multi-Page Production Build
```bash
npm run build
```
Vite bundles all 36 HTML entry points and compiles assets to the `dist/` directory.

### IDE and authentication services

The Code page runs Yorùbá/Igbo/Hausa/Kiswahili lessons and HTML, CSS, and JavaScript previews in the browser. Additional compiler languages are available only when the app is deployed with its Vercel API routes and a reachable private Judge0 CE service. The API reports installed languages rather than promising that every allowlisted runtime is installed.

Configure these values in `.env.local` for the Vite client and in the Vercel project environment settings for production:

```dotenv
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
JUDGE0_URL=https://your-private-judge0-service.example
JUDGE0_AUTH_TOKEN=your-private-runner-token
```

`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are public client configuration; enforce access with Supabase Auth policies and database row-level security. For existing deployments, `SUPABASE_PUBLIC_URL` and `SUPABASE_ANON_KEY` are also supported; Vite exposes only these two explicitly named variables to browser code. `JUDGE0_URL` and `JUDGE0_AUTH_TOKEN` are server-side secrets and must never use the `VITE_` prefix or be placed in browser code. Keep Judge0 private and configure execution time and memory limits.

The production canonical site is `https://www.idilewa.com`. The Vercel project redirects its apex and stable Vercel aliases to this hostname; use the DNS records shown in the Vercel domain settings for both `idilewa.com` and `www.idilewa.com`.

Use `vercel dev` to exercise the Vercel API routes locally; plain `npm run dev` serves the Vite front end and does not provide `/api/code/*`. GitHub Pages can host the static front end, but not these API routes, so compiler languages and configured Supabase sign-in require the Vercel deployment. Treat GitHub Pages as a static preview unless its workflow is intentionally migrated.

### Supabase account setup and operations

The migration files in this repository are not proof that a remote database has been provisioned. In the intended Supabase project, link the repository and apply pending migrations in order:

1. `supabase/migrations/20261016000000_initial_schema.sql` (base tables and owner-only profile access).
2. `supabase/migrations/20261016010000_guardian_consent.sql` (guardian approval and child account checks).
3. `supabase/migrations/20261017000000_account_security_and_educator_invites.sql` (role protection and one-time educator invitations).

Run `supabase link --project-ref <project-ref>` and `supabase db push --linked` after verifying the target project. Do not enable account registration until the migrations complete successfully; deployment does not apply database migrations. Never test account creation against production with an unowned test address.

Configure the Supabase Auth email template to send the numeric `{{ .Token }}` code for sign-up, sign-in, and password recovery; enable email confirmation and allow the production URL in Auth redirect settings. Set the minimum password length to 12 in the Supabase Auth password policy. The app enforces 12–128 characters plus uppercase, lowercase, number and symbol at sign-up and password recovery; existing sign-in passwords are not blocked by that client-side minimum. All account types can request an individual email OTP to sign in or recover a password; the account role is verified against the private profile after code validation. Actual inbox delivery depends on the Supabase SMTP/provider configuration and must be tested using a mailbox you control. Keep local and production auth configuration pointed at their intended projects; accounts do not transfer between Supabase projects.

New child registration stays paused until guardian approval email delivery has a sender on a domain verified in Resend. Existing child accounts can still sign in; adult and invited educator registration remain available. Do not set `RESEND_FROM_EMAIL` to a public mailbox address such as Gmail.

Configure these server-only Vercel variables for welcome emails, guardian approvals and educator invites:

```dotenv
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
GUARDIAN_TOKEN_SECRET=use-a-random-secret-of-at-least-32-characters
APP_BASE_URL=https://your-production-domain.example
RESEND_API_KEY=your-email-provider-api-key
RESEND_FROM_EMAIL=Idilewa <no-reply@your-verified-domain.example>
```

After Supabase creates an account, the app requests a welcome email from `/api/auth/welcome`. The server verifies the new account through Supabase and sends the message through Resend to the email address on that account; it does not depend on the user remaining signed in. The responsive welcome message introduces Idilewa and four ways to begin: language learning, voice practice, stories and culture, and coding/STEAM. Its sign-in link returns the user to the canonical production login page. Supabase still sends the separate sign-up verification code, so configure its Auth email template to use `{{ .Token }}` as described above. A failed welcome-email delivery is reported without discarding the newly created account.

Never expose `SUPABASE_SERVICE_ROLE_KEY`, `GUARDIAN_TOKEN_SECRET` or the Resend key in a `VITE_` variable. Verify the sender domain and rate-limit policies before launch. Set `APP_BASE_URL` to the canonical HTTPS site origin. With `GUARDIAN_TOKEN_SECRET` set to the same secret in your shell, run `node scripts/create-educator-invite.mjs`; provide the printed SQL to a trusted Supabase operator, then share the code with the intended educator once. The database consumes it atomically during account creation.

Before serving real users, configure automated database backups/PITR for the selected Supabase plan, document retention and deletion policies, restrict production access, and test restoring a backup into a separate project. Schedule review of database logs, Auth/email delivery, API errors and rate limits. These operational controls are project/provider settings and are not established by the repository alone.

Lesson completion and code attempts use the account-backed Supabase tables when a user is signed in; database failures are shown rather than silently treated as successful saves. The client also exposes remote voice-record methods, but the current voice score is simulated and is not persisted or a verified assessment. Guest records and significant learning UI state remain local, so cross-device continuity for every activity is not yet complete.

### Preview Production Build
```bash
npm run preview
```
Serves the production bundle at `http://localhost:4173`.
