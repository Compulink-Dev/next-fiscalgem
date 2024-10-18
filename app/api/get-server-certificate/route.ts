// app/api/get-server-certificate/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    const { thumbprint } = await request.json();

    try {
        const response = await axios.post('https://fdmsapi.zimra.co.zw/getServerCertificate', {
            thumbprint,
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
