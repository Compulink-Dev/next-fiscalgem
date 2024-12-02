import mongoose, { Schema, Document } from "mongoose";

interface IFiscalCounter extends Document {
    fiscalCounterType: string;
    fiscalCounterCurrency: string;
    fiscalCounterTaxPercent?: number | null;
    fiscalCounterMoneyType?: string;
    fiscalCounterValue: number;
    createdAt: Date;
}

const FiscalCounterSchema: Schema = new Schema(
    {
        fiscalCounterType: { type: String, required: true },
        fiscalCounterCurrency: { type: String, required: true },
        fiscalCounterTaxPercent: { type: Number, required: false },
        fiscalCounterMoneyType: { type: String, required: false },
        fiscalCounterValue: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const FiscalCounter = mongoose.model<IFiscalCounter>("FiscalCounter", FiscalCounterSchema);

export default FiscalCounter;
