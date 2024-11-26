import { NextResponse } from 'next/server';
import { handleError } from '@/lib/error-handler';
import Receipt from '@/models/Receipt';
import dbConnect from '@/lib/db';
import axios from 'axios';
import { postSubmitFDMS } from '@/lib/postSubmit';

interface ReceiptItem {
    receiptLineType: string;
    receiptLineNo: number;
    receiptLineName: string;
    receiptLinePrice: number;
    receiptLineQuantity: number;
    receiptLineTotal: number;
    taxID: number;
}

interface SubmitReceiptRequest {
    deviceID: string;
    fiscalDayNo: number;
    receipt: {
        receiptType: string;
        receiptCurrency: string;
        receiptCounter: number;
        receiptGlobalNo: number;
        receiptDate: string;
        receiptLinesTaxInclusive: boolean;
        receiptLines: ReceiptItem[];
        receiptTaxes: any[];
        receiptPayments: any[];
        receiptTotal: number;
        receiptPrintForm: string;
        receiptDeviceSignature: { hash: string; signature: string };
    };
}

interface ReceiptData {
    deviceID: string;
    fiscalDayNo: number;
    receiptGlobalNo: number;
    receiptCounter: number;
    receiptDate: string;
    items: {
        itemID: string;
        description: string;
        quantity: number;
        price: number;
        receiptLineType: string;
        taxID: number;
    }[];
    totalAmount: number;
    receiptLinesTaxInclusive: boolean;
    receiptTaxes: any[];
    receiptPayments: any[];
    receiptDeviceSignature: {
        hash: string;
        signature: string;
    };
    receiptType: string;
    receiptCurrency: string;
}

export async function POST(request: Request) {
    try {
        const requestBody: SubmitReceiptRequest = await request.json();

        // Extract device model info from headers
        const deviceModelName = request.headers.get('DeviceModelName');
        const deviceModelVersion = request.headers.get('DeviceModelVersion');

        console.log("DeviceModelName : ", deviceModelName)
        console.log("DeviceModelVersion : ", deviceModelVersion)


        // Validate required headers
        if (!deviceModelName || !deviceModelVersion) {
            return handleError('DeviceModelName and DeviceModelVersion headers are required.');
        }

        // Extract receipt directly from the request body
        const receipt = requestBody.receipt;

        // Validate required receipt field
        if (!receipt) {
            return handleError('The Receipt field is required.');
        }

        // Prepare the receipt data
        const receiptData: ReceiptData = {
            deviceID: requestBody.deviceID,
            fiscalDayNo: requestBody.fiscalDayNo,
            receiptGlobalNo: receipt.receiptGlobalNo,
            receiptCounter: receipt.receiptCounter,
            receiptDate: receipt.receiptDate,
            items: receipt.receiptLines.map((item: ReceiptItem) => ({
                itemID: item.receiptLineNo.toString(),
                description: item.receiptLineName,
                quantity: item.receiptLineQuantity,
                price: item.receiptLinePrice,
                receiptLineType: item.receiptLineType,
                taxID: item.taxID,
            })),
            totalAmount: receipt.receiptTotal,
            receiptLinesTaxInclusive: receipt.receiptLinesTaxInclusive,
            receiptTaxes: receipt.receiptTaxes || [],
            receiptPayments: receipt.receiptPayments || [],
            receiptDeviceSignature: receipt.receiptDeviceSignature,
            receiptType: receipt.receiptType,
            receiptCurrency: receipt.receiptCurrency,
        };

        // Define required fields
        const requiredFields: Array<keyof ReceiptData> = [
            'deviceID', 'fiscalDayNo', 'receiptGlobalNo', 'receiptCounter',
            'totalAmount', 'items', 'receiptDeviceSignature', 'receiptType', 'receiptCurrency',
        ];

        // Validate required fields
        for (const field of requiredFields) {
            if (receiptData[field] === undefined || receiptData[field] === null) {
                return handleError(`Missing required field: ${field}`);
            }
        }

        // Validate that receiptLines are provided and not empty
        if (receiptData.items.length === 0) {
            return handleError('At least one receipt line is required.');
        }

        await dbConnect();

        // Save the new receipt in the database
        const newReceipt = await Receipt.create({
            deviceID: receiptData.deviceID,
            fiscalDayNo: receiptData.fiscalDayNo,
            receiptGlobalNo: receiptData.receiptGlobalNo,
            receiptCounter: receiptData.receiptCounter,
            items: receiptData.items,
            totalAmount: receiptData.totalAmount,
            status: 'pending',
        });

        // Prepare payload for the external service
        const zimraPayload = {
            deviceID: receiptData.deviceID,
            deviceModelName,
            deviceModelVersion,
            submitReceiptRequest: {
                receipt: {
                    ...receiptData,
                    receiptLines: receiptData.items.map(item => ({
                        receiptLineNo: item.itemID,
                        receiptLineName: item.description,
                        receiptLineQuantity: item.quantity,
                        receiptLinePrice: item.price,
                        receiptLineTotal: item.quantity * item.price, // Calculate total
                        receiptLineType: item.receiptLineType,
                        taxID: item.taxID,
                    })),
                    receiptTotal: receiptData.totalAmount, // Ensure receiptTotal is included
                },
            },
        };

        // Log the payload for debugging
        console.log('Zimra Payload:', JSON.stringify(zimraPayload, null, 2));

        // Send request to the external service
        const zimraResponse = await postSubmitFDMS('submitReceipt', zimraPayload);

        // Update the status based on the external response
        newReceipt.status = zimraResponse.data.status || 'unknown';
        await newReceipt.save();

        return NextResponse.json({ success: true, data: newReceipt });
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Axios error:', error.response.data);
            return handleError(error.response.data.message || 'Request failed.');
        }
        console.error('Unexpected error:', error);
        return handleError('An unexpected error occurred');
    }
}
