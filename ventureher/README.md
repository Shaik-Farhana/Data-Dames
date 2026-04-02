# 💜 VentureHer

**VentureHer** is an intelligent, full-stack business management application specifically designed to empower female entrepreneurs. It leverages the power of generative AI, predictive machine learning, and advanced audio processing to simplify business accounting and provide actionable financial insights. 

From validating business ideas via images to tracking transactions with plain natural language, VentureHer removes the friction of starting and managing a small business.

---

## ✨ Features

* **📷 AI-Powered Business Idea Validation**: Upload an image of your potential business idea and let Gemini Vision analyze its viability and generate suggestions.
* **✍️ Natural Language Bookkeeping**: Ditch the complex spreadsheets. Simply type "bought flour for ₹100", and the system automatically categorizes and logs it using Gemini's natural language understanding.
* **📊 Intelligent Dashboard**: View real-time running totals of revenues, expenses, and net profit.
* **🧠 Machine Learning Expense Clustering**: Our backend utilizes `scikit-learn` to analyze your transactions, identifying hidden spending patterns and clustering them effectively.
* **🎙️ Weekly Audio Reports**: Need advice on the go? VentureHer generates an AI advice text outlining your weekly business performance and converts it into a polished audio report utilizing ElevenLabs.
* **📂 Automated Ledger Commits**: For utmost transparency and version-controlled accounting, your weekly summaries are systematically committed to a GitHub repository!

---

## 🛠️ Technology Stack

**Frontend**
* **Framework:** React + Vite
* **Styling & Animations:** Vanilla CSS, Framer Motion
* **Visualizations:** Recharts
* **Network:** Axios

**Backend**
* **Framework:** FastAPI (Python)
* **AI Models:** Google Generative AI (Gemini) for text & vision parsing
* **Audio Processing:** ElevenLabs API
* **Machine Learning:** Scikit-Learn, NumPy
* **Database & BaaS:** Supabase
* **Version Control API:** PyGithub

---

## 🚀 Getting Started

To run VentureHer locally, you'll need two separate terminals—one for the FastAPI backend and one for the React frontend.

### 1. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Environment Variables:**
   Create a `.env` file in the `backend/` directory and configure the following keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   GITHUB_TOKEN=your_github_token
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```
5. **Start the FastAPI Server:**
   ```bash
   uvicorn main:app --reload
   ```
   *The API will be available at `http://localhost:8000`. You can view the interactive documentation at `http://localhost:8000/docs`.*

### 2. Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the Vite development server:**
   ```bash
   npm run dev
   ```
   *The frontend will be available at `http://localhost:5173`.*

---

## 📁 Project Structure

```
ventureher/
├── backend/                  # Python FastAPI Backend
│   ├── main.py               # Main API routes & server initialization
│   ├── gemini_service.py     # Integrations with Google Gemini LLMs
│   ├── ml_engine.py          # Scikit-learn expense clustering
│   ├── audio_service.py      # ElevenLabs TTS integration
│   ├── github_service.py     # GitHub automated commit integrations
│   ├── db.py                 # Supabase operations
│   └── requirements.txt      # Python dependencies
│
└── frontend/                 # React Frontend
    ├── package.json          # Node dependencies
    └── src/
        ├── App.jsx           # Main Frontend application
        ├── api.js            # Axios queries to FastAPI definitions
        └── ...
```

---

## 🤝 Contributing
Contributions are always welcome. Feel free to submit an issue, propose new features, or create a pull request. Let's empower more entrepreneurs together!
