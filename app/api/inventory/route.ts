import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = ["", "", "", "", "2024-01-01", 0, false, 25, 1, ""];

    try {
        const response = await fetch('https://hosted3.palladium.co.za/api/InventoryPicker/GetInventoryItemsWebStore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Auth-database': 'paldbPRODCompulinkSystemsDBLive',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text(); // Log error from the server
            console.error('API Error:', errorText);
            return NextResponse.json({ error: 'Failed to fetch inventory', details: errorText }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Request Failed:', error);
        return NextResponse.json({ error: 'Request failed', details: error }, { status: 500 });
    }
}
