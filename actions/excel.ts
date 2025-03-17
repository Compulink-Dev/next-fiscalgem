//@ts-nocheck
import * as XLSX from 'xlsx';
import { headers } from 'next/headers';

export function parseExcel(file: Buffer): any[] {
    const workbook = XLSX.read(file, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const headers = data[0]; // First row as headers
    const rows = data.slice(1); // Rest as data

    return rows.map(row => {
        const receipt = {};
        headers.forEach((header: any, index: any) => {
            receipt[header] = row[index]; // Map each header to corresponding row value
        });
        return receipt;
    });
}
