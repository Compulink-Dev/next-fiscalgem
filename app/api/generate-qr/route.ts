import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

interface Receipt {
    deviceID: string;
    receiptDate: string;
    receiptGlobalNo: string;
    receiptDeviceSignature: string;
}

export async function POST(req: NextRequest) {
    const { deviceID, receiptDate, receiptGlobalNo, receiptDeviceSignature }: Receipt = await req.json();

    // Ensure all fields are 10 digits (pad with leading zeros if necessary)
    const paddedDeviceID = deviceID.padStart(10, '0');
    const paddedReceiptDate = receiptDate.padStart(8, '0'); // Format ddMMyyyy
    const paddedReceiptGlobalNo = receiptGlobalNo.padStart(10, '0');

    // Generate the MD5 hash of ReceiptDeviceSignature and extract the first 16 hexadecimal characters
    const receiptQrData = createHash('md5').update(receiptDeviceSignature).digest('hex').slice(0, 16);

    // Construct the QR URL
    const qrUrl = `https://invoice.zimra.co.zw/${paddedDeviceID}${paddedReceiptDate}${paddedReceiptGlobalNo}${receiptQrData}`;

    return NextResponse.json({ qrUrl });
}
