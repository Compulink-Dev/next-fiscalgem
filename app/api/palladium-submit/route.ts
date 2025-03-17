import { submitToFDMS } from '@/lib/fdms';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
    try {
        const { invoiceId, deviceID } = await request.json();

        if (!invoiceId || !deviceID) {
            return NextResponse.json({ success: false, error: "Missing invoiceId or deviceID" }, { status: 400 });
        }

        // Submit invoice to FDMS
        const result = await submitToFDMS(invoiceId, deviceID);

        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        console.error("Error in /api/submit-to-fdms:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
