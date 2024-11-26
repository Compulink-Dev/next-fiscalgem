import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        // Parse the incoming JSON body
        const body = await request.json();
        const { signature: base64Signature } = body; // Incoming signature in Base64

        // Check if the Base64 signature exists
        if (!base64Signature) {
            return NextResponse.json(
                { error: 'Base64 signature is required' },
                { status: 400 }
            );
        }

        // Step 1: Decode Base64 to Binary Buffer
        let binarySignature;
        try {
            binarySignature = Buffer.from(base64Signature, 'base64');
            console.log('Binary Signature:', binarySignature.toString('hex')); // Debugging
        } catch (error) {
            console.error('Invalid Base64 encoding:', error);
            return NextResponse.json(
                { error: 'Invalid Base64 encoding in the signature' },
                { status: 400 }
            );
        }

        // Step 2: Compute MD5 Hash
        const md5Hash = crypto.createHash('md5').update(binarySignature).digest('hex');
        console.log('MD5 Hash:', md5Hash);

        // Step 3: Extract the First 16 Characters of the MD5 Hash
        const first16Chars = md5Hash.substring(0, 16);
        console.log('First 16 Characters:', first16Chars);

        // Step 4: Sign the MD5 Hash using RSA Private Key
        const privateKey = process.env.PRIVATE_KEY; // Ensure this is properly configured
        if (!privateKey || !privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
            console.error('Invalid private key configuration.');
            return NextResponse.json(
                { error: 'Server configuration error: Invalid private key' },
                { status: 500 }
            );
        }

        let signature;
        try {
            // Convert the MD5 hash to a buffer and sign it
            const hashBuffer = Buffer.from(md5Hash, 'hex');
            const signedBuffer = crypto.privateEncrypt(
                {
                    key: privateKey,
                    padding: crypto.constants.RSA_PKCS1_PADDING,
                },
                hashBuffer
            );
            signature = signedBuffer.toString('base64');
            console.log('Generated Signature:', signature);
        } catch (error) {
            console.error('Error signing data:', error);
            return NextResponse.json(
                { error: 'Failed to sign data', details: error },
                { status: 500 }
            );
        }

        // Step 5: Return the results as JSON
        return NextResponse.json({
            base64Signature,
            md5Hash,
            first16Chars,
            signedData: signature, // Base64 signed MD5 hash
        });
    } catch (error) {
        console.error('Unexpected Error:', error);
        return NextResponse.json(
            { error: 'An error occurred while processing the request.' },
            { status: 500 }
        );
    }
}
