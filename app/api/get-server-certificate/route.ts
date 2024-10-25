// app/api/get-server-certificate/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { handleError } from '@/lib/error-handler';

export async function POST(request: Request) {
    const { thumbprint } = await request.json();

    try {
        const response = await axios.post('https://fdmsapi.zimra.co.zw/getServerCertificate', {
            thumbprint,
        });

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return handleError(error.response?.data?.message || error.message);
        } else {
            return handleError('An unexpected error occurred');
        }
    }
}
