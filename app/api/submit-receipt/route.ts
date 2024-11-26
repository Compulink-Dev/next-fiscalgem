import { NextResponse } from 'next/server';
import Receipt from '@/models/Receipt';
import { dbConnect } from '@/lib/db';

function calculateReceiptTotal(receipt: any): number {
    const linesTotal = receipt.receiptLines.reduce(
        (total: number, line: any) => total + (line.receiptLineTotal || 0),
        0
    );
    const taxesTotal = receipt.receiptTaxes.reduce(
        (total: number, tax: any) => total + (tax.taxAmount || 0),
        0
    );
    return linesTotal + taxesTotal;
}

function validateReceiptFields(receipt: any) {
    if (!receipt.buyerData?.buyerRegisterName) {
        throw new Error('The buyerRegisterName is required.');
    }

    // if (receipt.receiptCurrency !== 'ZWG') {
    //     throw new Error('Receipt currency must be "ZWG".');
    // }

    receipt.receiptLines = receipt.receiptLines.map((line: any) => ({
        ...line,
        taxPercent: line.taxPercent ?? 0,
        taxCode: line.taxCode ?? 'N/A',
        receiptLineHSCode: line.receiptLineHSCode ?? '000000',
        receiptLinePrice: line.receiptLinePrice ?? 0,
    }));

    receipt.receiptTaxes = receipt.receiptTaxes.map((tax: any) => ({
        ...tax,
        salesAmountWithTax: tax.salesAmountWithTax ?? 0,
        taxPercent: tax.taxPercent ?? 0,
        taxCode: tax.taxCode ?? 'N/A',
    }));
}

export async function POST(request: Request) {
    await dbConnect();

    try {
        const body = await request.text();
        if (!body) {
            console.error('Request body is empty');
            return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
        }

        let parsedBody;
        try {
            parsedBody = JSON.parse(body);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
        }

        const receiptData = parsedBody;
        const receipt = receiptData.receipt;

        if (!receipt) {
            console.error('Receipt is missing from the body');
            return NextResponse.json({ error: 'Receipt field is required' }, { status: 400 });
        }

        // Validate and calculate total
        validateReceiptFields(receipt);
        const calculatedReceiptTotal = calculateReceiptTotal(receipt);
        if (calculatedReceiptTotal !== receipt.receiptTotal) {
            console.error(`Calculated total: ${calculatedReceiptTotal}, provided total: ${receipt.receiptTotal}`);
            throw new Error(`The receiptTotal (${receipt.receiptTotal}) does not match the calculated total (${calculatedReceiptTotal}).`);
        }

        // Prepare MongoDB payload
        const mongoPayload = {
            deviceID: receiptData.deviceID,
            fiscalDayNo: receiptData.fiscalDayNo,
            totalAmount: calculatedReceiptTotal,
            receiptCounter: receipt.receiptCounter,
            receiptGlobalNo: receipt.receiptGlobalNo,
            receipt: {
                ...receipt,
                receiptDate: new Date(receipt.receiptDate).toISOString(),
                receiptNotes: receipt.receiptNotes || '',
                creditDebitNote: receipt.creditDebitNote || {
                    receiptID: 0,
                    deviceID: 0,
                    receiptGlobalNo: 0,
                    fiscalDayNo: 0,
                },
                receiptLinesTaxInclusive: receipt.receiptLinesTaxInclusive ?? true,
                receiptPrintForm: receipt.receiptPrintForm || 'Receipt48',
                receiptDeviceSignature: {
                    hash: receipt.receiptDeviceSignature?.hash,
                    signature: receipt.receiptDeviceSignature?.signature || 'default-signature',
                },
            },
        };

        console.log('Mongo Payload:', JSON.stringify(mongoPayload, null, 2));

        const newReceipt = new Receipt(mongoPayload);
        await newReceipt.save();

        // Construct FDMS payload as per example schema
        const fdmsPayload = {
            submitReceiptRequest: {
                receipt: { // Wrap receipt under submitReceiptRequest
                    receiptType: receipt.receiptType,
                    receiptCurrency: receipt.receiptCurrency,
                    receiptCounter: receipt.receiptCounter,
                    receiptGlobalNo: receipt.receiptGlobalNo,
                    invoiceNo: receipt.invoiceNo,
                    buyerData: {
                        buyerRegisterName: receipt.buyerData?.buyerRegisterName,
                        buyerTradeName: receipt.buyerData?.buyerTradeName,
                        vatNumber: receipt.buyerData?.vatNumber,
                        buyerTIN: receipt.buyerData?.buyerTIN,
                        buyerContacts: {
                            phoneNo: receipt.buyerData?.buyerContacts?.phoneNo,
                            email: receipt.buyerData?.buyerContacts?.email,
                        },
                        buyerAddress: {
                            province: receipt.buyerData?.buyerAddress?.province,
                            city: receipt.buyerData?.buyerAddress?.city,
                            street: receipt.buyerData?.buyerAddress?.street,
                            houseNo: receipt.buyerData?.buyerAddress?.houseNo,
                            district: receipt.buyerData?.buyerAddress?.district,
                        }
                    },
                    receiptNotes: receipt.receiptNotes || "",
                    receiptDate: receipt.receiptDate,
                    creditDebitNote: receipt.creditDebitNote || {
                        receiptID: 0,
                        deviceID: 0,
                        receiptGlobalNo: 0,
                        fiscalDayNo: 0,
                    },
                    receiptLinesTaxInclusive: receipt.receiptLinesTaxInclusive ?? true,
                    receiptLines: receipt.receiptLines.map((line: any) => ({
                        receiptLineType: line.receiptLineType,
                        receiptLineNo: line.receiptLineNo,
                        receiptLineHSCode: line.receiptLineHSCode,
                        receiptLineName: line.receiptLineName,
                        receiptLinePrice: line.receiptLinePrice,
                        receiptLineQuantity: line.receiptLineQuantity,
                        receiptLineTotal: line.receiptLineTotal,
                        taxCode: line.taxCode,
                        taxPercent: line.taxPercent,
                        taxID: line.taxID
                    })),
                    receiptTaxes: receipt.receiptTaxes.map((tax: any) => ({
                        taxCode: tax.taxCode,
                        taxPercent: tax.taxPercent,
                        taxID: tax.taxID,
                        taxAmount: tax.taxAmount,
                        salesAmountWithTax: tax.salesAmountWithTax
                    })),
                    receiptPayments: receipt.receiptPayments.map((payment: any) => ({
                        moneyTypeCode: payment.moneyTypeCode,
                        paymentAmount: payment.paymentAmount
                    })),
                    receiptTotal: receipt.receiptTotal,
                    receiptPrintForm: receipt.receiptPrintForm || "Receipt48",
                    receiptDeviceSignature: {
                        hash: receipt.receiptDeviceSignature?.hash || "default-hash",
                        signature: receipt.receiptDeviceSignature?.signature || "default-signature"
                    }
                }
            }
        };

        console.log('FDMS Payload:', JSON.stringify(fdmsPayload, null, 2));

        const response = await fetch(
            `https://fdmsapitest.zimra.co.zw/Device/v1/${process.env.DEVICE_ID}/submitReceipt`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'DeviceModelName': process.env.DEVICE_MODEL_NAME || 'Server',
                    'DeviceModelVersion': process.env.DEVICE_MODEL_VERSION_NO || 'v1',
                },
                body: JSON.stringify(fdmsPayload),
            }
        );

        if (!response.ok) {
            let errorDetails;
            try {
                errorDetails = await response.json();
            } catch {
                errorDetails = { message: 'Unable to parse FDMS error response as JSON.' };
            }
            console.error(`FDMS Error: Status: ${response.status}, URL: ${response.url}`, errorDetails);
            throw new Error(`Failed to submit receipt: ${response.statusText} - ${JSON.stringify(errorDetails)}`);
        }

        const result = await response.json();
        console.log("Receipt submitted successfully");

        return NextResponse.json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error:', errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}


