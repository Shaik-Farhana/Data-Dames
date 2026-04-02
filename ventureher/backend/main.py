import os
import json
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from gemini_service import analyze_image, parse_transaction, generate_advice
from audio_service import text_to_audio_base64
from github_service import commit_ledger
from ml_engine import cluster_expenses
from db import insert_transactions, get_all_transactions, get_weekly_summary

load_dotenv()

app = FastAPI(title="VentureHer API", version="1.0.0")

# CORS — allow all origins for hackathon
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# ROUTE 1: Health check (test your server is up)
# ─────────────────────────────────────────────
@app.get("/")
def health_check():
    return {"status": "VentureHer API is running 💜", "version": "1.0.0"}


# ─────────────────────────────────────────────
# ROUTE 2: Analyze image → business idea
# ─────────────────────────────────────────────
@app.post("/analyze-image")
async def analyze_image_route(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        image_bytes = await file.read()
        
        if len(image_bytes) > 10 * 1024 * 1024:  # 10MB limit
            raise HTTPException(status_code=400, detail="Image too large. Max 10MB.")
        
        result = analyze_image(image_bytes)
        return {"success": True, "data": result}
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in analyze_image_route: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────
# ROUTE 3: Add transaction from natural language
# ─────────────────────────────────────────────
class TransactionInput(BaseModel):
    text: str

@app.post("/add-transaction")
async def add_transaction_route(data: TransactionInput):
    try:
        if not data.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Parse with Gemini
        parsed = parse_transaction(data.text)
        
        if not parsed.get("transactions"):
            return {
                "success": False,
                "message": "Could not extract transactions. Try: 'bought flour for ₹100'"
            }
        
        # Save to Supabase
        insert_transactions(parsed["transactions"])
        
        # Get updated dashboard data
        all_transactions = get_all_transactions()
        clusters = cluster_expenses(all_transactions)
        
        # Calculate running totals
        total_revenue = sum(t["amount_inr"] for t in all_transactions if t["type"] == "income")
        total_expenses = sum(t["amount_inr"] for t in all_transactions if t["type"] == "expense")
        
        return {
            "success": True,
            "parsed": parsed,
            "dashboard": {
                "transactions": all_transactions,
                "total_revenue": total_revenue,
                "total_expenses": total_expenses,
                "net_profit": total_revenue - total_expenses,
                "clusters": clusters
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in add_transaction_route: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────
# ROUTE 4: Get dashboard data
# ─────────────────────────────────────────────
@app.get("/dashboard")
async def get_dashboard():
    try:
        summary = get_weekly_summary()
        clusters = cluster_expenses(summary["transactions"])
        
        return {
            "success": True,
            "data": {
                **summary,
                "clusters": clusters
            }
        }
    except Exception as e:
        print(f"Error in get_dashboard: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────
# ROUTE 5: Generate weekly report → audio + GitHub
# ─────────────────────────────────────────────
@app.post("/weekly-report")
async def weekly_report_route():
    try:
        # Get all data
        summary = get_weekly_summary()
        
        if summary["net_profit"] == 0 and summary["total_revenue"] == 0:
            return {
                "success": False,
                "message": "No transactions found. Add some entries first!"
            }
        
        # Generate AI advice text
        advice_text = generate_advice(
            revenue=summary["total_revenue"],
            expenses=summary["total_expenses"],
            profit=summary["net_profit"],
            top_category=summary["top_category"]
        )
        
        # Convert to audio
        audio_base64 = text_to_audio_base64(advice_text)
        
        # Commit to GitHub
        report_data = {
            **summary,
            "advice": advice_text
        }
        github_url = commit_ledger(report_data)
        
        return {
            "success": True,
            "data": {
                "advice_text": advice_text,
                "audio_base64": audio_base64,
                "github_url": github_url,
                "summary": {
                    "total_revenue": summary["total_revenue"],
                    "total_expenses": summary["total_expenses"],
                    "net_profit": summary["net_profit"],
                    "top_category": summary["top_category"]
                }
            }
        }
    
    except Exception as e:
        print(f"Error in weekly_report_route: {e}")
        raise HTTPException(status_code=500, detail=str(e))