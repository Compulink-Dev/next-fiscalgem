// models/Receipt.ts
import mongoose, { Schema, Document } from 'mongoose';

interface BuyerContacts {
    phoneNo: string;
    email: string;
}

interface BuyerAddress {
    province: string;
    city: string;
    street: string;
    houseNo: string;
    district: string;
}

interface BuyerData {
    buyerRegisterName: string;
    buyerTradeName: string;
    vatNumber: string;
    buyerTIN: string;
    buyerContacts: BuyerContacts;
    buyerAddress: BuyerAddress;
}

interface CreditDebitNote {
    receiptID: number;
    deviceID: number;
    receiptGlobalNo: number;
    fiscalDayNo: number;
}

interface ReceiptLine {
    receiptLineType: string;
    receiptLineNo: number;
    receiptLineHSCode: string;
    receiptLineName: string;
    receiptLinePrice: number;
    receiptLineQuantity: number;
    receiptLineTotal: number;
    taxCode: string;
    taxPercent: number;
    taxID: number;
}

interface ReceiptTax {
    taxCode: string;
    taxPercent: number;
    taxID: number;
    taxAmount: number;
    salesAmountWithTax: number;
}

interface ReceiptPayment {
    moneyTypeCode: string;
    paymentAmount: number;
}

interface ReceiptDeviceSignature {
    hash: string;
    signature: string;
}

interface Receipt extends Document {
    receiptType: string;
    receiptCurrency: string;
    receiptCounter: number;
    receiptGlobalNo: number;
    invoiceNo: string;
    buyerData: BuyerData;
    receiptNotes: string;
    receiptDate: Date;
    creditDebitNote: CreditDebitNote;
    receiptLinesTaxInclusive: boolean;
    receiptLines: ReceiptLine[];
    receiptTaxes: ReceiptTax[];
    receiptPayments: ReceiptPayment[];
    receiptTotal: number;
    receiptPrintForm: string;
    receiptDeviceSignature: ReceiptDeviceSignature;
}

const ReceiptSchema = new Schema<Receipt>({
    receiptType: { type: String, required: true },
    receiptCurrency: { type: String, required: true },
    receiptCounter: { type: Number, required: true },
    receiptGlobalNo: { type: Number, required: true },
    invoiceNo: { type: String, required: true },
    buyerData: {
        buyerRegisterName: { type: String, required: true },
        buyerTradeName: { type: String, },
        vatNumber: { type: String, },
        buyerTIN: { type: String, },
        buyerContacts: {
            phoneNo: { type: String, },
            email: { type: String, },
        },
        buyerAddress: {
            province: { type: String, },
            city: { type: String, },
            street: { type: String, },
            houseNo: { type: String, },
            district: { type: String, },
        },
    },
    receiptNotes: { type: String },
    receiptDate: { type: Date, required: true },
    creditDebitNote: {
        receiptID: { type: Number },
        deviceID: { type: Number },
        receiptGlobalNo: { type: Number },
        fiscalDayNo: { type: Number },
    },
    receiptLinesTaxInclusive: { type: Boolean, required: true },
    receiptLines: [{
        receiptLineType: { type: String, required: true },
        receiptLineNo: { type: Number, required: true },
        receiptLineHSCode: { type: String },
        receiptLineName: { type: String, required: true },
        receiptLinePrice: { type: Number },
        receiptLineQuantity: { type: Number, required: true },
        receiptLineTotal: { type: Number, required: true },
        taxCode: { type: String },
        taxPercent: { type: Number },
        taxID: { type: Number, required: true },
    }],
    receiptTaxes: [{
        taxCode: { type: String },
        taxPercent: { type: Number },
        taxID: { type: Number, required: true },
        taxAmount: { type: Number, required: true },
        salesAmountWithTax: { type: Number, required: true },
    }],
    receiptPayments: [{
        moneyTypeCode: { type: String, required: true },
        paymentAmount: { type: Number, required: true },
    }],
    receiptTotal: { type: Number, required: true },
    receiptPrintForm: { type: String },
    receiptDeviceSignature: {
        hash: { type: String, required: true },
        signature: { type: String, required: true },
    },
});

export default mongoose.models.Receipt || mongoose.model<Receipt>('Receipt', ReceiptSchema);
