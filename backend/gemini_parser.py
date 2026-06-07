import os
import json
from dotenv import load_dotenv
from PIL import Image
import google.generativeai as genai

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

def extract_invoice_data(image_path):

    image = Image.open(image_path)
    # Rotate portrait invoices
    image = image.rotate(
    90,
    expand=True
)

    prompt = """
You are an expert GST invoice reader.

Read the ENTIRE invoice carefully.

Return ONLY valid JSON.

{
  "party_name": "",
  "place": "",
  "gstin": "",
  "invoice_no": "",
  "invoice_date": "",
  "tax_rate": 0,
  "hsn_code": "",
  "net_amount": 0,
  "cgst": 0,
  "sgst": 0,
  "igst": 0,
  "total_gst": 0,
  "gross_amount": 0
}

IMPORTANT:

Find values from GST Summary / Tax Summary section.

net_amount = taxable value

cgst = total CGST amount

sgst = total SGST amount

igst = total IGST amount

total_gst = total tax amount

gross_amount = final invoice amount

If a field is not visible return 0.

Return only JSON.
"""

    response = model.generate_content(
        [prompt, image]
    )
    print("=" * 50)
    print("FILE:", image_path)
    print(response.text)
    print("=" * 50)
    text = response.text.strip()

    text = text.replace("```json", "")
    text = text.replace("```", "")

    invoice_data = json.loads(text)

    print("Gemini Output:")
    print(invoice_data)

    return invoice_data