// app/api/get-status/route.ts
import { handleError } from '@/lib/error-handler';
import { getStatus } from '@/lib/getStatus';
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const fiscalCode = searchParams.get('fiscalCode');

    if (!fiscalCode) {
        return NextResponse.json({ success: false, error: 'Fiscal code is required' }, { status: 400 });
    }

    try {
        const response = await getStatus(fiscalCode);
        return NextResponse.json({ success: true, data: response });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return handleError(error.response?.data?.message || error.message);
        } else {
            return handleError('An unexpected error occurred');
        }
    }
}
