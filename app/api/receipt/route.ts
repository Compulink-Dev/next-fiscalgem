import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
    const payload = await req.json();

    // Format `receiptTotal` to cents (multiply by 100)
    const receiptTotalInCents = Math.round(payload.receiptTotal * 100);

    // Format `receiptTaxes` as specified
    const formattedTaxes = payload.receiptTaxes
        .filter((tax: any) => tax.taxCode || tax.taxPercent || tax.taxAmount || tax.salesAmountWithTax)
        .map((tax: any) => {
            // Ensure taxPercent is always a string with 2 decimal places
            const taxPercent = tax.taxPercent ? `${tax.taxPercent.toFixed(2)}` : "";

            // Ensure taxAmount and salesAmountWithTax are rounded to integer cents
            const taxAmount = Math.round(tax.taxAmount * 100); // Convert to cents
            const salesAmountWithTax = Math.round(tax.salesAmountWithTax * 100); // Convert to cents

            // Concatenate taxCode (if available), taxPercent, taxAmount, and salesAmountWithTax
            return `${tax.taxCode || ""}${taxPercent}${taxAmount}${salesAmountWithTax}`;
        })
        .sort() // Ensure tax lines are ordered (you can customize sorting as needed)
        .join(""); // Join all tax lines into a single string





    console.log("Concatenated : ", formattedTaxes);


    // Create the string to hash based on the specified fields
    const stringToHash = [
        payload.deviceID,
        payload.receiptType.toUpperCase(),
        payload.receiptCurrency,
        payload.receiptGlobalNo,
        payload.receiptDate,
        receiptTotalInCents,
        formattedTaxes,
        payload.previousReceiptHash || "" // Use empty string if no previous hash
    ].join("");

    // Generate the SHA-256 hash and encode in base64
    const hash = crypto.createHash("sha256").update(stringToHash).digest("base64");

    // Get private key from environment variables
    const privateKey = process.env.PRIVATE_KEY;

    // Check if privateKey is available, if not, throw an error
    if (!privateKey) {
        return NextResponse.json({ error: "Private key is missing in environment variables" }, { status: 500 });
    }

    // Signature generation using the private key (RSA or another algorithm)
    const sign = crypto.createSign('SHA256');
    sign.update(hash); // Update the signature with the hash data
    sign.end();

    const signature = sign.sign(privateKey, 'base64'); // Generate the signature

    // Construct the response with hash and signature
    const responsePayload = {
        ...payload,
        receiptDeviceSignature: {
            hash,
            signature, // Use the generated signature here
        },
    };

    return NextResponse.json(responsePayload);
}
