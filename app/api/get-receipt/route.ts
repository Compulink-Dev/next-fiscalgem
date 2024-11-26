import { NextResponse } from 'next/server';
import Receipt from '@/models/Receipt';
import connectToDatabase from '@/lib/db';

export async function GET() {
    await connectToDatabase();

    try {
        const receipts = await Receipt.find({}).lean(); // Fetch all receipts
        return NextResponse.json(receipts);
    } catch (error) {
        console.error('Error fetching receipts:', error);
        return NextResponse.json({ error: 'Error fetching receipts' }, { status: 500 });
    }
}
