import mongoose, { Schema, model, models } from 'mongoose';

const ExcelSchema = new Schema(
    {
        receiptType: String,
        receiptCurrency: String,
        receiptCounter: Number,
        receiptGlobalNo: Number,
        invoiceNo: String,
        receiptDate: String,
        receiptLines: Array,
        receiptTaxes: Array,
        receiptPayments: Array,
        receiptTotal: Number,
        receiptDeviceSignature: Object,
    },
    { timestamps: true }
);

const Excel = models.Receipt || model('Excel', ExcelSchema);

export default Excel;
