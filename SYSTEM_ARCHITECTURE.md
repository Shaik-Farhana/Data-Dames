# 🏗️ VentureHer — System Architecture

> **Version:** 1.0 — Hackathon MVP
> **Stack:** React + FastAPI + Supabase + Gemini + ElevenLabs + GitHub

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER (Browser)                           │
│                React App — deployed on Vercel                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS (REST API calls)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND LAYER                               │
│              Python FastAPI — deployed on Render                │
│                                                                 │
│   ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│   │  /analyze   │  │  /add-       │  │   /weekly-report     │  │
│   │  -image     │  │  transaction │  │                      │  │
│   └──────┬──────┘  └──────┬───────┘  └──────────┬───────────┘  │
│          │                │                     │              │
└──────────┼────────────────┼─────────────────────┼──────────────┘
           │                │                     │
     ┌─────▼─────┐   ┌──────▼──────┐    ┌─────────▼──────────┐
     │  Google   │   │  Supabase   │    │   Gemini (NLP)     │
     │  Gemini   │   │ PostgreSQL  │    │   → ElevenLabs     │
     │  Vision   │   │  (DB Store) │    │   → GitHub API     │
     └───────────┘   └─────────────┘    └────────────────────┘
```

---

## 2. Component-by-Component Breakdown

### 2.1 Frontend — React (Vercel)

```
src/
├── App.jsx                    # Router, global state
├── api.js                     # All backend calls (axios)
│
├── components/
│   ├── VisionCapture.jsx      # Camera + file upload UI
│   ├── BusinessCard.jsx       # Renders business idea result
│   ├── TransactionInput.jsx   # Text input + submit
│   ├── PLDashboard.jsx        # Recharts P&L bar chart
│   ├── ClusterChart.jsx       # K-Means scatter visualization
│   ├── AudioPlayer.jsx        # ElevenLabs audio playback
│   └── WeeklyReport.jsx       # Report trigger + display
│
└── .env
    └── VITE_API_URL=https://ventureher-api.onrender.com
```

**State Management:** React useState + useEffect (no Redux — keep it simple)

**Key Libraries:**
```json
{
  "react": "^18",
  "vite": "^5",
  "tailwindcss": "^3",
  "framer-motion": "^11",
  "recharts": "^2",
  "axios": "^1",
  "@shadcn/ui": "latest"
}
```

---

### 2.2 Backend — FastAPI (Render)

```
backend/
├── main.py           # App entry, routes, CORS
├── prompts.py        # All Gemini prompt templates (Hina owns)
├── ml_engine.py      # K-Means clustering logic
├── gemini_service.py # Gemini API calls (vision + NLP)
├── audio_service.py  # ElevenLabs text-to-speech
├── github_service.py # GitHub commit logic
├── db.py             # Supabase client + queries
└── requirements.txt
```

**requirements.txt:**
```
fastapi==0.110.0
uvicorn==0.27.0
python-multipart==0.0.9
google-generativeai==0.5.0
elevenlabs==1.1.0
PyGithub==2.3.0
supabase==2.4.0
scikit-learn==1.4.0
numpy==1.26.4
Pillow==10.3.0
python-dotenv==1.0.1
```

---

### 2.3 Database — Supabase

**Table: `transactions`**
```sql
CREATE TABLE transactions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type         TEXT NOT NULL,      -- 'expense' | 'income'
  amount_inr   FLOAT NOT NULL,
  category     TEXT NOT NULL,      -- 'Raw Materials' | 'Packaging' | 'Marketing' | 'Revenue' | 'Other'
  description  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

**Supabase Access:**
- Use `anon` public key for demo (no auth needed for hackathon)
- Enable Row Level Security: OFF for demo simplicity
- Enable Realtime on `transactions` table for live dashboard updates

---

## 3. Data Flow Diagrams

### Flow 1 — Vision to Business Idea

```
User taps "Show Me What You Have"
         │
         ▼
   [React: VisionCapture.jsx]
   Camera capture OR file upload
   → Image converted to base64
         │
         ▼ POST /analyze-image (multipart/form-data)
   [FastAPI: main.py]
   Reads image bytes
         │
         ▼
   [gemini_service.py]
   Sends image + VISION_PROMPT to Gemini 1.5 Flash
         │
         ▼
   Gemini returns JSON string
         │
         ▼
   [FastAPI] Parses JSON, returns to frontend
         │
         ▼ 200 OK { business_idea, steps, cost... }
   [React: BusinessCard.jsx]
   Renders business idea card with animation
         │
         ▼
   [React: AudioPlayer.jsx]
   Optional: reads idea aloud via ElevenLabs
```

---

### Flow 2 — Conversational Accounting

```
User types: "bought dal for 200, sold 5 tiffins at 80 each"
         │
         ▼ POST /add-transaction { text: "..." }
   [FastAPI: main.py]
         │
         ▼
   [gemini_service.py]
   Sends text + ACCOUNTING_PROMPT to Gemini
         │
         ▼
   Gemini returns:
   [
     { type: "expense", amount: 200, category: "Raw Materials" },
     { type: "income",  amount: 400, category: "Revenue" }
   ]
         │
         ▼
   [db.py] Inserts both rows into Supabase `transactions`
         │
         ▼
   [ml_engine.py] Runs K-Means if transactions >= 5
         │
         ▼ Returns: { transactions, net_profit, clusters }
   [React: PLDashboard.jsx]
   Chart animates with new data
```

---

### Flow 3 — Weekly Report

```
User clicks "Get My Weekly Report"
         │
         ▼ POST /weekly-report
   [FastAPI: main.py]
         │
         ▼
   [db.py] Fetches all transactions from Supabase
         │
         ▼ Aggregates:
         total_revenue, total_expenses, net_profit, top_category
         │
         ▼
   [gemini_service.py]
   Sends aggregated data + ADVICE_PROMPT to Gemini
   → Returns 80-word personalized script
         │
         ├──► [audio_service.py]
         │    Sends script to ElevenLabs (Rachel, multilingual_v2)
         │    → Returns audio bytes → base64 encoded
         │
         └──► [github_service.py]
              Formats Markdown ledger
              → Commits to ventureher-ledger repo
              → Returns commit URL
         │
         ▼ Returns: { audio_base64, commit_url, report_text }
   [React: WeeklyReport.jsx]
   AudioPlayer plays audio
   Shows GitHub commit link
```

---

## 4. API Service Files (Ready to Use)

### gemini_service.py
```python
import google.generativeai as genai
import json
import re
from PIL import Image
import io

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def analyze_image(image_bytes: bytes) -> dict:
    image = Image.open(io.BytesIO(image_bytes))
    response = model.generate_content([image, VISION_PROMPT])
    return parse_json_response(response.text)

def parse_transaction(text: str) -> dict:
    response = model.generate_content(
        ACCOUNTING_PROMPT.format(user_input=text)
    )
    return parse_json_response(response.text)

def generate_advice(revenue, expenses, profit, top_category) -> str:
    response = model.generate_content(
        ADVICE_PROMPT.format(
            revenue=revenue,
            expenses=expenses,
            profit=profit,
            top_category=top_category
        )
    )
    return response.text.strip()

def parse_json_response(text: str) -> dict:
    # Strip markdown fences if present
    clean = re.sub(r'```json|```', '', text).strip()
    return json.loads(clean)
```

---

### audio_service.py
```python
import base64
from elevenlabs.client import ElevenLabs
import os

client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))
VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID")  # Rachel

def text_to_audio_base64(text: str) -> str:
    audio_stream = client.text_to_speech.convert(
        voice_id=VOICE_ID,
        text=text,
        model_id="eleven_multilingual_v2",
        voice_settings={
            "stability": 0.7,
            "similarity_boost": 0.8
        }
    )
    audio_bytes = b"".join(audio_stream)
    return base64.b64encode(audio_bytes).decode("utf-8")
```

---

### github_service.py
```python
from github import Github
from datetime import datetime
import os

def commit_ledger(report_data: dict) -> str:
    g = Github(os.getenv("GITHUB_TOKEN"))
    repo = g.get_repo(os.getenv("GITHUB_REPO"))

    week = datetime.now().strftime("%Y-W%U")
    filename = f"ledgers/week-{week}.md"

    content = f"""# VentureHer Weekly Ledger — {week}

## 📊 Summary
| Metric | Amount |
|---|---|
| Total Revenue | ₹{report_data['revenue']} |
| Total Expenses | ₹{report_data['expenses']} |
| **Net Profit** | **₹{report_data['profit']}** |
| Top Expense | {report_data['top_category']} |

## 💡 AI Coach Advice
{report_data['advice']}

## 📁 Transactions
{report_data['transactions_table']}

---
*Generated by VentureHer AI — {datetime.now().isoformat()}*
"""
    try:
        existing = repo.get_contents(filename)
        repo.update_file(filename, f"VentureHer: {week} Ledger update", content, existing.sha)
    except:
        repo.create_file(filename, f"VentureHer: {week} Ledger — ₹{report_data['profit']} profit", content)

    return f"https://github.com/{os.getenv('GITHUB_REPO')}/blob/main/{filename}"
```

---

### ml_engine.py
```python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import numpy as np

CATEGORY_MAP = {
    "Raw Materials": 0,
    "Packaging": 1,
    "Marketing": 2,
    "Revenue": 3,
    "Other": 4
}

def cluster_expenses(transactions: list) -> dict:
    expenses = [t for t in transactions if t["type"] == "expense"]

    if len(expenses) < 3:
        return {
            "clusters": [],
            "insight": "Log at least 3 expenses to see spending patterns.",
            "available": False
        }

    features = [
        [t["amount_inr"], CATEGORY_MAP.get(t["category"], 4)]
        for t in expenses
    ]

    X = StandardScaler().fit_transform(features)
    n_clusters = min(3, len(features))
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    labels = kmeans.fit_predict(X)

    # Find the cluster with highest average cost = biggest profit leak
    cluster_costs = {}
    for i, label in enumerate(labels):
        cluster_costs.setdefault(label, []).append(features[i][0])

    biggest_leak_cluster = max(cluster_costs, key=lambda k: np.mean(cluster_costs[k]))
    
    # Label each transaction with its cluster
    labeled = []
    for i, t in enumerate(expenses):
        labeled.append({**t, "cluster": int(labels[i])})

    insight = f"Your biggest spending cluster averages ₹{np.mean(cluster_costs[biggest_leak_cluster]):.0f} per transaction. Consider reducing frequency here."

    return {
        "labeled_transactions": labeled,
        "insight": insight,
        "n_clusters": n_clusters,
        "available": True
    }
```

---

## 5. Environment Variables Reference

```bash
# .env — Backend (NEVER commit to GitHub)
GEMINI_API_KEY=AIza...
ELEVENLABS_API_KEY=sk_...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM   # Rachel
GITHUB_TOKEN=github_pat_...
GITHUB_REPO=yourusername/ventureher-ledger
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=eyJ...

# .env — Frontend (safe to expose, Vite prefix required)
VITE_API_URL=https://ventureher-api.onrender.com
```

---

## 6. Deployment Architecture

```
GitHub Repository
       │
       ├── /backend  ──► Render (auto-deploy on push)
       │                  URL: ventureher-api.onrender.com
       │                  Free tier: 512MB RAM, sleeps after 15min inactivity
       │                  ⚠️ Ping before demo to wake it up
       │
       └── /frontend ──► Vercel (auto-deploy on push)
                          URL: ventureher.vercel.app
                          Free tier: unlimited deployments
```

**Render Setup:**
```
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
Environment Variables: Add all from .env in Render dashboard
```

**Vercel Setup:**
```
Framework: Vite
Build Command: npm run build
Output Directory: dist
Environment Variables: Add VITE_API_URL in Vercel dashboard
```

---

## 7. Security Notes (For Hackathon)

| Item | Status | Note |
|---|---|---|
| API keys in `.env` | ✅ Safe | Never committed to GitHub |
| Supabase RLS | ⚠️ Disabled | OK for demo, enable post-hackathon |
| GitHub repo | ✅ Private | Ledger data is private |
| CORS | ⚠️ Open (`*`) | OK for demo, restrict post-hackathon |
| No authentication | ⚠️ Accepted | Single-user demo, not a risk |
