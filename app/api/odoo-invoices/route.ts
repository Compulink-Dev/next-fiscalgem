import { NextResponse } from "next/server";
import axios from "axios";
import xmlrpc from "xmlrpc";

const ODOO_URL = "https://your-odoo-instance.com";
const ODOO_DB = "your-db-name";
const ODOO_USERNAME = "your-username";
const ODOO_PASSWORD = "your-password";

async function authenticate() {
    const client = xmlrpc.createClient({ url: `${ODOO_URL}/xmlrpc/2/common` });
    return new Promise<number>((resolve, reject) => {
        client.methodCall(
            "authenticate",
            [ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD, {}],
            (err, uid) => {
                if (err) reject(err);
                else resolve(uid);
            }
        );
    });
}

async function fetchInvoices(uid: number) {
    const client = xmlrpc.createClient({ url: `${ODOO_URL}/xmlrpc/2/object` });
    return new Promise<any[]>((resolve, reject) => {
        client.methodCall(
            "execute_kw",
            [
                ODOO_DB,
                uid,
                ODOO_PASSWORD,
                "account.move",
                "search_read",
                [[["move_type", "=", "out_invoice"], ["state", "=", "posted"]]],
                {
                    fields: [
                        "name",
                        "partner_id",
                        "invoice_date",
                        "amount_total",
                        "invoice_line_ids",
                    ],
                },
            ],
            (err, invoices) => {
                if (err) reject(err);
                else resolve(invoices);
            }
        );
    });
}

export async function GET() {
    try {
        const uid = await authenticate();
        const invoices = await fetchInvoices(uid);

        return NextResponse.json({ success: true, data: invoices });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error });
    }
}
