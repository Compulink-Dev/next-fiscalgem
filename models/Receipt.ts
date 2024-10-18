// models/Receipt.ts
import { Schema, model, models } from 'mongoose';

const ReceiptSchema = new Schema({
    receiptType: { type: String, required: true },
    receiptCurrency: { type: String, required: true },
    receiptCounter: { type: Number, required: true },
    receiptGlobalNo: { type: Number, required: true },
    invoiceNo: { type: String, required: true },
    receiptDate: { type: Date, required: true },
    receiptLines: { type: Array, required: true },
    receiptTotal: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
});

export default models.Receipt || model('Receipt', ReceiptSchema);
