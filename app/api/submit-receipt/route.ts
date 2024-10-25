import { NextResponse } from 'next/server';
import { postToFDMS } from '@/lib/fdms-client';
import { handleError } from '@/lib/error-handler';
import Receipt from '@/models/Receipt';
import dbConnect from '@/lib/db';
import axios from 'axios';

interface ReceiptItem {
    itemID: string;
    description: string;
    quantity: number;
    price: number;
}


interface SubmitReceiptRequest {
    deviceID: string;
    fiscalDayNo: number;
    receiptGlobalNo: number;
    receiptCounter: number;
    items: ReceiptItem[];
    totalAmount: number;
}

export async function POST(request: Request) {
    try {
        const receiptData: SubmitReceiptRequest = await request.json();

        // Connect to MongoDB
        await dbConnect();

        // Save receipt to the database
        const newReceipt = await Receipt.create(receiptData);

        // Send the receipt to ZIMRA API
        const zimraResponse = await postToFDMS('/submitReceipt', { deviceID: receiptData.deviceID, receipt: receiptData });

        // Update the receipt status in the database
        newReceipt.status = zimraResponse.status;
        await newReceipt.save();

        return NextResponse.json({ success: true, data: newReceipt });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return handleError(error.response?.data?.message || error.message);
        } else {
            return handleError('An unexpected error occurred');
        }
    }
}
