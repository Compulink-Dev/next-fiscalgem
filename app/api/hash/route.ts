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

        console.log('Received payload in /api/hash:', payload);

        // Validate payload
        const requiredFields = ['receiptDate', 'receiptTotal', 'receiptGlobalNo'];
        const missingFields = requiredFields.filter((field) => !payload[field as keyof Payload]);
        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Invalid payload: Missing fields (${missingFields.join(', ')})` },
                { status: 400 }
            );
        }

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

        // Format taxes, ensure tax fields are valid numbers
        const formattedTaxes = (payload.receiptTaxes || []).map((tax: Partial<Tax>) => {
            return {
                taxID: tax.taxID ?? 0,
                taxAmount: Math.round(Number(tax.taxAmount) || 0),
                taxPercent: parseFloat(tax.taxPercent?.toString() || '0'),
                salesAmountWithTax: Math.round(Number(tax.salesAmountWithTax) || 0),
            };
        });

        // Ensure receiptGlobalNo is padded
        const receiptGlobalNo = String(payload.receiptGlobalNo).padStart(10, '0');

        // Signing data structure
        const signingData = {
            receiptDate: formattedReceiptDate,
            receiptTotal: receiptTotalInCents,
            receiptTaxes: formattedTaxes,
            receiptGlobalNo,
        };

        // Generate the MD5 hash for signing
        const signingDataString = JSON.stringify(signingData, Object.keys(signingData).sort());
        console.log('Concatenated String:', signingDataString);

        const md5DataHash = crypto.createHash('md5').update(signingDataString, 'utf8').digest('hex');
        console.log('md5DataHash:', md5DataHash);

        // Sign the data with the private key
        let signature;
        try {
            const bufferToSign = Buffer.from(md5DataHash, 'hex');
            console.log('bufferToSign:', bufferToSign);
            const encryptedBuffer = crypto.privateEncrypt(
                {
                    key: privateKey,
                    padding: crypto.constants.RSA_PKCS1_PADDING,
                },
                bufferToSign
            );
            console.log('encryptedBuffer:', encryptedBuffer);


            signature = encryptedBuffer.toString('base64');
            console.log('signature:', signature);
        } catch (error) {
            console.error('Error signing data:', error);
            return NextResponse.json(
                { error: 'Failed to sign data', details: error },
                { status: 500 }
            );
        }

        // Convert the signed data into binary format (base64 to buffer) and generate MD5 hash of the signature
        const binarySignature = Buffer.from(signature, 'base64');
        console.log('Binary Signature:', binarySignature);

        const hexSignature = binarySignature.toString('hex');
        console.log('hexSignature :', hexSignature);


        const md5SignatureHash = crypto.createHash('md5').update(binarySignature).digest('hex');

        console.log('md5SignatureHash :', md5SignatureHash);

        // Extract the first 16 characters of the MD5 hash of the signature
        const first16Chars = md5SignatureHash.substring(0, 16);

        console.log('first16Chars :', first16Chars);

        // Return the response with necessary data
        return NextResponse.json({
            receiptDeviceSignature: { hash: md5DataHash, signature },
            binarySignature: hexSignature,
            md5Hash: md5SignatureHash,
            receiptQrData16: first16Chars,
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Unexpected server error', details: error },
            { status: 500 }
        );
    }
}
