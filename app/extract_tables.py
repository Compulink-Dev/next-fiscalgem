import sys
import camelot
import json
import os
from PyPDF2 import PdfReader  # Correct import for PyPDF2 3.0+

# Ensure a file path is provided
if len(sys.argv) < 2:
    print(json.dumps({
        "success": False,
        "error": "No file path provided"
    }))
    sys.exit(1)

# Get the file path from arguments
file_path = sys.argv[1]

# Check if the file exists
if not os.path.exists(file_path):
    print(json.dumps({
        "success": False,
        "error": f"File not found: {file_path}"
    }))
    sys.exit(1)

try:
    # Open the PDF file with PdfReader
    reader = PdfReader(file_path)
    num_pages = len(reader.pages)

    # Use 'stream' flavor for tables without gridlines
    tables = camelot.read_pdf(file_path, pages='all', flavor='stream', strip_text='\n')


    # Check if tables were found
    if len(tables) == 0:
        print(json.dumps({
            "success": False,
            "error": "No tables found in the PDF"
        }))
        sys.exit(1)

    # Convert extracted tables to JSON format
    extracted_data = [table.df.to_dict(orient='records') for table in tables]

    # Return success response with extracted data
    print(json.dumps({
        "success": True,
        "tables": extracted_data
    }))
except Exception as e:
    # Handle errors
    print(json.dumps({
        "success": False,
        "error": str(e)
    }))
    
    sys.exit(1)
