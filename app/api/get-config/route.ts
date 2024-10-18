import { NextResponse } from 'next/server';
import { postToFDMS } from '@/lib/fdms-client';
import { handleError } from '@/lib/error-handler';

interface GetConfigRequest {
    deviceID: string;
}

export async function POST(request: Request) {
    try {
        const { deviceID }: GetConfigRequest = await request.json();
        const response = await postToFDMS('/getConfig', { deviceID });
        return NextResponse.json(response);
    } catch (error: any) {
        return handleError(error);
    }
}
