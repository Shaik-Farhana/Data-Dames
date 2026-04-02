# 💜 VentureHer
### *The Voice-Guided AI Co-Founder for Women Micro-Entrepreneurs*

> Built at Women's Hackathon | AI/ML/Deep Learning Track
> **Team:** Farhana · Hina · Sheetal

---

## 🎯 What is VentureHer?

VentureHer is an AI-powered web application that turns any woman with a skill and a smartphone into a business owner. It eliminates the three biggest barriers to starting a home business:

- 📸 **No idea what to sell?** → Photograph your kitchen. Get a business plan in 5 seconds.
- 💬 **Scared of accounting?** → Just talk. *"I bought flour for ₹100 and sold 3 cakes for ₹900."* Done.
- 🔊 **Don't know how to invest?** → Your AI voice coach tells you exactly what to do with your profit.

---

## ✨ Features

| Feature | Tech |
|---|---|
| 📸 Vision → Business Idea Generator | Gemini 1.5 Flash (multimodal) |
| 💬 Conversational P&L Accounting | Gemini NLP + Supabase |
| 📊 Expense Pattern Intelligence | scikit-learn K-Means |
| 🔊 Voice Financial Coach | ElevenLabs (Rachel) |
| 📁 Immutable Business Ledger | GitHub API |

---

## 🏗️ Tech Stack

**Frontend:** React + Vite + Tailwind + Aceternity UI + Framer Motion
**Backend:** Python + FastAPI (Render)
**Database:** Supabase (PostgreSQL)
**AI:** Google Gemini 1.5 Flash
**Voice:** ElevenLabs multilingual v2
**ML:** scikit-learn K-Means
**Ledger:** GitHub API (PyGithub)
**Deploy:** Vercel (frontend) + Render (backend)

---

## 📁 Documentation

| File | Description |
|---|---|
| [MVP.md](./MVP.md) | Full feature set, demo scenarios, judging strategy |
| [PRD.md](./PRD.md) | Product requirements, user stories, acceptance criteria |
| [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) | Architecture diagrams, data flows, ready-to-use service code |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | 8-hour execution plan, team split, emergency protocols |

---

## 🚀 Quick Start

```bash
# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env   # Fill in your API keys
uvicorn main:app --reload

# Frontend
cd frontend
npm install
cp .env.example .env   # Add VITE_API_URL
npm run dev
```

---

## 👥 Team

| Member | Role |
|---|---|
| Farhana | Backend + API Integration |
| Hina | AI Prompt Engineering + ML |
| Sheetal | Frontend + UI/UX + Pitch |

---

*Made with 💜 to democratize financial literacy for women.*
