import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

def insert_transactions(transactions: list) -> bool:
    try:
        for t in transactions:
            supabase.table("transactions").insert({
                "type": t["type"],
                "amount_inr": t["amount_inr"],
                "category": t["category"],
                "description": t.get("description", "")
            }).execute()
        return True
    except Exception as e:
        print(f"DB insert error: {e}")
        return False

def get_all_transactions() -> list:
    try:
        result = supabase.table("transactions")\
            .select("*")\
            .order("created_at", desc=False)\
            .execute()
        return result.data
    except Exception as e:
        print(f"DB fetch error: {e}")
        return []

def get_weekly_summary() -> dict:
    transactions = get_all_transactions()
    revenue = sum(t["amount_inr"] for t in transactions if t["type"] == "income")
    expenses = sum(t["amount_inr"] for t in transactions if t["type"] == "expense")
    
    # Find top expense category
    expense_cats = {}
    for t in transactions:
        if t["type"] == "expense":
            cat = t["category"]
            expense_cats[cat] = expense_cats.get(cat, 0) + t["amount_inr"]
    
    top_category = max(expense_cats, key=expense_cats.get) if expense_cats else "Raw Materials"
    
    return {
        "transactions": transactions,
        "total_revenue": revenue,
        "total_expenses": expenses,
        "net_profit": revenue - expenses,
        "top_category": top_category
    }