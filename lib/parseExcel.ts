import * as XLSX from 'xlsx';

interface Receipt {
    [key: string]: any; // Each receipt will have dynamic keys (header names) with values of any type
}

export function parseExcel(file: Buffer): Receipt[] {
    const workbook = XLSX.read(file, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data: (string | number)[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const headers: string[] = data[0] as string[]; // First row as headers
    const rows: (string | number)[][] = data.slice(1); // Rest as data

    return rows.map((row: (string | number)[]) => {
        const receipt: Receipt = {};
        headers.forEach((header: string, index: number) => {
            receipt[header] = row[index]; // Map each header to corresponding row value
        });
        return receipt;
    });
}

