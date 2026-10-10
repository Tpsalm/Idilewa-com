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
| **Coding & STEAM** | `#/coding` (`coding.html`) | Code for Kids (K–8): K–2, 3–5, and 6–8 bands, Yoruba code IDE, turtle canvas, free lesson catalog. |
| **Community & Safety**| `#/about` (`about.html`) | Origin story and philosophy of Idilewa. |
| | `#/method` (`method.html`) | Pedagogical progression connecting listening, cultural context, and practice. |
| | `#/connect_teachers` (`connect_teachers.html`)| Sample tutor directory requiring parent-approved code (demo-only, no live bookings). |
| | `#/connect_students` (`connect_students.html`)| Tutor-facing view for sample student assignments with guardian verification. |
| | `#/consent` (`consent.html`) | Guardian consent demonstration issuing local verification codes with safety disclosures. |

---

## 6. Prototype Boundaries & Safeguarding Disclosures

To ensure transparency and protect learner privacy:
1. **Speech Recognition & Fluency:** Audio playback utilizes Web Speech API and Web Audio synthesizer tone generators. Voice evaluation is a prototype scoring demonstration and does not claim certified native speech AI. Authentic media requires fluent native speaker verification.
2. **Authentication & Data Storage:** User profiles, lesson completion, and proverb contributions are stored locally in the browser (`localStorage`). Supabase is integrated as a demonstration client with local offline fallback. No unverified child data is transmitted to third-party backends.
3. **Child Safeguarding & Consent:** The guardian consent flow is an interactive UX demonstration. Local browser codes do not constitute legal identity verification. Live tutoring requires production identity governance and background checks.
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

### Preview Production Build
```bash
npm run preview
```
Serves the production bundle at `http://localhost:4173`.
