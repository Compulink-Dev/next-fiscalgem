import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Tracking from '@/models/Tracking';
import { dbConnect } from '@/lib/db';

interface Tax {
    taxID: number;
    taxAmount: number;
    taxPercent?: number;
    salesAmountWithTax: number;
}

interface FiscalCounter {
    fiscalCounterType: string;
    fiscalCounterCurrency: string;
    fiscalCounterTaxPercent?: number | null; // null for exempt
    fiscalCounterMoneyType?: string; // Used when TaxPercent is null
    fiscalCounterValue: number; // Value in major units (e.g., 23000.00)
}


interface FiscalDayData {
    deviceID: string; // Device ID
    fiscalDayNo: number; // Fiscal day number
    fiscalDayDate: string; // Date when fiscal day was opened, in ISO 8601 format YYYY-MM-DD
    fiscalDayCounters: FiscalCounter[]; // Array of fiscal counters
}

interface Payload {
    deviceID: number;
    receiptType: string;
    receiptCurrency: string;
    receiptGlobalNo: string | number;
    receiptCounter: string | number;
    receiptDate: string;
    receiptTotal: number | string;
    receiptTaxes: Tax[];
    paymentMethod: string; // Added to track BalanceByMoneyType
}

export async function POST(req: Request) {
    try {
        await dbConnect();


        // Fetch metadata from the database
        let metadata = await Tracking.findOne();
        if (!metadata) {
            // Initialize metadata if it doesn't exist
            metadata = new Tracking({
                fiscalCounters: {}, // Initialize counters
                previousHash: '',
                lastReceiptGlobalNo: 93,
                lastReceiptCounter: 22,
                previousReceiptDate: '2024-11-13T19:18:00', // Add previousReceiptDate
            });
            await metadata.save();
        }

        const { fiscalCounters, previousHash, lastReceiptGlobalNo, lastReceiptCounter, previousReceiptDate } = metadata;



        const generateFiscalDayHash = (data: FiscalDayData): string => {
            // Step 1: Concatenate base fields: deviceID, fiscalDayNo, and fiscalDayDate
            const baseString = `${data.deviceID}${data.fiscalDayNo}${data.fiscalDayDate}`;

            // Step 2: Process fiscalDayCounters
            const processedCounters = data.fiscalDayCounters
                .filter((counter) => counter.fiscalCounterValue !== 0) // Only include non-zero counters
                .map((counter) => {
                    // Handle taxPercent or exempt/money type cases
                    let taxOrMoneyType = "";
                    if (counter.fiscalCounterTaxPercent !== undefined && counter.fiscalCounterTaxPercent !== null) {
                        // Tax percent cases
                        taxOrMoneyType = counter.fiscalCounterTaxPercent % 1 === 0
                            ? `${counter.fiscalCounterTaxPercent.toFixed(2)}` // Format integer as 15.00
                            : `${counter.fiscalCounterTaxPercent.toFixed(2)}`; // Format decimal as 14.50
                    } else if (counter.fiscalCounterMoneyType) {
                        // Exempt cases: use money type instead
                        taxOrMoneyType = counter.fiscalCounterMoneyType.toUpperCase();
                    }

                    // Convert fiscalCounterValue to cents (multiply by 100)
                    const valueInCents = Math.round(counter.fiscalCounterValue * 100);

                    // Concatenate fiscal counter fields
                    return `${counter.fiscalCounterType.toUpperCase()}${counter.fiscalCounterCurrency.toUpperCase()}${taxOrMoneyType}${valueInCents}`;
                });

            // Step 3: Sort fiscal counters
            const sortedCounters = processedCounters.sort();

            // Step 4: Concatenate base string with sorted counters
            const finalString = `${baseString}${sortedCounters.join("")}`;

            // Step 5: Generate SHA-256 hash
            const hash = crypto.createHash("sha256").update(finalString).digest("hex");

            return hash;
        };



        const fiscalDayData: FiscalDayData = {
            deviceID: "321",
            fiscalDayNo: 84,
            fiscalDayDate: "2019-09-23",
            fiscalDayCounters: [
                { fiscalCounterType: "SaleByTax", fiscalCounterCurrency: "ZWL", fiscalCounterTaxPercent: 0, fiscalCounterValue: 23000.0 },
                { fiscalCounterType: "SaleByTax", fiscalCounterCurrency: "USD", fiscalCounterTaxPercent: 14.5, fiscalCounterValue: 25.0 },
                { fiscalCounterType: "BalanceByMoneyType", fiscalCounterCurrency: "ZWL", fiscalCounterMoneyType: "CASH", fiscalCounterValue: 20000.0 },
                { fiscalCounterType: "BalanceByMoneyType", fiscalCounterCurrency: "ZWL", fiscalCounterMoneyType: "CARD", fiscalCounterValue: 15000.0 },
                { fiscalCounterType: "SaleTaxByTax", fiscalCounterCurrency: "USD", fiscalCounterTaxPercent: 15.0, fiscalCounterValue: 2.5 },
            ],
        };

        const hash = generateFiscalDayHash(fiscalDayData);
        console.log("Fiscal Day Hash:", hash);



        // Increment global number and receipt counter
        const receiptGlobalNo = lastReceiptGlobalNo + 1;
        const receiptCounter = lastReceiptCounter + 1;

        const payload: Payload = await req.json();


        console.log('Received payload in /api/hash:', payload);


        // Here you could store the updated globalNo and counter to the payload before processing
        payload.receiptGlobalNo = receiptGlobalNo;

        console.log('Updated receiptGlobalNo : ', payload.receiptGlobalNo);

        payload.receiptCounter = receiptCounter;

        // Initialize or update fiscal counters
        const updatedCounters = { ...fiscalCounters };


        payload.receiptTaxes.forEach((tax) => {
            const taxID = tax.taxID.toString();
            const taxPercent = tax.taxPercent ? tax.taxPercent.toFixed(2) : '0.00';
            const currency = payload.receiptCurrency;

            console.log("Tax ID : ", taxID);


            // SaleByTax and SaleTaxByTax
            if (payload.receiptType === 'FiscalInvoice') {
                updatedCounters[`SaleByTax-${currency}-${taxPercent}`] =
                    (updatedCounters[`SaleByTax-${currency}-${taxPercent}`] || 0) +
                    Math.round(tax.salesAmountWithTax * 100);
                updatedCounters[`SaleTaxByTax-${currency}-${taxPercent}`] =
                    (updatedCounters[`SaleTaxByTax-${currency}-${taxPercent}`] || 0) +
                    Math.round(tax.taxAmount * 100);
            }

            // CreditNoteByTax and CreditNoteTaxByTax
            if (payload.receiptType === 'CreditNote') {
                updatedCounters[`CreditNoteByTax-${currency}-${taxPercent}`] =
                    (updatedCounters[`CreditNoteByTax-${currency}-${taxPercent}`] || 0) -
                    Math.round(tax.salesAmountWithTax * 100);
                updatedCounters[`CreditNoteTaxByTax-${currency}-${taxPercent}`] =
                    (updatedCounters[`CreditNoteTaxByTax-${currency}-${taxPercent}`] || 0) -
                    Math.round(tax.taxAmount * 100);
            }

            // DebitNoteByTax and DebitNoteTaxByTax
            if (payload.receiptType === 'DebitNote') {
                updatedCounters[`DebitNoteByTax-${currency}-${taxPercent}`] =
                    (updatedCounters[`DebitNoteByTax-${currency}-${taxPercent}`] || 0) +
                    Math.round(tax.salesAmountWithTax * 100);
                updatedCounters[`DebitNoteTaxByTax-${currency}-${taxPercent}`] =
                    (updatedCounters[`DebitNoteTaxByTax-${currency}-${taxPercent}`] || 0) +
                    Math.round(tax.taxAmount * 100);
            }
        });

        // Validate and format receiptTotal
        const receiptTotalInCents = Math.round(Number(payload.receiptTotal) * 100);
        if (isNaN(receiptTotalInCents)) {
            return NextResponse.json(
                { error: 'Invalid receiptTotal: Must be a valid number' },
                { status: 400 }
            );
        }


        // BalanceByMoneyType
        const paymentKey = `BalanceByMoneyType-${payload.paymentMethod}-${payload.receiptCurrency}`;
        updatedCounters[paymentKey] = (updatedCounters[paymentKey] || 0) + receiptTotalInCents;

        // Filter only non-zero counters for hashing
        const nonZeroCounters = Object.entries(updatedCounters)
            .filter(([_, value]) => value !== 0)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

        // Construct fiscal counters string
        const fiscalCountersString = nonZeroCounters
            .map(([key, value]) => `${key.toUpperCase()}${value}`)
            .join('');


        // Validate payload structure
        const requiredFields = [
            'deviceID',
            'receiptType',
            'receiptCurrency',
            'receiptGlobalNo',
            'receiptDate',
            'receiptTotal',
            'receiptTaxes',
        ];
        const missingFields = requiredFields.filter((field) => !(field in payload));

        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Invalid payload: Missing fields (${missingFields.join(', ')})` },
                { status: 400 }
            );
        }

        if (!Array.isArray(payload.receiptTaxes) || payload.receiptTaxes.length === 0) {
            return NextResponse.json(
                { error: 'Invalid receiptTaxes: Must be a non-empty array' },
                { status: 400 }
            );
        }

        // Check private key
        const privateKey = process.env.PRIVATE_KEY;
        if (!privateKey || !privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
            console.error('Invalid private key configuration.');
            return NextResponse.json(
                { error: 'Server configuration error: Invalid private key' },
                { status: 500 }
            );
        }

        // Validate receiptDate format
        const receiptDate = new Date(payload.receiptDate);
        if (isNaN(receiptDate.getTime())) {
            return NextResponse.json(
                { error: 'Invalid receiptDate: Must be a valid ISO date' },
                { status: 400 }
            );
        }

        const formatToISO8601 = (date: Date): string => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        };

        const formattedDate = formatToISO8601(receiptDate);
        const previousDate = new Date(previousReceiptDate); // Convert stored previous receipt date to Date

        console.log('Formatted Date:', formattedDate);
        console.log('Previous Receipt Date:', previousReceiptDate);


        // Validate that the current receiptDate is older than previousReceiptDate
        if (receiptDate <= previousDate) {
            return NextResponse.json(
                { error: `Invalid receiptDate: Must be older than the previous receipt date (${receiptDate})` },
                { status: 400 }
            );
        }



        // Validate and format taxes
        const formattedTaxes = payload.receiptTaxes.map((tax, index) => {
            if (
                typeof tax.taxID !== 'number' ||
                typeof tax.taxAmount !== 'number' ||
                typeof tax.salesAmountWithTax !== 'number'
            ) {
                throw new Error(`Invalid tax fields at index ${index}: taxID, taxAmount, and salesAmountWithTax must be numbers`);
            }

            const taxPercent = tax.taxPercent != null ? tax.taxPercent.toFixed(2) : '';
            const taxAmount = Math.round(tax.taxAmount * 100); // Convert to cents
            const salesAmountWithTax = Math.round(tax.salesAmountWithTax * 100); // Convert to cents

            return `${tax.taxID}${taxPercent}${taxAmount}${salesAmountWithTax}`;
        });

        // Use the last `previousHash` for chaining
        const currentPreviousHash = previousHash || '9c461d087d1fc8c50672fbfe16b93355'; // Retrieve the last hash
        console.log('Current Previous Hash:', currentPreviousHash);

        // Generate hash
        const dayConcatenatedString = `${payload.deviceID}${payload.receiptType}${payload.receiptCurrency}${receiptGlobalNo}${payload.receiptDate}${receiptTotalInCents}${fiscalCountersString}${previousHash || '0000'}`;
        const dayMd5DataHash = crypto.createHash('md5').update(dayConcatenatedString, 'utf8').digest('hex');

        console.log("Day MD5 : ", dayMd5DataHash);

        // Construct the concatenated string
        const concatenatedString = `${payload.deviceID}${payload.receiptType}${payload.receiptCurrency}${receiptGlobalNo}${formattedDate}${receiptTotalInCents}${formattedTaxes.join('')}${currentPreviousHash}`;
        console.log('Concatenated String for MD5 Hashing:', concatenatedString);

        // Generate MD5 hash
        const md5DataHash = crypto.createHash('md5').update(concatenatedString, 'utf8').digest('hex');
        console.log('MD5 Hash:', md5DataHash);

        // Sign the hash using RSA private key
        let signature;
        try {
            const bufferToSign = Buffer.from(md5DataHash, 'hex');
            const encryptedBuffer = crypto.privateEncrypt(
                {
                    key: privateKey,
                    padding: crypto.constants.RSA_PKCS1_PADDING,
                },
                bufferToSign
            );

            signature = encryptedBuffer.toString('base64');
        } catch (error) {
            console.error('Error signing hash:', error);
            return NextResponse.json(
                { error: 'Failed to sign data', details: error },
                { status: 500 }
            );
        }

        // Save the newly generated hash and update metadata
        metadata.previousHash = md5DataHash;
        metadata.lastReceiptGlobalNo = receiptGlobalNo;
        metadata.receiptCounter = receiptCounter;
        metadata.previousReceiptDate = formattedDate;
        await metadata.save();

        console.log('Updated metadata:', {
            previousHash: metadata.previousHash,
            lastReceiptGlobalNo: metadata.lastReceiptGlobalNo,
            receiptCounter: metadata.receiptCounter,
            previousReceiptDate: metadata.previousReceiptDate,
        });

        // Generate MD5 hash of the signature
        const binarySignature = Buffer.from(signature, 'base64');
        const md5SignatureHash = crypto.createHash('md5').update(binarySignature).digest('hex');
        const first16Chars = md5SignatureHash.substring(0, 16);

        // Return the response with necessary data
        return NextResponse.json({
            receiptGlobalNo,
            receiptCounter,
            receiptDeviceSignature: {
                hash: md5DataHash,
                signature,
            },
            binarySignature: binarySignature.toString('hex'),
            md5Hash: md5SignatureHash,
            receiptQrData16: first16Chars,
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Unexpected server error', },
            { status: 500 }
        );
    }
}
