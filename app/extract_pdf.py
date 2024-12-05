import fitz  # PyMuPDF
import sys
import json

def parse_pdf(file_path):
    # Open the PDF
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()




    # Parse the PDF content into JSON
    return {
        "receipt": {
            "receiptType": "FiscalInvoice",
            "receiptCurrency": extract_value(text, "Currency", "\n"),
            "receiptCounter": 0,  # Placeholder
            "receiptGlobalNo": 0,  # Placeholder
            "invoiceNo": extract_value(text, "Invoice No:", "\n"),
            "buyerData": {
                "buyerRegisterName": extract_value(text, "Buyer Register Name:", "\n"),
                "buyerTradeName": "Lloyd",
                "vatNumber": extract_value(text, "VAT Registration:", "\n"),
                "buyerTIN": extract_value(text, "TIN No:", "\n"),
                "buyerContacts": {
                    "phoneNo": extract_value(text, "Phone No:", "\n"),
                    "email": extract_value(text, "Email:", "\n"),
                },
                "buyerAddress": {
                    "province": extract_value(text, "Province:", "\n"),
                    "city": extract_value(text, "City:", "\n"),
                    "street": extract_value(text, "Street:", "\n"),
                    "houseNo": extract_value(text, "House No:", "\n"),
                    "district": extract_value(text, "District:", "\n"),
                },
            },
            "receiptNotes": extract_value(text, "Notes:", "\n"),
            "receiptDate": extract_value(text, "Date:", " "),
            "receiptLinesTaxInclusive": True,
            "receiptLines": extract_receipt_lines(text),
            "receiptTaxes": extract_taxes(text),
            "receiptPayments": [
                {"moneyTypeCode": "Cash", "paymentAmount": extract_total(text)}
            ],
            "receiptTotal": extract_total(text),
            "receiptPrintForm": "Receipt48",
            "receiptDeviceSignature": {"hash": "string", "signature": "string"},
        }
    }

def extract_value(text, start, end):
    try:
        start_index = text.index(start) + len(start)
        end_index = text.index(end, start_index)
        return text[start_index:end_index].strip()
    except ValueError:
        return ""

def extract_total(text):
    try:
        total = extract_value(text, "Invoice Total", "ZWG")
        return float(total.replace(",", ""))
    except ValueError:
        return 0

def extract_receipt_lines(text):
    lines = []
    start_marker = "Item Code Item Description Price (Inc)"
    end_marker = "Terms and conditions"

    try:
        start_index = text.index(start_marker) + len(start_marker)
        end_index = text.index(end_marker, start_index)
        table_text = text[start_index:end_index].strip()

        rows = table_text.split("\n")
        for row in rows:
            columns = row.split()
            if len(columns) < 6:
                continue
            lines.append({
                "receiptLineType": "Sale",
                "receiptLineNo": len(lines) + 1,
                "receiptLineHSCode": "",
                "receiptLineName": " ".join(columns[1:-4]),
                "receiptLinePrice": float(columns[-4].replace(",", "")),
                "receiptLineQuantity": int(columns[-3]),
                "receiptLineTotal": float(columns[-2].replace(",", "")),
                "taxCode": "",
                "taxPercent": 0,
                "taxID": 0,
            })
    except ValueError:
        pass

    return lines

def extract_taxes(text):
    taxes = []
    start_marker = "Tax Details"
    end_marker = "Payments"

    try:
        start_index = text.index(start_marker) + len(start_marker)
        end_index = text.index(end_marker, start_index)
        tax_text = text[start_index:end_index].strip()

        rows = tax_text.split("\n")
        for row in rows:
            columns = row.split()
            if len(columns) < 3:
                continue
            taxes.append({
                "taxCode": columns[0],
                "taxPercent": float(columns[1].replace("%", "")),
                "taxAmount": float(columns[2].replace(",", "")),
            })
    except ValueError:
        pass

    return taxes

if __name__ == "__main__":
    try:
        file_path = sys.argv[1]
        parsed_data = parse_pdf(file_path)
        print(json.dumps(parsed_data, indent=4))  # Output JSON
    except Exception as e:
        print(json.dumps({"error": str(e)}))
