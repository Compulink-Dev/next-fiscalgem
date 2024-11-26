// src/validations/receiptValidation.ts
import { z } from 'zod';

export const BuyerDataSchema = z.object({
    buyerRegisterName: z.string().max(250),
    buyerTradeName: z.string().optional(),
    buyerTIN: z.string().length(10).optional(),
    VATNumber: z.string().length(9).optional(),
});

export const CreditDebitNoteSchema = z.object({
    receiptID: z.bigint().optional(),
    deviceID: z.number().optional(),
    receiptGlobalNo: z.number().optional(),
    fiscalDayNo: z.number().optional(),
});

export const ReceiptLineSchema = z.object({
    receiptLineType: z.string(),
    receiptLineNo: z.number().int().positive(),
    receiptLineHSCode: z.string().length(8).optional(),
    receiptLineName: z.string().max(200),
    receiptLinePrice: z.number().positive().optional(),
    receiptLineQuantity: z.number().positive(),
    receiptLineTotal: z.number(),
    taxCode: z.string().length(3).optional(),
    taxPercent: z.number().optional(),
    taxID: z.number().positive(),
});

export const ReceiptTaxSchema = z.object({
    taxCode: z.string().length(3).optional(),
    taxPercent: z.number().optional(),
    taxID: z.number().positive(),
    taxAmount: z.number(),
    salesAmountWithTax: z.number(),
});

export const PaymentSchema = z.object({
    moneyTypeCode: z.string(),
    paymentAmount: z.number(),
});

export const ReceiptSchema = z.object({
    deviceID: z.number().positive(),
    receiptType: z.string(),
    receiptCurrency: z.string().length(3),
    receiptCounter: z.number().int().positive(),
    receiptGlobalNo: z.number().int().positive(),
    invoiceNo: z.string().max(50),
    buyerData: BuyerDataSchema.optional(),
    receiptNotes: z.string().optional(),
    receiptDate: z.date(),
    creditDebitNote: CreditDebitNoteSchema.optional(),
    receiptLinesTaxInclusive: z.boolean(),
    receiptLines: z.array(ReceiptLineSchema),
    receiptTaxes: z.array(ReceiptTaxSchema),
    receiptPayments: z.array(PaymentSchema),
    receiptTotal: z.number(),
    receiptPrintForm: z.string().optional(),
    receiptDeviceSignature: z.string(),
});
