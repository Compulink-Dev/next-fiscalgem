import mongoose, { Schema, model, models } from 'mongoose';

const BuyerSchema = new Schema({
    buyerRegisterName: String,
    vatNumber: String,
    buyerTIN: String,
    buyerAddress: {
        street: String,
        city: String,
        province: String,
        houseNo: String,
        district: String,
    },
});

const ReceiptLineSchema = new Schema({
    receiptLineType: String,
    receiptLineName: String,
    receiptLinePrice: Number,
    receiptLineQuantity: Number,
    receiptLineTotal: Number,
});

const InvoiceSchema = new Schema({
    receiptType: String,
    receiptCurrency: String,
    receiptCounter: Number,
    receiptGlobalNo: Number,
    invoiceNo: String,
    buyerData: BuyerSchema,
    receiptDate: Date,
    receiptLinesTaxInclusive: Boolean,
    receiptNotes: String,
    receiptLines: [ReceiptLineSchema],
    receiptTaxes: [
        {
            taxCode: String,
            taxID: Number,
            taxPercent: Number,
            taxAmount: Number,
            salesAmountWithTax: Number,
        },
    ],
    receiptPayments: [
        {
            moneyTypeCode: String,
            paymentAmount: Number,
        },
    ],
    receiptTotal: Number,
});

const InvoiceModel = models.Invoice || model('Invoice', InvoiceSchema);

export default InvoiceModel;
