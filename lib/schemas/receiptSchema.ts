import { z } from "zod";

const ReceiptLineSchema = z.object({
    receiptLineType: z.string(),
    receiptLineNo: z.number(),
    receiptLineName: z.string(),
    receiptLinePrice: z.number(),
    receiptLineQuantity: z.number(),
    receiptLineTotal: z.number(),
    taxCode: z.string(),
    taxPercent: z.number(),
    taxID: z.number(),
});

const ReceiptTaxSchema = z.object({
    taxCode: z.string(),
    taxPercent: z.number(),
    taxID: z.number(),
    taxAmount: z.number(),
    salesAmountWithTax: z.number(),
});

const ReceiptPaymentSchema = z.object({
    moneyTypeCode: z.string(),
    paymentAmount: z.number(),
});

const ReceiptSchema = z.object({
    receiptType: z.string(),
    receiptCurrency: z.string(),
    receiptCounter: z.number(),
    receiptGlobalNo: z.number(),
    invoiceNo: z.string(),
    receiptDate: z.string(),
    receiptLinesTaxInclusive: z.boolean(),
    receiptLines: z.array(ReceiptLineSchema),
    receiptTaxes: z.array(ReceiptTaxSchema),
    receiptPayments: z.array(ReceiptPaymentSchema),
    receiptTotal: z.number(),
    receiptPrintForm: z.string(),
    receiptDeviceSignature: z.object({
        hash: z.string(),
        signature: z.string(),
    }),
});

const InvoiceSchema = z.object({
    deviceID: z.string(),
    fiscalDayNo: z.number(),
    receipt: ReceiptSchema,
});

export type InvoiceData = z.infer<typeof InvoiceSchema>;
export const validateInvoiceData = (data: unknown) => InvoiceSchema.parse(data);
