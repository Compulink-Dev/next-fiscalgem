import dbConnect from '@/lib/db';
import { FiscalCounter } from '@/models/Counters';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    await dbConnect();

    const { receiptType, salesAmountWithTax, taxAmount, paymentAmount, fiscalDay, currency, tax, paymentMethod } = await req.json();

    const updateData: Record<string, any> = { currency, tax, paymentMethod };

    switch (receiptType) {
        case 'FiscalInvoice':
            updateData.saleByTax = salesAmountWithTax;
            updateData.saleTaxByTax = taxAmount;
            updateData.balanceByMoneyType = paymentAmount;
            break;
        case 'CreditNote':
            updateData.creditNoteByTax = -salesAmountWithTax;
            updateData.creditNoteTaxByTax = -taxAmount;
            updateData.balanceByMoneyType = -paymentAmount;
            break;
        case 'DebitNote':
            updateData.debitNoteByTax = salesAmountWithTax;
            updateData.debitNoteTaxByTax = taxAmount;
            updateData.balanceByMoneyType = paymentAmount;
            break;
        default:
            return NextResponse.json({ message: 'Invalid receipt type' }, { status: 400 });
    }

    const counter = await FiscalCounter.findOneAndUpdate(
        { fiscalDay },
        { $inc: updateData },
        { upsert: true, new: true }
    );

    return NextResponse.json(counter, { status: 200 });
}
