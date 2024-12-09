import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Replace with actual Palladium integration
        const invoices = await fetch('https://palladium-api.example.com/invoices', {
            headers: { Authorization: 'Bearer YOUR_TOKEN' },
        }).then((res) => res.json());

        return NextResponse.json({ success: true, data: invoices });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}
