# hina_test.py
from google import genai
import os, json, re
from dotenv import load_dotenv
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def test(prompt, label):
    print(f"\n{'='*50}")
    print(f"INPUT: {label}")
    r = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
    text = r.text.strip()
    print(f"RAW OUTPUT:\n{text}")
    # Try to parse as JSON
    try:
        clean = re.sub(r'```json|```', '', text).strip()
        parsed = json.loads(clean)
        print(f"✅ VALID JSON — keys: {list(parsed.keys())}")
    except:
        print(f"❌ INVALID JSON — fix the prompt!")

from prompts import ACCOUNTING_PROMPT

# Test these 6 inputs — ALL must return valid JSON
test(ACCOUNTING_PROMPT.format(user_input="bought atta for 180, sold 6 rotis at 20 each"), "normal input")
test(ACCOUNTING_PROMPT.format(user_input="spent 200 on stuff"), "vague input")
test(ACCOUNTING_PROMPT.format(user_input="made 500 today"), "income only")
test(ACCOUNTING_PROMPT.format(user_input="bought 500g paneer 120rs sold 3 dishes at 100"), "multiple items")
test(ACCOUNTING_PROMPT.format(user_input="nothing today"), "empty day")
test(ACCOUNTING_PROMPT.format(user_input="sold tiffins 80 80 80 bought dal 120 oil 60"), "messy numbers")