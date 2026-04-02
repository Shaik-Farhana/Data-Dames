"""
quick_test.py  — run ONE prompt at a time so you don't burn quota.

Usage:
    python quick_test.py accounting   ← tests ACCOUNTING_PROMPT
    python quick_test.py advice       ← tests ADVICE_PROMPT
    python quick_test.py vision       ← tests VISION_PROMPT (text-only fallback)
"""

import sys, json, os
from google import genai
from dotenv import load_dotenv
load_dotenv()

from prompts import ACCOUNTING_PROMPT, ADVICE_PROMPT
from demo_data import DEMO_SCENARIO_C_EXPECTED

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
mode = sys.argv[1] if len(sys.argv) > 1 else "accounting"

# ── pick the prompt ────────────────────────────────────────────────────────────
if mode == "accounting":
    sample = "bought 2kg atta for 180, sold 6 rotis at 20 each"
    prompt = ACCOUNTING_PROMPT.format(user_input=sample)
    expect_json = True
    print(f"Testing ACCOUNTING_PROMPT with: \"{sample}\"\n")

elif mode == "advice":
    c = DEMO_SCENARIO_C_EXPECTED
    prompt = ADVICE_PROMPT.format(
        revenue=c["revenue"],
        expenses=c["expenses"],
        profit=c["profit"],
        top_category=c["top_category"]
    )
    expect_json = False
    print("Testing ADVICE_PROMPT with Scenario C numbers\n")

else:
    print(f"Unknown mode '{mode}'. Use: accounting | advice | vision")
    sys.exit(1)

# ── single API call ────────────────────────────────────────────────────────────
try:
    resp = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
    raw = resp.text.strip()
    print("─── RAW RESPONSE ───────────────────────────────")
    print(raw)
    print("────────────────────────────────────────────────")

    if expect_json:
        try:
            data = json.loads(raw)
            print("\n✅ VALID JSON")
            if "transactions" in data:
                for tx in data["transactions"]:
                    print(f"   {tx['type']:7s} ₹{tx['amount_inr']:>6}  [{tx['category']}]  {tx['description']}")
                print(f"   net_profit_inr = ₹{data['net_profit_inr']}")
                print(f"   summary        = {data['summary']}")
        except json.JSONDecodeError as e:
            print(f"\n❌ INVALID JSON — {e}")
    else:
        words = len(raw.split())
        status = "✅ within 80-word limit" if words <= 80 else f"⚠️  {words} words — OVER limit"
        print(f"\n{status}  ({words} words)")

except Exception as e:
    err = str(e)
    if "429" in err or "RESOURCE_EXHAUSTED" in err:
        print("\n⏳ Still rate-limited. Wait 1–2 minutes and try again.")
    else:
        print(f"\n❌ Error: {err}")
