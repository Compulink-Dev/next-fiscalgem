import { NextRequest, NextResponse } from 'next/server';
import { PDFExtract } from 'pdf.js-extract';;
import { dbConnect } from '@/lib/db';
import InvoiceModel from '@/models/Invoice';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfExtract = new PDFExtract();

    try {
        const data = await new Promise((resolve, reject) => {
            pdfExtract.extractBuffer(Buffer.from(arrayBuffer), {}, (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });

        const payload = processPDFData(data);
        await saveToDatabase(payload);
        return NextResponse.json({ payload });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function processPDFData(data: any): any {
    const text = data.pages.map((page: any) => page.content.map((item: any) => item.str).join(' ')).join(' ');

    return {
        deviceID: 19034,
        receipt: {
            receiptType: 'FISCALINVOICE',
            receiptCurrency: 'USD',
            receiptCounter: extractField(text, /Receipt Counter:\s*(\d+)/),
            receiptGlobalNo: extractField(text, /Global No:\s*(\d+)/),
            invoiceNo: extractField(text, /Invoice No:\s*([^\s]+)/),
            buyerData: {
                buyerRegisterName: extractField(text, /Bill To:\s*(.*?)TIN:/),
                vatNumber: extractField(text, /VAT Number:\s*(\d+)/),
                buyerTIN: extractField(text, /TIN:\s*(\d+)/),
                buyerAddress: {
                    province: 'Harare',
                    city: 'Harare',
                    street: extractField(text, /Address:\s*(.*?)City:/),
                    houseNo: '',
                    district: 'Harare',
                },
            },
            receiptDate: '2024-10-23T00:00',
            receiptLinesTaxInclusive: true,
            receiptNotes: 'Terms and conditions extracted from the invoice.',
            receiptLines: extractItems(text),
            receiptTaxes: [
                {
                    taxCode: '1',
                    taxID: 3,
                    taxPercent: 15,
                    taxAmount: 16.10,
                    salesAmountWithTax: 123.50,
                },
            ],
            receiptPayments: [
                {
                    moneyTypeCode: 'Cash',
                    paymentAmount: 123.50,
                },
            ],
            receiptTotal: 123.50,
        },
    };
}

function extractField(text: string, regex: RegExp): string {
    const match = text.match(regex);
    return match ? match[1] : '';
}

function extractItems(text: string): any[] {
    const items = [];
    const itemRegex = /Item Code:\s*(.*?)Description:\s*(.*?)Price:\s*([\d.]+)\s*Quantity:\s*(\d+)/g;
    let match;

    while ((match = itemRegex.exec(text)) !== null) {
        items.push({
            receiptLineType: 'Sale',
            receiptLineName: match[2],
            receiptLinePrice: parseFloat(match[3]),
            receiptLineQuantity: parseInt(match[4], 10),
            receiptLineTotal: parseFloat(match[3]) * parseInt(match[4], 10),
        });
    }

    return items;
}

async function saveToDatabase(payload: any) {
    await dbConnect();
    const receipt = new InvoiceModel(payload.receipt);
    await receipt.save();
}
