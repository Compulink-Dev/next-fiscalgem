import crypto from 'crypto';
import { NextResponse } from 'next/server';

interface Tax {
    taxID: number;
    taxCode: string;
    taxPercent?: number;
    taxAmount: number;
    salesAmountWithTax: number;
}

interface Payload {
    deviceID: string | 19034;
    receiptType: string;
    receiptCurrency: string;
    receiptGlobalNo: string;
    receiptDate: string; // ISO 8601 format
    receiptTotal: number; // In cents
    receiptTaxes: Tax[];
    previousReceiptHash?: string;
}

export async function POST(req: Request) {
    try {
        const payload: Payload = await req.json();

        console.log('Received payload in /api/hash:', payload);



        // Check private key
        const privateKey = process.env.PRIVATE_KEY;
        if (!privateKey || !privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
            console.error('Invalid private key configuration.');
            return NextResponse.json(
                { error: 'Server configuration error: Invalid private key' },
                { status: 500 }
            );
        }


        // Parse and validate receiptDate
        const receiptDate = new Date(payload.receiptDate);
        if (isNaN(receiptDate.getTime())) {
            return NextResponse.json({ error: 'Invalid receiptDate: Must be a valid date' }, { status: 400 });
        }
        const formattedReceiptDate = receiptDate.toISOString().split('T')[0]; // Format to YYYY-MM-DD

        // Ensure receiptTotal is a valid number
        const receiptTotalInCents = Math.round(Number(payload.receiptTotal));
        if (isNaN(receiptTotalInCents)) {
            return NextResponse.json({ error: 'Invalid receiptTotal: Must be a valid number' }, { status: 400 });
        }

        // Concatenate `receiptTaxes` as per rules
        const formattedTaxes = payload.receiptTaxes
            .sort((a, b) => a.taxID - b.taxID || a.taxCode.localeCompare(b.taxCode))
            .map((tax) => {
                const taxPercent = tax.taxPercent != null
                    ? tax.taxPercent.toFixed(2)
                    : '';
                return `${tax.taxCode || ''}${taxPercent}${Math.round(tax.taxAmount)}${Math.round(tax.salesAmountWithTax)}`;
            })
            .join('');

        // Ensure receiptGlobalNo is padded
        const receiptGlobalNo = String(payload.receiptGlobalNo).padStart(10, '0');

        // Concatenate all fields in the specified order
        const concatenatedString = [
            payload.deviceID,
            payload.receiptType,
            payload.receiptCurrency,
            receiptGlobalNo,
            formattedReceiptDate,
            receiptTotalInCents,
            formattedTaxes,
            payload.previousReceiptHash || ''
        ].join('');

        console.log('Concatenated String:', concatenatedString);

        // Generate MD5 hash of the concatenated string
        const receiptHash = crypto.createHash('md5').update(concatenatedString, 'utf8').digest('base64');
        console.log('Generated Receipt Hash (Base64):', receiptHash);

        // Sign the hash using the private key
        const bufferToSign = Buffer.from(receiptHash, 'base64');
        const signature = crypto.privateEncrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            bufferToSign
        ).toString('base64');
        console.log('Generated Signature (Base64):', signature);

        // Response
        return new Response(
            JSON.stringify({
                receiptHash,
                signature,
                concatenatedString
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error generating receipt signature:', error);
        return new Response(
            JSON.stringify({ error }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
