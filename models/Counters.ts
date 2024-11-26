import { Schema, model, models } from 'mongoose';

const fiscalCounterSchema = new Schema({
    fiscalDay: { type: Date, required: true },
    saleByTax: { type: Number, default: 0 },
    saleTaxByTax: { type: Number, default: 0 },
    creditNoteByTax: { type: Number, default: 0 },
    creditNoteTaxByTax: { type: Number, default: 0 },
    debitNoteByTax: { type: Number, default: 0 },
    debitNoteTaxByTax: { type: Number, default: 0 },
    balanceByMoneyType: { type: Number, default: 0 },
    currency: { type: String, required: true },
    tax: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    fiscalDayReportSent: { type: Boolean, default: false },
}, { timestamps: true });

export const FiscalCounter = models.FiscalCounter || model('FiscalCounter', fiscalCounterSchema);
