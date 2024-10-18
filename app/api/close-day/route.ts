// app/api/close-day/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    const { deviceID, fiscalDayNo, fiscalDayCounters, receiptCounter, fiscalDayDeviceSignature } = await request.json();

    try {
        const response = await axios.post('https://fdmsapi.zimra.co.zw/closeDay', {
            deviceID,
            fiscalDayNo,
            fiscalDayCounters,
            receiptCounter,
            fiscalDayDeviceSignature,
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
