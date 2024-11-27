import { NextResponse } from 'next/server';
import crypto from 'crypto';

interface Tax {
    taxID: number;
    taxAmount: number;
    taxPercent?: number;
    salesAmountWithTax: number;
}

interface Payload {
    deviceID: number;
    receiptType: string;
    receiptCurrency: string;
    receiptGlobalNo: string | number;
    receiptDate: string;
    receiptTotal: number | string;
    receiptTaxes: Tax[];
}

export async function POST(req: Request) {
    try {
        const payload: Payload = await req.json();

        console.log("Received payload in /api/hash:", payload);

        // Validate payload structure
        const requiredFields = ['deviceID', 'receiptType', 'receiptCurrency', 'receiptGlobalNo', 'receiptDate', 'receiptTotal', 'receiptTaxes'];
        const missingFields = requiredFields.filter((field) => !(field in payload));

        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Invalid payload: Missing fields (${missingFields.join(', ')})` },
                { status: 400 }
            );
        }

        if (!Array.isArray(payload.receiptTaxes) || payload.receiptTaxes.length === 0) {
            return NextResponse.json(
                { error: 'Invalid receiptTaxes: Must be a non-empty array' },
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

        // Validate receiptDate format
        const receiptDate = new Date(payload.receiptDate);
        if (isNaN(receiptDate.getTime())) {
            return NextResponse.json(
                { error: 'Invalid receiptDate: Must be a valid ISO date' },
                { status: 400 }
            );
        }

        // const lastReceiptDate = new Date(previouslySubmittedReceiptDate); // Replace with your actual value


        // // Compare with the last receipt date
        // if (receiptDate < lastReceiptDate) {
        //     return NextResponse.json(
        //         { error: 'Invoice date cannot be earlier than the previously submitted receipt date' },
        //         { status: 400 }
        //     );
        // }

        const formatToISO8601 = (date: Date): string => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        };

        const formattedDate = formatToISO8601(receiptDate);

        console.log("Date  :", formattedDate); // Example: "2024-11-26T14:43:23"
        console.log("Receipt Date : ", receiptDate);


        // Validate and format receiptTotal
        const receiptTotalInCents = Math.round(Number(payload.receiptTotal) * 100);
        if (isNaN(receiptTotalInCents)) {
            return NextResponse.json(
                { error: 'Invalid receiptTotal: Must be a valid number' },
                { status: 400 }
            );
        }

        // Validate and format taxes
        const formattedTaxes = payload.receiptTaxes.map((tax, index) => {
            if (
                typeof tax.taxID !== 'number' ||
                typeof tax.taxAmount !== 'number' ||
                typeof tax.salesAmountWithTax !== 'number'
            ) {
                throw new Error(`Invalid tax fields at index ${index}: taxID, taxAmount, and salesAmountWithTax must be numbers`);
            }

            const taxPercent = tax.taxPercent != null ? tax.taxPercent.toFixed(2) : '';
            const taxAmount = Math.round(tax.taxAmount * 100); // Convert to cents
            const salesAmountWithTax = Math.round(tax.salesAmountWithTax * 100); // Convert to cents

            return `${tax.taxID}${taxPercent}${taxAmount}${salesAmountWithTax}`;
        });

        // Ensure receiptGlobalNo is padded to 10 characters
        // const receiptGlobalNo = String(payload.receiptGlobalNo).padStart(10, '0');

        // Construct the concatenated string
        const concatenatedString = `${payload.deviceID}${payload.receiptType}${payload.receiptCurrency}${payload.receiptGlobalNo}${formattedDate}${receiptTotalInCents}${formattedTaxes.join('')}`;
        console.log('Concatenated String for MD5 Hashing:', concatenatedString);

        // Generate MD5 hash
        const md5DataHash = crypto.createHash('md5').update(concatenatedString, 'utf8').digest('hex');
        console.log('MD5 Hash:', md5DataHash);

        // Sign the hash using RSA private key
        let signature;
        try {
            const bufferToSign = Buffer.from(md5DataHash, 'hex');
            const encryptedBuffer = crypto.privateEncrypt(
                {
                    key: privateKey,
                    padding: crypto.constants.RSA_PKCS1_PADDING,
                },
                bufferToSign
            );

            signature = encryptedBuffer.toString('base64');
        } catch (error) {
            console.error('Error signing hash:', error);
            return NextResponse.json(
                { error: 'Failed to sign data', details: error },
                { status: 500 }
            );
        }

        // Generate MD5 hash of the signature
        const binarySignature = Buffer.from(signature, 'base64');
        const md5SignatureHash = crypto.createHash('md5').update(binarySignature).digest('hex');
        const first16Chars = md5SignatureHash.substring(0, 16);

        // Return the response with necessary data
        return NextResponse.json({
            receiptDeviceSignature: {
                hash: md5DataHash,
                signature,
            },
            binarySignature: binarySignature.toString('hex'),
            md5Hash: md5SignatureHash,
            receiptQrData16: first16Chars,
        });
    } catch (error) {
        console.error('Unexpected error:', error || error);
        return NextResponse.json(
            { error: 'Unexpected server error', details: error || error },
            { status: 500 }
        );
    }
}
