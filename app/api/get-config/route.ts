import { NextResponse } from 'next/server';
import { postToFDMS } from '@/lib/fdms-client';
import { handleError } from '@/lib/error-handler';
import axios from 'axios';

interface GetConfigRequest {
    deviceID: string;
}

export async function POST(request: Request) {
    try {
        const { deviceID }: GetConfigRequest = await request.json();
        const response = await postToFDMS('/getConfig', { deviceID });
        return NextResponse.json(response);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return handleError(error.response?.data?.message || error.message);
        } else {
            return handleError('An unexpected error occurred');
        }
    }
}
