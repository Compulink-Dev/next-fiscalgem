// app/api/get-file-status/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    const { deviceID, operationID } = await request.json();

    try {
        const response = await axios.post('https://fdmsapi.zimra.co.zw/getFileStatus', {
            deviceID,
            operationID,
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
