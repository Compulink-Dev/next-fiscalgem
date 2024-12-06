import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Receipt from '@/models/Receipt';

export async function GET() {
    try {
        // Connect to the database
        await dbConnect();

        // Fetch all receipts (invoices) from the database, sorted by creation date
        const receipts = await Receipt.find({}).sort({ createdAt: -1 });

        // Return a successful response with the receipt data
        return NextResponse.json({ success: true, data: receipts });
    } catch (error) {
        console.error('Error fetching saved invoices:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch saved invoices.' },
            { status: 500 }
        );
    }
}
