// app/api/storage/route.ts
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Receipt from '@/models/Receipt';

export async function GET() {
    try {
        await dbConnect();

        // Fetch all receipts from MongoDB
        const receipts = await Receipt.find({}).sort({ createdAt: -1 }); // Fetch latest receipts first

        return NextResponse.json({ success: true, data: receipts });
    } catch (error) {
        console.error('Error fetching receipts:');
        return NextResponse.json({ success: false, error: 'Failed to fetch receipts.' }, { status: 500 });
    }
}
