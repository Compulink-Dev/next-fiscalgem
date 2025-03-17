import { NextResponse } from 'next/server';
import Receipt from '@/models/Receipt';
import { dbConnect } from '@/lib/db';
import {
    processFile,
    parseExcel,
    fiscalizeReceipt,
    mapToFDMSPayload,
} from '@/actions/receiptProcessing';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const fileBuffer = await processFile(req);
        const invoices = parseExcel(fileBuffer);

        const results = await Promise.all(
            invoices.map(async (invoice) => {
                const receiptPayload = mapToFDMSPayload(invoice);
                const fiscalizedInvoice = await fiscalizeReceipt(receiptPayload);
                return Receipt.create(fiscalizedInvoice);
            })
        );

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        console.error('Error handling request:', error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
