import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        // Parse the incoming JSON body
        const body = await request.json();
        const { hexSignature } = body; // The incoming hexSignature

        // Check if the hexSignature exists in the request body
        if (!hexSignature) {
            return NextResponse.json(
                { error: 'Hexadecimal signature is required' },
                { status: 400 }
            );
        }



        // Step 1: Convert Hexadecimal string to Buffer
        const binarySignature = Buffer.from(hexSignature, 'hex');
        console.log('Binary Signature:', binarySignature);

        // Step 2: Compute MD5 Hash
        const md5Hash = crypto.createHash('md5').update(binarySignature).digest('hex');
        console.log('MD5 Hash:', md5Hash);

        // Step 3: Extract First 16 Characters
        const first16Chars = md5Hash.substring(0, 16);
        console.log('First 16 Characters:', first16Chars);

        // Return the result as a JSON response
        return NextResponse.json({
            hexSignature,
            md5Hash,
            first16Chars,
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'An error occurred while processing the request.' },
            { status: 500 }
        );
    }
}
