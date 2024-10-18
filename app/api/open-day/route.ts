// app/api/open-day/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    const { deviceID, fiscalDayOpened, fiscalDayNo } = await request.json();

    try {
        const response = await axios.post('https://fdmsapi.zimra.co.zw/openDay', {
            deviceID,
            fiscalDayOpened,
            fiscalDayNo,
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
