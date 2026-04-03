# Arbitrum OG Quiz

A Farcaster Mini App where users take a 20-question quiz about Arbitrum. Passing (14/20) earns the right to mint an ERC1155 NFT badge on Arbitrum One.

Live at: `https://arbitrum-og-quiz.vercel.app`

---

## What It Does

Users open the app inside Warpcast, take a timed quiz, and if they pass they can mint a verifiable on-chain OG badge. The full flow:

```
Splash Screen
  → Welcome Screen (live stats)
    → Rules Screen
      → Quiz (20 questions, 15s each)
        → Calculating Screen
          → Results Pass → Mint NFT → Mint Success
          → Results Fail → Review Answers
```

---

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind v4 |
| Database | Supabase (Postgres) |
| Chain | Arbitrum One |
| Smart Contract | ERC1155 — `0xbf18b595b73bd4Fd0B6Ba204E2B5b56fEe266e53` |
| Wallet | wagmi v2 + `@farcaster/miniapp-wagmi-connector` |
| Farcaster SDK | `@farcaster/miniapp-sdk@^0.2.3` |
| Deployment | Vercel |

---

## Features

**Quiz Engine**
- 20 questions fetched from Supabase, shuffled server-side (Fisher-Yates) on every attempt
- Answer order also shuffled per question with shuffle maps stored in a signed HMAC token
- Server-side scoring — correct answers never sent to the frontend
- 15-second countdown timer per question, auto-submits on expiry
- Attempt results stored in Supabase `attempts` table

**Mint Flow**
- ECDSA signature-gated mint — server signs `keccak256(minter, tokenId, nonce, expiry, contractAddress)`
- Wallet connects silently when the pass screen appears
- On-demand wallet connect at mint click if silent connect failed
- Mint recorded in Supabase `mints` table
- User-friendly error messages for rejection, insufficient funds, already minted, expired auth
- Mint success screen shows real tx hash with Arbiscan link

**Badge Page (`/badge`)**
- Shows badge image if connected wallet has minted, styled placeholder otherwise
- Queries Supabase `mints` table via `/api/mint/status`
- View on OpenSea: `opensea.io/collection/arbitrum-og-badge`

**Farcaster Integration**
- `fc:miniapp` meta tag in `<head>` with `version: "1"` and `type: "launch_miniapp"`
- Manifest at `/.well-known/farcaster.json` with valid `accountAssociation`, `primaryCategory: "games"`, subtitle ≤ 30 chars
- `sdk.actions.ready()` called on load; after it resolves, `sdk.actions.addMiniApp()` fires 1.5s later with a duplicate-call guard
- Webhook handles `miniapp_added`, `miniapp_removed`, `notifications_enabled`, `notifications_disabled` with Ed25519 signature verification
- Notification tokens stored in Supabase `notification_tokens` table

---

## Database Schema

### `questions`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| question_text | text | The question |
| option_a–d | text | Answer options |
| correct_option | char | `'a'`–`'d'` — never sent to frontend |

### `attempts`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| wallet_address | text | User's wallet |
| score | integer | Out of 20 |
| passed | boolean | Score ≥ 14 |
| timestamp | timestamptz | When completed |

### `mints`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| wallet_address | text | Who minted |
| transaction_hash | text | On-chain tx hash |
| token_id | integer | NFT token ID |
| minted_at | timestamptz | Mint timestamp |

### `notification_tokens`
| Column | Type | Notes |
|---|---|---|
| fid | integer | Farcaster user ID (primary key) |
| token | text | Notification token |
| url | text | Notification endpoint URL |

---

## API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/questions` | GET | Returns 20 shuffled questions with signed token |
| `/api/submit` | POST | Server-side scoring, stores attempt |
| `/api/stats` | GET | Total attempts, passes, pass rate |
| `/api/mint/authorize` | POST | Checks eligibility, returns signed mint payload |
| `/api/mint/record` | POST | Records completed mint in Supabase |
| `/api/mint/status` | GET | Checks if a wallet has minted |
| `/api/webhook` | POST | Handles Farcaster webhook events |

---

## Anti-Cheat
- Correct answers stored server-side only, never sent to the frontend
- Scoring is entirely server-side via `/api/submit`
- Signed HMAC quiz token binds shuffled question/answer order to the session
- Mint eligibility verified server-side before signing
- One mint per wallet enforced at API and contract level

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
QUIZ_TOKEN_SECRET=
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_ARBITRUM_RPC_URL=
MINT_SIGNER_PRIVATE_KEY=
FARCASTER_WEBHOOK_SECRET=
```

---

## Current Status

- App loads and runs in Farcaster via direct link ✅
- Embed renders when URL is cast ✅
- Manifest valid — verified via Warpcast developer tools ✅
- Mint flow live on Arbitrum One ✅
- Farcaster miniapp store listing — pending platform-side indexing
