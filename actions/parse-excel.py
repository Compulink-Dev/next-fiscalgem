import sys
import json
import openpyxl

def parse_excel(file_path):
    # Open the Excel file
    wb = openpyxl.load_workbook(file_path)
    sheet = wb.active

    # Read data from the first sheet
    data = []
    for row in sheet.iter_rows(min_row=2, values_only=True):  # Skip header row
        data.append({
            'column1': row[0],
            'column2': row[1],
            # Add more columns as needed
        })

    return data

# Read the file data from stdin
input_data = sys.stdin.read()

# Write the input data to a temporary file
with open('/tmp/uploaded_file.xlsx', 'wb') as f:
    f.write(input_data)

# Parse the file
parsed_data = parse_excel('/tmp/uploaded_file.xlsx')

# Output the parsed data as JSON
print(json.dumps(parsed_data))
