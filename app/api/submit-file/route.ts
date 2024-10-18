// app/api/submit-file/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    const { deviceID, file } = await request.json();

    try {
        const response = await axios.post('https://fdmsapi.zimra.co.zw/submitFile', {
            deviceID,
            file,
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
