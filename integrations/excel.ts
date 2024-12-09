import * as XLSX from 'xlsx';

export const generateInvoiceExcel = (invoices: any) => {
    const worksheet = XLSX.utils.json_to_sheet(invoices);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices');

    // Write file
    XLSX.writeFile(workbook, 'invoices.xlsx');
};
