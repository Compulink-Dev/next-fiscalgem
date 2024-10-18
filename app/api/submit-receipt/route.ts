// app/api/submit-receipt/route.ts
import { NextResponse } from 'next/server';
import Receipt from '@/models/Receipt';
import axios from 'axios';
import dbConnect from '@/lib/db';

export async function POST(request: Request) {
    try {
        const receiptData = await request.json();

        // Connect to MongoDB
        await dbConnect();

        // Save receipt to the database
        const newReceipt = await Receipt.create(receiptData);

        // Send the receipt to the ZIMRA API
        const zimraResponse = await axios.post('https://fdmsapi.zimra.co.zw/submitReceipt', {
            deviceID: receiptData.deviceID,
            receipt: receiptData,
        });

        // Update the receipt status in the DB based on ZIMRA's response
        newReceipt.status = zimraResponse.data.status;
        await newReceipt.save();

        return NextResponse.json({ success: true, data: newReceipt });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
