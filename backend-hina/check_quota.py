from google import genai
import os
from dotenv import load_dotenv
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print("Sending ONE request to Gemini...")
try:
    resp = client.models.generate_content(
        model="gemini-2.0-flash",
        contents='Say hello in JSON like this: {"message": "hello"}'
    )
    print("SUCCESS!")
    print(resp.text)
except Exception as e:
    print("FULL ERROR:")
    print(str(e))
