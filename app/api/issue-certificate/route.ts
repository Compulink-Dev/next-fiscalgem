import { NextResponse } from 'next/server';
import crypto from 'crypto';

interface Tax {
    taxID: number;
    taxAmount: number;
    taxPercent?: number;
    salesAmountWithTax: number;
}

interface Payload {
    receiptDate: string;
    receiptTotal: number | string;
    receiptTaxes: Tax[];
    receiptGlobalNo: string;
}

export async function POST(req: Request) {
    try {
        const payload: Payload = await req.json();

        const privateKey = process.env.PRIVATE_KEY;
        if (!privateKey) {
            return NextResponse.json(
                { error: 'Server configuration error: Missing private key' },
                { status: 500 }
            );
        }

        const receiptDate = new Date(payload.receiptDate);
        if (isNaN(receiptDate.getTime())) {
            return NextResponse.json({ error: 'Invalid receiptDate: Must be a valid date' }, { status: 400 });
        }

        const receiptTotalInCents = Math.round(Number(payload.receiptTotal) * 100);
        if (isNaN(receiptTotalInCents)) {
            return NextResponse.json({ error: 'Invalid receiptTotal' }, { status: 400 });
        }

        // Format taxes, ensure tax fields are valid numbers
        // const formattedTaxes = (payload.receiptTaxes || []).map((tax: Partial<Tax>) => {
        //     return {
        //         taxID: tax.taxID ?? 0,
        //         taxAmount: Math.round(Number(tax.taxAmount) || 0),
        //         taxPercent: parseFloat(tax.taxPercent?.toString() || '0'),
        //         salesAmountWithTax: Math.round(Number(tax.salesAmountWithTax) || 0),
        //     };
        // });

        const receiptGlobalNo = String(payload.receiptGlobalNo).padStart(10, '0');

        const signingData = {
            receiptDate: receiptDate.toISOString().split('T')[0],
            receiptTotal: receiptTotalInCents,
            receiptTaxes: payload.receiptTaxes.map(tax => ({
                taxID: tax.taxID,
                taxAmount: Math.round(Number(tax.taxAmount)),
                salesAmountWithTax: Math.round(Number(tax.salesAmountWithTax)),
            })),
            receiptGlobalNo,
        };

        const md5Hash = crypto.createHash('md5').update(JSON.stringify(signingData)).digest('hex');
        const signature = crypto.privateEncrypt(
            { key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
            Buffer.from(md5Hash, 'hex')
        ).toString('base64');

        return NextResponse.json({
            receiptDeviceSignature: { hash: md5Hash, signature },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Unexpected server error', details: error }, { status: 500 });
    }
}
