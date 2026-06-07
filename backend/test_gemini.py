# test_gemini.py

from gemini_parser import extract_invoice_data

result = extract_invoice_data(
    "uploads/1.jpeg"
)

print(result)