import { NextResponse } from 'next/server';
import axios from 'axios';

let cachedConfigData: any = null; // Temporary storage for device config data

// POST request to fetch device configuration from external API
export async function POST(request: Request) {
    const headers = {
        'DeviceModelName': 'Server',
        'DeviceModelVersionNo': 'v1',
        'Content-Type': 'application/json'
    };

    try {
        const { deviceID } = await request.json();
        const response = await axios.get(
            `https://fdmsapitest.zimra.co.zw/Device/v1/${deviceID}/getConfig`,
            { headers }
        );

        cachedConfigData = response.data; // Cache the config data temporarily
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error fetching config:', error);
        return NextResponse.json({ error: 'Failed to fetch configuration' }, { status: 500 });
    }
}

// GET request to retrieve cached device configuration
export async function GET() {
    if (cachedConfigData) {
        return NextResponse.json(cachedConfigData);
    }
    return NextResponse.json({ error: 'No configuration data available' }, { status: 404 });
}
