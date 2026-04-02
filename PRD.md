# 📋 VentureHer — Product Requirements Document (PRD)

> **Version:** 1.0 — Hackathon MVP
> **Date:** 2025
> **Authors:** Farhana, Hina, Sheetal
> **Track:** AI/ML/Deep Learning | Women's Hackathon

---

## 1. Product Overview

### 1.1 Product Summary
VentureHer is a voice-guided, AI-powered web application that acts as a business co-founder and financial advisor for women micro-entrepreneurs in India. It removes the need for accounting knowledge, business degrees, or expensive consultants by transforming natural language and photographs into actionable business intelligence.

### 1.2 Problem Statement
Women with marketable skills (cooking, crafting, tutoring, tailoring) face three critical barriers to starting home-based businesses:

**Barrier 1 — Market Paralysis**
They don't know what specific product to sell, how to price it, or how to find their first customers. They have the skill but not the business model.

**Barrier 2 — Financial Illiteracy**
Traditional accounting apps (KhataBook, Excel) require the user to already understand accounting concepts. They track numbers but provide no guidance.

**Barrier 3 — Investment Blindness**
When they do earn profit, they lack the knowledge to invest it wisely. The result is profit that gets consumed rather than compounded.

### 1.3 Solution Statement
VentureHer bridges the "0 to 1" gap by combining:
- **Computer vision** to generate business ideas from what users already own
- **Natural language processing** to automate financial record-keeping from plain speech
- **Machine learning** to surface hidden spending patterns
- **Voice synthesis** to deliver financial coaching accessibly

### 1.4 Target Users

| User Type | Description | Example |
|---|---|---|
| **Primary** | Housewives, 25-45 years, tier 2/3 cities, basic smartphone literacy | Sunita, homemaker, wants to start tiffin service |
| **Secondary** | Unemployed women graduates, 21-28 years, urban | Riya, B.Com graduate, wants to sell handmade crafts online |
| **Tertiary** | College students monetizing skills | Priya, 20 years, sells handmade jewelry to classmates |

---

## 2. Goals & Success Metrics

### 2.1 Hackathon Goals
| Goal | Metric |
|---|---|
| Demonstrate technical depth | All 4 sponsor APIs integrated meaningfully |
| Show real ML | K-Means clustering running on live data |
| Deliver emotional impact | Judges identify with the target user |
| Complete demo | All 3 demo scenarios run without failure |

### 2.2 Product Goals (Post-Hackathon Vision)
| Goal | Metric |
|---|---|
| Reduce time to first business idea | < 30 seconds from photo to plan |
| Improve financial tracking adoption | Users log transactions daily for 2+ weeks |
| Drive investment behavior | 20% of users act on micro-investment advice |

---

## 3. User Stories

### Epic 1 — Business Idea Generation
```
As a woman with cooking skills but no business plan,
I want to photograph my kitchen and get a specific business idea,
So that I can start earning without spending hours on research.
```

**Acceptance Criteria:**
- [ ] User can upload an image or capture via camera
- [ ] Response generates within 5 seconds
- [ ] Output includes: business name, startup cost in ₹, revenue potential, 3 actionable steps
- [ ] Output is India-localized (uses ₹, mentions WhatsApp/Instagram, local markets)
- [ ] ElevenLabs reads the business idea aloud after generation

---

### Epic 2 — Conversational Financial Tracking
```
As a woman running a home business,
I want to type my daily expenses and earnings in plain language,
So that I don't have to learn accounting to track my money.
```

**Acceptance Criteria:**
- [ ] Input accepts free-form text in natural language
- [ ] Gemini extracts all transactions (multiple in one sentence)
- [ ] Each transaction is categorized: Raw Materials / Packaging / Marketing / Revenue / Other
- [ ] Extracted data is stored in Supabase with timestamp
- [ ] P&L dashboard updates immediately after submission
- [ ] Net profit/loss for the day is displayed clearly

---

### Epic 3 — Expense Pattern Intelligence
```
As a user who has been logging expenses for a week,
I want to see patterns in my spending,
So that I know where I'm losing money unnecessarily.
```

**Acceptance Criteria:**
- [ ] K-Means clustering runs when 5+ transactions exist
- [ ] Output shows 3 spending clusters with plain-language labels
- [ ] Visual chart displays clusters (scatter or color-coded bar chart)
- [ ] A human-readable insight is generated ("Your packaging costs are unusually high")
- [ ] Minimum viable: works with 5 transactions for demo

---

### Epic 4 — Voice Financial Coaching
```
As a user who has tracked a week of business activity,
I want to hear a friendly summary of my financial performance,
So that I can understand my numbers without reading a spreadsheet.
```

**Acceptance Criteria:**
- [ ] "Weekly Report" button triggers aggregation of all transactions
- [ ] Gemini generates a personalized advice script (under 80 words)
- [ ] ElevenLabs converts text to audio (Rachel voice, multilingual v2)
- [ ] Audio plays in browser without download
- [ ] Script includes: total profit, top expense category, one investment suggestion

---

### Epic 5 — Immutable Business Ledger
```
As a user who has completed a week of business activity,
I want my financial record automatically saved to GitHub,
So that I have permanent, verifiable proof of my business growth.
```

**Acceptance Criteria:**
- [ ] Weekly report triggers a GitHub commit automatically
- [ ] Committed file is a formatted `.md` with P&L summary
- [ ] File is timestamped and named by week (e.g., `week-2025-01.md`)
- [ ] Commit message is human-readable ("VentureHer: Week 1 Ledger — ₹1,300 profit")
- [ ] Repo remains private; can be shown live during demo

---

## 4. Functional Requirements

### 4.1 Backend API Endpoints

| Endpoint | Method | Input | Output |
|---|---|---|---|
| `/analyze-image` | POST | `multipart/form-data` (image file) | Business idea JSON |
| `/add-transaction` | POST | `{ text: string }` | Parsed transactions + updated P&L |
| `/get-dashboard` | GET | None | All transactions + totals + cluster data |
| `/weekly-report` | POST | None | Audio (base64) + GitHub commit confirmation |

### 4.2 Data Models

**Transaction (Supabase)**
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  amount_inr FLOAT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Business Idea (in-memory / session)**
```json
{
  "identified_items": ["flour", "butter", "eggs"],
  "business_idea": "Custom Birthday Cake Business",
  "startup_cost_inr": 1500,
  "first_week_revenue_inr": 6000,
  "first_3_steps": ["...", "...", "..."],
  "pricing_strategy": "Charge ₹350 per 500g cake"
}
```

---

## 5. Non-Functional Requirements

| Requirement | Target |
|---|---|
| **Response Time** | Vision API < 5s, Accounting < 2s, Audio < 8s |
| **Availability** | Must work reliably for 4-minute demo window |
| **Mobile Responsive** | Works on 390px width (iPhone 14) |
| **Accessibility** | Large fonts (min 16px), high contrast, clear button labels |
| **Error Handling** | All API failures show friendly fallback, app does not crash |

---

## 6. Out of Scope (MVP)

The following features are explicitly excluded from the hackathon build:

- User authentication / login / sessions
- Multi-user support
- Real-time bank account integration
- Live stock market or mutual fund data
- Hindi or regional language voice (English only)
- Native mobile app
- Payment processing

---

## 7. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Gemini Vision returns non-JSON | Medium | High | Add JSON enforcement to prompt + try/catch parser |
| ElevenLabs free tier limit hit | Low | High | Cache audio for demo scenarios in advance |
| Render cold start delays demo | Medium | Medium | Ping backend 5 mins before demo to warm it up |
| Supabase query fails | Low | High | Fallback to in-memory data array |
| WiFi unstable during demo | Medium | High | Prepare offline screenshots + cached responses |
| K-Means fails with < 3 data points | High | Low | Pre-load 15 demo transactions before presentation |

---

## 8. Competitor Analysis

| Competitor | What It Does | VentureHer's Advantage |
|---|---|---|
| **KhataBook** | Digital ledger for small businesses | KhataBook requires accounting knowledge. VentureHer requires only plain speech. |
| **Excel / Google Sheets** | Manual spreadsheet tracking | No AI, no voice, no pattern recognition. VentureHer automates everything. |
| **YouTube Finance** | Generic investment advice | Not personalized. VentureHer advises based on the user's exact ₹2,300 profit, not a general audience. |
| **Shopify** | E-commerce store builder | Too complex for Day 1. VentureHer bridges the 0→1 gap before a user needs Shopify. |
| **ChatGPT** | General AI assistant | No financial ledger, no voice coaching, no business continuity. |

---

## 9. Tech Stack Summary

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React + Vite | Fast SPA development |
| UI Components | shadcn/ui + Aceternity UI | Production-quality animations in zero time |
| Animations | Framer Motion | Smooth transitions for demo polish |
| Charts | Recharts | Easy P&L and cluster visualization |
| Backend | Python + FastAPI | Async, fast, perfect for AI API integration |
| Database | Supabase (PostgreSQL) | Free tier, real-time, zero setup |
| AI — Vision + NLP | Google Gemini 1.5 Flash | Multimodal, fast, free tier generous |
| Voice | ElevenLabs (Rachel, multilingual v2) | Highest quality, most human-sounding |
| ML | scikit-learn (K-Means) | Well-known, lightweight, demo-safe |
| Ledger | GitHub API (PyGithub) | Sponsor requirement + dramatic demo moment |
| Backend Deploy | Render | Free tier, GitHub auto-deploy |
| Frontend Deploy | Vercel | Fastest React deployment available |
