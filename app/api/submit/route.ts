import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import Receipt from '@/models/Receipt';
import dbConnect from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { deviceID, receipt } = await request.json();

        console.log('Received payload in /api/submit:', { deviceID, receipt });


        const headers = {
            'Content-Type': 'application/json',
            'DeviceModelName': 'Server',
            'DeviceModelVersion': 'v1',
        };

        // Load certificate and key files
        const httpsAgent = new https.Agent({
            pfx: Buffer.from(process.env.CLIENT_CERT_BASE64 as string, 'base64'),
            passphrase: process.env.CLIENT_CERT_PASSWORD,
        });

        console.log("Parsed Data from Request:", receipt); // Log parsed receipt to check if it's coming through

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

        console.log("Outgoing Payload:", JSON.stringify(body, null, 2));

        // Send receipt data to the external API
        const response = await axios.post(
            `https://fdmsapitest.zimra.co.zw/Device/v1/${deviceID}/submitReceipt`,
            body,
            { headers, httpsAgent }  // Use httpsAgent here
        );

        console.log('FDMS API response:', response.data);

        // Save the receipt data to MongoDB
        const savedReceipt = await Receipt.create(receipt);

        // Respond with success, including both API response and saved document
        return NextResponse.json({
            success: true,
            apiResponse: response.data,
            savedReceipt,
        });
    } catch (error: any) {
        const errorMessage = error.response?.data || error.message;
        console.error('Error submitting receipt:', errorMessage);
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
