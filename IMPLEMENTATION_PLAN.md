# 🗓️ VentureHer — Implementation Plan

> **Hackathon Duration:** 8 Hours
> **Team:** Farhana (Backend), Hina (AI/Prompts), Sheetal (Frontend)
> **Stack:** FastAPI + Supabase (Backend) | React + Aceternity UI (Frontend) | Gemini + ElevenLabs + GitHub (APIs)

---

## ⚠️ Dependency Order (Critical — Read First)

Understanding who blocks whom prevents wasted time:

```
Hina (Prompts) ──► Farhana (Backend) ──► Sheetal (Frontend)
     │                    │
     │                    └── Supabase schema (independent)
     │
     └── Works independently until Farhana's routes are ready
```

**Simple rule:**
- Farhana can start **right now** without Hina
- Sheetal can start **right now** with dummy data
- When Hina joins → her prompts plug directly into Farhana's ready routes
- Integration happens at **Hour 3-4**

---

## 📋 PRE-HACKATHON CHECKLIST (Do TODAY)

### All 3 Members Together (~1 hour)
- [ ] Get Gemini API key → aistudio.google.com
- [ ] Get ElevenLabs API key + Voice ID (Rachel) → elevenlabs.io
- [ ] Get GitHub Personal Access Token → github.com/settings/tokens
- [ ] Create private GitHub repo: `ventureher-ledger`
- [ ] Create Supabase project → supabase.com (free tier)
- [ ] Create `.env` file with all keys (share via WhatsApp, NOT GitHub)
- [ ] All 3 test their local environments run

### Farhana Does Today (Backend Skeleton)
- [ ] FastAPI project setup with folder structure
- [ ] All 4 API routes defined (empty, returning dummy JSON)
- [ ] Supabase connection tested
- [ ] CORS configured for React frontend
- [ ] Verify all 3 API keys work with test scripts

### Hina Does Today (Prompt Engineering)
- [ ] Test Vision prompt with 3 different food/craft photos
- [ ] Test Accounting prompt with 10 messy text inputs
- [ ] Test Advice prompt, confirm output is under 80 words
- [ ] Save all working prompts in `prompts.py`

### Sheetal Does Today (Frontend Shell)
- [ ] Vite + React project created
- [ ] Tailwind + Aceternity UI + Framer Motion installed
- [ ] 3 screens built with dummy/hardcoded data
- [ ] Navigation between screens working
- [ ] Camera/upload component working (just UI, no API yet)

---

## ⏱️ HACKATHON DAY — Hour by Hour

### HOUR 0 — Setup & Sync (0:00 – 0:30)
**All Together:**
- Share `.env` file
- Confirm all local servers run (FastAPI + React)
- Farhana shares API response schemas with Sheetal
- Quick 5-min sync: everyone states their Hour 1 goal

**Deliverable:** Everyone coding by 0:30

---

### HOUR 1 — Core Integrations Start (0:30 – 1:30)

**Farhana (Backend):**
- [ ] Connect Supabase: create `transactions` table
- [ ] `/analyze-image` route: receive image → call Gemini Vision → return JSON
- [ ] Test with Postman/curl: upload a photo, get business idea back

**Hina (AI):**
- [ ] Plug Vision prompt into Farhana's route
- [ ] Plug Accounting prompt into `/add-transaction` route
- [ ] Verify JSON output is clean and parseable

**Sheetal (Frontend):**
- [ ] Wire up image upload to `/analyze-image` API
- [ ] Replace dummy business idea card with real API response
- [ ] Add loading spinner for image analysis wait time

**Deliverable:** Photo → Business Idea working end-to-end ✅

---

### HOUR 2-3 — Accounting Feature (1:30 – 3:00)

**Farhana (Backend):**
- [ ] `/add-transaction` route: receive text → Gemini NLP → parse JSON → store in Supabase
- [ ] `/get-transactions` route: fetch all transactions for dashboard
- [ ] Test: type messy expense text → check Supabase has new rows

**Hina (AI):**
- [ ] Fine-tune accounting prompt edge cases (vague inputs like "bought stuff")
- [ ] Build K-Means clustering function in `ml_engine.py`
- [ ] Test clustering with 10-15 dummy transactions

**Sheetal (Frontend):**
- [ ] Wire up text input to `/add-transaction`
- [ ] Live P&L table updates after each submission
- [ ] Recharts bar chart showing Revenue vs Expenses

**Deliverable:** Type transaction → See it in P&L table + chart ✅

---

### HOUR 3-4 — Voice + ML Layer (3:00 – 4:30)

**Farhana (Backend):**
- [ ] `/weekly-report` route: aggregate Supabase data → Gemini advice → ElevenLabs audio
- [ ] Return audio as base64 string to frontend
- [ ] `/commit-ledger` route: format Markdown → push to GitHub

**Hina (AI):**
- [ ] Plug K-Means output into `/weekly-report` route
- [ ] Verify ElevenLabs receives clean text (no special chars, under 200 words)
- [ ] Test GitHub commit with sample Markdown

**Sheetal (Frontend):**
- [ ] Build audio player component (play/pause, wave animation)
- [ ] Cluster visualization: scatter chart or color-coded expense cards
- [ ] "Get My Weekly Report" button → triggers `/weekly-report`

**Deliverable:** Weekly report → Audio plays → GitHub commit shows ✅

---

### HOUR 4-5 — Full Pipeline Testing (4:30 – 5:30)

**All Together:**
- [ ] Run the full demo flow: Photo → Accounting → Weekly Report → Audio → GitHub
- [ ] Fix any broken API responses
- [ ] Check mobile responsiveness (judges will look at this)
- [ ] Add error handling: show friendly messages if API fails

**Farhana specific:**
- [ ] Add try/catch to all routes
- [ ] If ElevenLabs fails → return text fallback
- [ ] If GitHub fails → log error but don't break the app

---

### HOUR 5-6 — Polish & Edge Cases (5:30 – 6:30)

**Farhana (Backend):**
- [ ] Deploy backend to Render (do this early, deployment can take 10 mins)
- [ ] Update React `.env` with Render URL instead of localhost

**Hina (AI):**
- [ ] Run 20 test inputs through accounting prompt — fix any failures
- [ ] Prepare 3 demo scenarios with pre-tested data

**Sheetal (Frontend):**
- [ ] Deploy frontend to Vercel (`vercel deploy`)
- [ ] Final UI polish: fonts, spacing, color consistency
- [ ] Test on mobile browser

**Deliverable:** App live on Vercel URL ✅

---

### HOUR 6-7 — Demo Rehearsal (6:30 – 7:30)

**All Together — Run the demo 3 times:**
1. First run: find everything that breaks
2. Second run: with fixes applied
3. Third run: timed (must be under 4 minutes)

**Prepare fallbacks:**
- [ ] Screenshot of each screen (in case WiFi dies)
- [ ] Pre-loaded demo data in Supabase (so chart isn't empty)
- [ ] Gemini responses cached for the 3 demo scenarios

---

### HOUR 7-8 — Pitch Prep (7:30 – 8:00)

**Farhana:** Final backend stability check, monitor for errors

**Hina:** Rehearse the technical explanation slide (2 mins max)

**Sheetal:** Lead the demo, practice the story opening

**Pitch Structure:**
```
0:00 - 1:00  → Story (Farhana tells the personal connection)
1:00 - 1:30  → Problem statement (3 bullets, fast)
1:30 - 4:00  → LIVE DEMO (Sheetal drives)
             → Demo 1: Vision feature
             → Demo 2: Accounting
             → Demo 3: Weekly Report + GitHub
4:00 - 4:30  → Tech stack (Hina explains ML + APIs)
4:30 - 5:00  → Impact + Why we win (Farhana closes)
```

---

## 🚨 Emergency Protocols

| Problem | Solution |
|---|---|
| Gemini API rate limit hit | Switch to `gemini-1.5-flash` (higher free limits) |
| ElevenLabs audio fails | Show text version, explain voice is the bonus layer |
| GitHub commit fails | Screenshot the `.md` file content instead |
| Render deployment fails | Run backend on localhost + use ngrok for tunnel |
| WiFi is unstable | Use pre-cached API responses (prepare JSON files) |
| K-Means has too few data points | Pre-load 15 dummy transactions in Supabase |

---

## 📁 Recommended Folder Structure

```
ventureher/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── prompts.py           # All Gemini prompts (Hina owns this)
│   ├── ml_engine.py         # K-Means clustering (Hina builds, Farhana integrates)
│   ├── github_service.py    # GitHub commit logic
│   ├── audio_service.py     # ElevenLabs integration
│   ├── db.py                # Supabase client setup
│   ├── requirements.txt
│   └── .env                 # NEVER commit this
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── VisionCapture.jsx     # Camera + upload
│   │   │   ├── BusinessCard.jsx      # Business idea result
│   │   │   ├── TransactionInput.jsx  # Accounting text input
│   │   │   ├── PLDashboard.jsx       # Charts + P&L table
│   │   │   ├── AudioPlayer.jsx       # ElevenLabs player
│   │   │   └── WeeklyReport.jsx      # Report trigger + cluster view
│   │   ├── App.jsx
│   │   ├── api.js            # All axios calls to backend
│   │   └── main.jsx
│   ├── .env                  # VITE_API_URL=your_render_url
│   └── package.json
│
├── MVP.md
├── PRD.md
├── SYSTEM_ARCHITECTURE.md
├── IMPLEMENTATION_PLAN.md
└── README.md
```

---

## ✅ Definition of "Done" for Each Feature

| Feature | Done When |
|---|---|
| Vision → Business Idea | Photo upload → JSON rendered on screen in < 5s |
| Conversational Accounting | Typed text → Row in Supabase + chart updates |
| K-Means Clustering | 10+ transactions → 3 clusters shown on chart |
| Voice Coach | "Weekly Report" click → Audio plays in browser |
| GitHub Ledger | Audio plays → New `.md` file visible in GitHub repo |
