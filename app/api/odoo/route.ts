import { NextResponse } from 'next/server';
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
    const model = 'account.move'; // Odoo model for invoices

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
        return NextResponse.json({ success: true, data: invoices });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}
