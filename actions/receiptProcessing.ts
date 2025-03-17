import * as XLSX from 'xlsx';
import axios from 'axios';
import https from 'https';
import { Readable } from 'stream';
const Busboy = require('busboy');

export interface ReceiptPayload {
    [key: string]: any;
}

export function fetchToNodeReadable(stream: ReadableStream<Uint8Array>): Readable {
    const reader = stream.getReader();
    return new Readable({
        async read() {
            const { done, value } = await reader.read();
            if (done) {
                this.push(null); // End of stream
            } else {
                this.push(Buffer.from(value));
            }
        },
    });
}

export function parseExcel(file: Buffer): ReceiptPayload[] {
    const workbook = XLSX.read(file, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data: (string | number)[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const headers: string[] = data[0] as string[];
    const rows: (string | number)[][] = data.slice(1);

    return rows.map((row) => {
        const receipt: ReceiptPayload = {};
        headers.forEach((header, index) => {
            receipt[header] = row[index];
        });
        return receipt;
    });
}

export async function processFile(req: Request): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const headers = Object.fromEntries(req.headers.entries());
        const busboy = new Busboy({ headers });

        let fileBuffer: Buffer | null = null;

        busboy.on('file', (fieldname: any, file: any) => {
            const chunks: Buffer[] = [];
            file.on('data', (chunk: any) => chunks.push(chunk));
            file.on('end', () => (fileBuffer = Buffer.concat(chunks)));
        });

        busboy.on('finish', () => {
            if (fileBuffer) {
                resolve(fileBuffer);
            } else {
                reject(new Error('No file uploaded.'));
            }
        });

        const nodeReadable = fetchToNodeReadable(req.body as ReadableStream<Uint8Array>);
        nodeReadable.pipe(busboy);
    });
}

export async function fiscalizeReceipt(payload: any) {
    const httpsAgent = new https.Agent({
        pfx: Buffer.from(process.env.CLIENT_CERT_BASE64 as string, 'base64'),
        passphrase: process.env.CLIENT_CERT_PASSWORD,
    });

    const response = await axios.post(
        `https://fdmsapitest.zimra.co.zw/Device/v1/${payload.deviceID}/submitReceipt`,
        payload,
        {
            headers: {
                'Content-Type': 'application/json',
                'DeviceModelName': 'Server',
                'DeviceModelVersion': 'v1',
            },
            httpsAgent,
        }
    );

    return response.data;
}

export function mapToFDMSPayload(invoice: ReceiptPayload) {
    return {
        receipt: {
            receiptType: invoice.ReceiptType || 'FiscalInvoice',
            receiptCurrency: invoice.ReceiptCurrency || 'USD',
            receiptCounter: invoice.ReceiptCounter || 0,
            receiptGlobalNo: invoice.ReceiptGlobalNo || 0,
            invoiceNo: invoice.InvoiceNo || 'INV123',
            buyerData: {
                buyerRegisterName: invoice.BuyerName || '',
                buyerTradeName: invoice.BuyerTradeName || '',
                vatNumber: invoice.VATNumber || '',
                buyerTIN: invoice.BuyerTIN || '',
                buyerContacts: {
                    phoneNo: invoice.Phone || '',
                    email: invoice.Email || '',
                },
                buyerAddress: {
                    province: invoice.Province || '',
                    city: invoice.City || '',
                    street: invoice.Street || '',
                    houseNo: invoice.HouseNo || '',
                    district: invoice.District || '',
                },
            },
            receiptLines: JSON.parse(invoice.ReceiptLines || '[]'),
            receiptTaxes: JSON.parse(invoice.ReceiptTaxes || '[]'),
            receiptPayments: JSON.parse(invoice.ReceiptPayments || '[]'),
            receiptTotal: invoice.ReceiptTotal || 0,
            receiptDate: new Date(invoice.ReceiptDate).toISOString(),
            receiptDeviceSignature: {
                hash: invoice.Hash || '',
                signature: invoice.Signature || '',
            },
        },
    };
}
