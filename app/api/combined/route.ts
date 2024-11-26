import { NextResponse } from 'next/server';
import crypto from 'crypto';
import axios from 'axios';
import https from 'https';
import Receipt from '@/models/Receipt';
import { dbConnect } from '@/lib/db';
import fs from 'fs';
import path from 'path';

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

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { deviceID, receipt } = await request.json();

        // Step 1: Validate initial input
        if (!deviceID || !receipt || Object.keys(receipt).length === 0) {
            return NextResponse.json(
                { success: false, error: 'DeviceID or receipt data is missing in the request body.' },
                { status: 400 }
            );
        }

        const requiredFields = ['receiptDate', 'receiptTotal', 'receiptGlobalNo'];
        const missingFields = requiredFields.filter((field) => !receipt[field as keyof Payload]);
        if (missingFields.length > 0) {
            return NextResponse.json(
                { success: false, error: `Invalid payload: Missing fields (${missingFields.join(', ')})` },
                { status: 400 }
            );
        }

        // Step 2: Validate receipt date
        const receiptDate = new Date(receipt.receiptDate);
        if (isNaN(receiptDate.getTime())) {
            return NextResponse.json({ success: false, error: 'Invalid receiptDate: Must be a valid date' }, { status: 400 });
        }
        const formattedReceiptDate = receiptDate.toISOString().split('T')[0];

        // Step 3: Validate receipt total
        const receiptTotalInCents = Math.round(Number(receipt.receiptTotal) * 100);
        if (isNaN(receiptTotalInCents)) {
            return NextResponse.json({ success: false, error: 'Invalid receiptTotal: Must be a valid number' }, { status: 400 });
        }

        // Step 4: Format taxes
        const formattedTaxes = (receipt.receiptTaxes || []).map((tax: Partial<Tax>) => ({
            taxID: tax.taxID ?? 0,
            taxAmount: Math.round(Number(tax.taxAmount) || 0),
            taxPercent: parseFloat(tax.taxPercent?.toString() || '0'),
            salesAmountWithTax: Math.round(Number(tax.salesAmountWithTax) || 0),
        }));

        // Step 5: Prepare signing data
        const receiptGlobalNo = String(receipt.receiptGlobalNo).padStart(10, '0');
        const signingData = {
            receiptDate: formattedReceiptDate,
            receiptTotal: receiptTotalInCents,
            receiptTaxes: formattedTaxes,
            receiptGlobalNo,
        };

        // Step 6: Generate MD5 hash and signature
        const signingDataString = JSON.stringify(signingData, Object.keys(signingData).sort());
        const md5DataHash = crypto.createHash('md5').update(signingDataString, 'utf8').digest('hex');

        const privateKey = process.env.PRIVATE_KEY;
        if (!privateKey || !privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
            return NextResponse.json(
                { success: false, error: 'Server configuration error: Invalid private key' },
                { status: 500 }
            );
        }

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
        } catch (error: any) {
            console.error("Error signing data:", error);
            return NextResponse.json(
                { success: false, error: 'Failed to sign data', details: error.message },
                { status: 500 }
            );
        }

        // Step 7: Validate certificate file
        const certPath = path.resolve('/home/kronos/clientCert.pfx');
        if (!fs.existsSync(certPath)) {
            return NextResponse.json(
                { success: false, error: `Certificate file not found at ${certPath}` },
                { status: 500 }
            );
        }
        if (!process.env.CLIENT_CERT_PASSWORD) {
            return NextResponse.json(
                { success: false, error: 'Server configuration error: Missing certificate password' },
                { status: 500 }
            );
        }

        const httpsAgent = new https.Agent({
            pfx: fs.readFileSync(certPath),
            passphrase: process.env.CLIENT_CERT_PASSWORD,
        });

        // Step 8: Prepare and submit the receipt
        const receiptToSubmit = {
            ...receipt,
            receiptGlobalNo,
            receiptDeviceSignature: { hash: md5DataHash, signature },
        };

        const headers = {
            'Content-Type': 'application/json',
            'DeviceModelName': 'Server',
            'DeviceModelVersion': 'v1',
        };

        let apiResponse;
        try {
            apiResponse = await axios.post(
                `https://fdmsapitest.zimra.co.zw/Device/v1/${deviceID}/submitReceipt`,
                { deviceID, receipt: receiptToSubmit },
                { headers, httpsAgent }
            );
        } catch (error: any) {
            console.error("API request error:", error.response?.data || error.message);
            return NextResponse.json(
                { success: false, error: 'Failed to submit receipt to FDMS API', details: error.response?.data || error.message },
                { status: 500 }
            );
        }

        // Step 9: Save receipt to database
        const savedReceipt = await Receipt.create(receiptToSubmit);

        // Step 10: Return response
        return NextResponse.json({
            success: true,
            receiptDeviceSignature: { hash: md5DataHash, signature },
            apiResponse: apiResponse.data,
            savedReceipt,
        });
    } catch (error: any) {
        console.error("Unexpected error:", error.message || error);
        return NextResponse.json(
            { success: false, error: 'Unexpected server error', details: error.message || error },
            { status: 500 }
        );
    }
}
