import fitz
from PIL import Image
import pytesseract
import os

# Update if your Tesseract path is different
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def extract_text_from_pdf(pdf_path):
    text = ""

    doc = fitz.open(pdf_path)

    for page in doc:
        text += page.get_text()

    return text


def extract_text_from_image(image_path):
    image = Image.open(image_path)
    return pytesseract.image_to_string(image)


def extract_text(file_path):

    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        return extract_text_from_pdf(file_path)

    elif ext in [".jpg", ".jpeg", ".png"]:
        return extract_text_from_image(file_path)

    else:
        return "Unsupported File Type"