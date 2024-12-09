//@ts-nocheck
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import xmlrpc from 'xmlrpc';

const fetchOdooInvoices = async () => {
    const client = xmlrpc.createClient({
        host: 'your-odoo-domain.com',
        port: 8069,
        path: '/xmlrpc/2/object',
    });

    const db = 'database_name';
    const user = 'username';
    const password = 'password';
    const model = 'account.move';

    return new Promise((resolve, reject) => {
        client.methodCall('execute_kw', [
            db,
            user,
            password,
            model,
            'search_read',
            [[['move_type', '=', 'out_invoice']]], // Fetch sales invoices
            {
                fields: ['id', 'name', 'invoice_date', 'partner_id', 'amount_total'],
            },
        ], (err, value) => {
            if (err) reject(err);
            else resolve(value);
        });
    });
};

export async function GET() {
    try {
        const invoices = await fetchOdooInvoices();

        // Convert invoices to Excel format
        const worksheet = XLSX.utils.json_to_sheet(invoices);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices');
        const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Respond with the Excel file
        return new NextResponse(excelBuffer, {
            headers: {
                'Content-Disposition': 'attachment; filename="invoices.xlsx"',
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}
