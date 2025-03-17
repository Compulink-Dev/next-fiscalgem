import { NextResponse } from 'next/server';
import Receipt from '@/models/Receipt';
import { dbConnect } from '@/lib/db';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { deviceID, receipt } = await request.json();

        console.log('Received payload in /api/submit:', { deviceID, receipt });

        // Check if deviceID or receipt data is missing
        if (!deviceID || !receipt || Object.keys(receipt).length === 0) {
            console.error("Error: DeviceID or receipt data is missing in the request body.");
            return NextResponse.json(
                { success: false, error: "DeviceID or receipt data is missing in the request body." },
                { status: 400 }
            );
        }

        const body = {
            deviceID,
            receipt,
        };

        console.log("Outgoing Payload to MongoDB:", JSON.stringify(body, null, 2));

        // Save the receipt data to MongoDB
        const savedReceipt = await Receipt.create(receipt);

        if (savedReceipt) {
            // Respond with success, including the saved document
            return NextResponse.json({
                success: true,
                savedReceipt,
            });
        } else {
            console.error('Error saving receipt:');
            return NextResponse.json(
                { success: false, error: 'Failed to save receipt' },
                { status: 500 }
            );
        }
    } catch (error: any) {
        const errorMessage = error.response?.data || error.message;
        console.error('Error saving receipt:', errorMessage);
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
