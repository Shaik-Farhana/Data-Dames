# demo_data.py

DEMO_SCENARIO_A_IMAGE = "Use a photo of: flour, eggs, butter, piping bag"

DEMO_SCENARIO_B_TRANSACTIONS = [
    "bought 2kg atta for 180, sold 6 rotis at 20 each",
    "spent 50 on plastic bags for packaging",
    "sold 4 tiffins at 80 each, bought dal for 120 and oil for 60",
    "bought 500g paneer for 120, sold 3 paneer dishes at 100 each",
    "spent 30 on printed flyers for marketing",
]

DEMO_SCENARIO_C_EXPECTED = {
    "revenue": 1000,
    "expenses": 560,
    "profit": 440,
    "top_category": "Raw Materials"
}