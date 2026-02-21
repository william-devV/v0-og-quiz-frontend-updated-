# OG Quiz — Arbitrum OG Verification Mini-App

___________
Feb 21 7:03pm changes to be made letter

-- on the splash screen, there a tiny arbitrum quiz, remove it



--- on the welcome screen, change the OG Level from hard to med-easy


____________

A Web3 quiz mini-app that challenges users to prove their Arbitrum OG status. Pass the quiz, mint a verifiable NFT badge, and share your proof on Farcaster.

---

## What It Is

OG Quiz is a timed, 20-question quiz about Arbitrum and Web3 culture. Users who score 70% or higher earn the right to mint an on-chain OG NFT badge on Base, then share their result directly on Farcaster. It's part trivia challenge, part identity proof, part community flex.

The app lives as a standalone web app and as a Farcaster mini-app (embeddable inside Warpcast).

---

## The Full User Flow

```
App Launch
  → Splash Screen (2s, logo pulse animation)
    → Welcome Screen (marquee ticker, big headline, live stats strip)
      → Rules Screen (checkbox gate before proceeding)
        → Countdown Transition (3, 2, 1…)
          → Quiz (20 questions, 15s per question)
            → Score Calculation Screen (1-2s loading)
              → Results Screen
                ├── PASS → "Mint OG NFT & Share" button → FC cast
                └── FAIL → "Try Again" button
```

---

## Screen-by-Screen Breakdown

### 1. Splash Screen
- App name "OG QUIZ" centered with pulse animation
- Tagline: *"Prove you're an OG."*
- Auto-advances after 2 seconds
- Preloads quiz questions in the background

### 2. Welcome Screen
- Scrolling marquee ticker at top: *"PROVE YOUR OG STATUS · MINT YOUR PROOF · 20 QUESTIONS · 15 SECONDS EACH · NO SKIPPING · ARE YOU REALLY AN OG? ·"*
- Massive headline: *"They said you were an OG. Prove it."*
- Live stats strip showing: total attempted · total passed · pass rate percentage (pulled from Supabase)
- Badge: "OG LEVEL: HARD"
- Primary CTA: "Take the Quiz"
- Secondary link: "What is an OG NFT?"

### 3. Rules Screen
- Rules listed clearly:
  - 20 questions
  - 15 seconds per question
  - Single correct answer per question
  - No going back once answered
  - 70% (14/20) to pass
  - Quiz auto-submits when time expires
- Checkbox: "I understand the rules" — must be ticked to enable the button
- "Let's Go" button (disabled until checkbox ticked)
- Back link

### 4. Quiz Question Screen (×20)
- Progress bar + "Question X of 20" counter
- Large countdown timer — color shifts white → blue → red as urgency increases
- Question text in bold card
- Four answer options (A/B/C/D) — locks on selection, no changing answer
- "Next" button disabled until answer selected
- Auto-advances if timer expires (counts as wrong)
- Screen lock / app minimize: timer continues

### 5. Score Calculation Screen
- "Calculating your OG status…" with loading animation
- Runs server-side scoring (correct answers never exposed to frontend)
- Stores attempt in database

### 6. Results Screen — PASS (≥14/20)
- Shake/vibration animation on result card (celebratory, 0.4s)
- Text: *"You Passed! They were right about you, you really are an OG."*
- Score displayed: e.g. "16 / 20 — 80%"
- One button only: **"Mint OG NFT & Share"**
  - Triggers wallet transaction (wagmi/RainbowKit)
  - On confirmation → opens Farcaster cast compose with score pre-filled
  - Cast text: *"I just scored [X]/20 on the OG Quiz and earned my OG NFT. Are you an OG? [app link]"*

### 7. Results Screen — FAIL (<14/20)
- Shake/vibration animation on result card (harsher, 0.6s)
- Text: *"Unfortunately you don't seem to be an Arbitrum OG."*
- Score displayed: e.g. "11 / 20 — 55%"
- Subtext: *"You need 14/20 to qualify. Study up."*
- One button: **"Try Again"**

---

## Design System

**Style:** Neo-brutalism — thick black borders, hard offset shadows, bold typography, flat design on white canvas.

**Color Palette:**
- Background: White (`#FFFFFF`)
- Primary accent: Arbitrum Blue (`#28A0F0`)
- Secondary accent: Arbitrum Navy (`#1B2559`)
- Text: Near-black (`#0A0A0A`)
- Borders: Black, 2-3px
- Shadows: Hard 4-6px solid black offset

**Typography:** Bold display font for headings, clean sans-serif for body. No Inter, no Roboto.

**Animations:**
- Framer Motion for screen transitions and shake effects
- Pass shake: 0.4s lateral, celebratory
- Fail shake: 0.6s lateral, more displacement
- No confetti, no emojis

---

## Tech Stack

| Layer | Tool | Purpose |
|---|---|---|
| Frontend | Next.js + Tailwind | App UI |
| Animation | Framer Motion | Transitions, shake effects, timer |
| Wallet UI | RainbowKit | Connect wallet button |
| Wallet logic | wagmi | Web3 React hooks |
| Blockchain | Base | Low-fee NFT chain |
| Smart contract | Solidity + OpenZeppelin | ERC-721 NFT minting |
| Contract tooling | Hardhat | Write, test, deploy contract |
| Database | Supabase (PostgreSQL) | Questions, attempts, mints |
| NFT storage | Pinata (IPFS) | NFT metadata + images |
| Farcaster | OnchainKit | Frame integration, cast compose |
| RPC | Alchemy | Base blockchain connection |
| Deployment | Vercel | Hosting |
| Version control | GitHub | Code management |

---

## Database Schema

### `questions`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| question_text | text | The question |
| option_a | text | Answer option A |
| option_b | text | Answer option B |
| option_c | text | Answer option C |
| option_d | text | Answer option D |
| correct_option | char | 'a', 'b', 'c', or 'd' — never sent to frontend |
| quiz_version | text | e.g. 'v1' |

### `attempts`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| wallet_address | text | User's wallet |
| score | integer | Out of 20 |
| passed | boolean | Score ≥ 14 |
| timestamp | timestamptz | When completed |
| quiz_version | text | Which version they took |

### `mints`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| wallet_address | text | Who minted |
| transaction_hash | text | On-chain tx hash |
| token_id | integer | NFT token ID |
| minted_at | timestamptz | Mint timestamp |

---

## API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/questions` | GET | Returns 20 randomized questions (no correct answers) |
| `/api/submit` | POST | Receives answers, scores server-side, stores attempt |
| `/api/mint` | POST | Validates eligibility, triggers contract mint |
| `/api/stats` | GET | Returns total attempts, passes, pass rate for welcome screen |

---

## Anti-Cheat Measures
- Correct answers stored server-side only, never sent to frontend
- Scoring happens on the server via `/api/submit`
- Mint eligibility checked server-side before contract call
- One mint per wallet address enforced at API and contract level
- Question order randomized per session
- Answer option order shuffled per session

---

## NFT Metadata Structure
```json
{
  "name": "Arbitrum OG Proof #0042",
  "description": "Verified Arbitrum OG. Earned by passing the OG Quiz.",
  "image": "ipfs://Qm...",
  "attributes": [
    { "trait_type": "Score", "value": "16/20" },
    { "trait_type": "Pass Rate", "value": "80%" },
    { "trait_type": "Quiz Version", "value": "v1" },
    { "trait_type": "Date", "value": "2025-02-21" },
    { "trait_type": "OG Level", "value": "OG" }
  ]
}
```

---

## Farcaster Share Copy
**On mint success, pre-filled cast:**
> "I just scored [X]/20 on the OG Quiz and earned my OG NFT 🔵
> Think you're an OG? Prove it: [app link]"

---

## Build Order
1. **Phase 1 — Frontend** (v0 → Claude Code): All screens, static data, quiz timer logic, answer state
2. **Phase 2 — Backend**: Supabase setup, API routes, server-side scoring
3. **Phase 3 — Blockchain**: Smart contract on Base testnet, wallet connection, mint flow
4. **Phase 4 — Farcaster**: OnchainKit integration, cast compose flow, Frame metadata
5. **Phase 5 — Polish & Deploy**: Edge cases, live stats, Vercel production deploy

---

## Edge Cases
- Lost internet mid-quiz → pause and show reconnect prompt
- Wallet rejects transaction → show retry option, stay on results screen
- Already minted → show "Already minted" state, link to their existing NFT
- Quiz timer expires on last question → auto-submit and proceed to scoring
- User tries to navigate away mid-quiz → warn before leaving
