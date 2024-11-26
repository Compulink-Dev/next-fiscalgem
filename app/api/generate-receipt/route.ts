// app/api/generate-receipt/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();  // Get the raw body as a string
        console.log('Raw request body:', rawBody);

        const { deviceID, receiptType, receiptCurrency, receiptGlobalNo, receiptDate, receiptTotal, receiptTaxes, previousReceiptHash } = JSON.parse(rawBody);

        console.log('Parsed data:', { deviceID, receiptType, receiptCurrency, receiptGlobalNo, receiptDate, receiptTotal, receiptTaxes, previousReceiptHash });

        const privateKey = process.env.PRIVATE_KEY;

        if (!privateKey) {
            return NextResponse.json({ error: 'Private key is missing' }, { status: 400 });
        }

        if (!deviceID || !receiptType || !receiptCurrency || !receiptGlobalNo || !receiptDate || !receiptTotal || !receiptTaxes) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }



        return NextResponse.json({});

    } catch (error) {
        console.error('Error generating receipt:', error);
        return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
    }
}
