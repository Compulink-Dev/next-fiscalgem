// app/api/open-day/route.ts
import { NextResponse } from 'next/server';
import { postToFDMS } from '@/lib/fdms-client';
import { handleError } from '@/lib/error-handler';
import axios from 'axios';

export async function POST(request: Request) {
    const { deviceID, fiscalDayOpened, fiscalDayNo } = await request.json();

    try {
        const response = await postToFDMS('/openDay', { deviceID, fiscalDayOpened, fiscalDayNo });
        return NextResponse.json(response.data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return handleError(error.response?.data?.message || error.message);
        } else {
            return handleError('An unexpected error occurred');
        }
    }
}
