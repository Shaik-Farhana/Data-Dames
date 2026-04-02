import os
import json
import re
from PIL import Image
import io

from dotenv import load_dotenv
from prompts import VISION_PROMPT, ACCOUNTING_PROMPT, ADVICE_PROMPT

load_dotenv()
from google import genai
client_gemini = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def parse_json_safe(text: str) -> dict:
    """Strips markdown fences and parses JSON safely"""
    clean = re.sub(r'```json|```', '', text).strip()
    try:
        return json.loads(clean)
    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        print(f"Raw text was: {text}")
        return {}

def analyze_image(image_bytes: bytes) -> dict:
    try:
        import PIL.Image
        import io
        image = PIL.Image.open(io.BytesIO(image_bytes))
        response = client_gemini.models.generate_content(
            model="gemini-2.0-flash",
            contents=[VISION_PROMPT, image]
        )
        result = parse_json_safe(response.text)
        if not result:
            return {
                "identified_items": ["various ingredients"],
                "business_idea": "Home Food Business",
                "why_it_fits": "You have the ingredients to start cooking for customers",
                "startup_cost_inr": 1000,
                "first_week_revenue_potential_inr": 3000,
                "first_3_steps": [
                    "Post in 3 local WhatsApp groups today",
                    "Start with 5 trial orders for friends",
                    "Collect feedback and set your price"
                ],
                "pricing_strategy": "Start at ₹100-200 per portion"
            }
        return result
    except Exception as e:
        print(f"Vision error: {e}")
        raise

def parse_transaction(text: str) -> dict:
    try:
        prompt = ACCOUNTING_PROMPT.format(user_input=text)
        response = client_gemini.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        result = parse_json_safe(response.text)
        if not result or "transactions" not in result:
            return {
                "transactions": [],
                "net_profit_inr": 0,
                "summary": "Could not parse. Try: 'bought flour for ₹100'"
            }
        return result
    except Exception as e:
        print(f"Accounting error: {e}")
        raise

def generate_advice(revenue, expenses, profit, top_category) -> str:
    try:
        prompt = ADVICE_PROMPT.format(
            revenue=revenue, expenses=expenses,
            profit=profit, top_category=top_category
        )
        response = client_gemini.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print(f"Advice error: {e}")
        return f"Great work! You made ₹{profit} profit this week. Keep going!"