from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import List
from excel_generator import generate_excel
from fastapi import Form
import json 
# Uncomment when Gemini quota is available
from gemini_parser import extract_invoice_data

import os

app = FastAPI(title="Invoice AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "Invoice AI Backend Running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/upload")
async def upload_files(
    files: List[UploadFile] = File(...)
):

    results = []

    for file in files:

        file_path = os.path.join(
            UPLOAD_DIR,
            file.filename
        )

        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        try:

            # TEMP DUMMY DATA
            # Replace with Gemini later

            invoice_data = extract_invoice_data(
                file_path
            )
            invoice_data["invoice_type"] = "Purchase"
            results.append(invoice_data)

        except Exception as e:

            results.append({
                "filename": file.filename,
                "error": str(e)
            })
    print("FINAL RESPONSE:")
    print(results)
    return {
        "success": True,
        "total_files": len(files),
        "results": results
    }


@app.post("/generate-excel")
async def generate_excel_endpoint(

    business_name: str = Form(...),
    gstin: str = Form(...),
    uid: str = Form(...),
    password: str = Form(...),
    month: str = Form(...),

    invoices: str = Form(...),

    workbook: UploadFile = None

):

    data = {
        "business_name": business_name,
        "gstin": gstin,
        "uid": uid,
        "password": password,
        "month": month,
        "invoices": json.loads(invoices)
    }

    workbook_path = None

    if workbook:

        workbook_path = os.path.join(
            UPLOAD_DIR,
            workbook.filename
        )

        with open(workbook_path, "wb") as f:
            f.write(await workbook.read())

    print(
        "Workbook uploaded:",
        workbook is not None
    )

    print(
        "Workbook path:",
        workbook_path
    )

    file_path = generate_excel(
        data,
        workbook_path
    )

    return FileResponse(
        path=file_path,
        filename=os.path.basename(file_path),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )