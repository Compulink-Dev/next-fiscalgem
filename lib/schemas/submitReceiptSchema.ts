// schemas/submitReceiptSchema.ts
import { z } from "zod";

export const receiptSchema = z.object({
    deviceID: z.number().int().positive("Device ID must be a positive integer"),
    receipt: z.object({
        receiptType: z.enum(["FiscalInvoice", "CreditNote", "DebitNote"]),
        receiptCurrency: z.string().length(3, "Currency code must be 3 characters"),
        receiptCounter: z.number().int().positive(),
        receiptGlobalNo: z.number().int().positive(),
        invoiceNo: z.string().max(50, "Invoice number must be 50 characters or less"),
        buyerData: z.object({
            buyerRegisterName: z.string().max(250),
            buyerTradeName: z.string().optional(),
            buyerTIN: z.string().max(10).optional(),
            VATNumber: z.string().max(9).optional(),
            buyerContacts: z.object({
                email: z.string().email("Invalid email address").optional(),
                phone: z.string().optional()
            }).optional(),
            buyerAddress: z.object({
                street: z.string().optional(),
                city: z.string().optional(),
                postalCode: z.string().optional(),
                country: z.string().optional(),
            }).optional(),
        }),
        receiptNotes: z.string().optional(),
        receiptDate: z.date(),
        creditDebitNote: z.object({
            receiptID: z.bigint().optional(),
            deviceID: z.number().optional(),
            receiptGlobalNo: z.number().optional(),
            fiscalDayNo: z.number().optional(),
        }).optional(),
        receiptLines: z.array(z.object({
            receiptLineType: z.enum(["Sale", "Discount"]),
            receiptLineNo: z.number().int().positive(),
            receiptLineHSCode: z.string().max(8).optional(),
            receiptLineName: z.string().max(200),
            receiptLinePrice: z.number().optional(),
            receiptLineQuantity: z.number().positive(),
            receiptLineTotal: z.number(),
            taxCode: z.string().max(3).optional(),
            taxPercent: z.number().optional(),
            taxID: z.number(),
        })).min(1, "At least one receipt line is required"),
        receiptTaxes: z.array(z.object({
            taxCode: z.string().max(3).optional(),
            taxPercent: z.number().optional(),
            taxID: z.number(),
            taxAmount: z.number(),
            salesAmountWithTax: z.number(),
        })).min(1),
        receiptPayments: z.array(z.object({
            moneyTypeCode: z.string(),
            paymentAmount: z.number(),
        })).min(1),
        receiptTotal: z.number(),
        receiptPrintForm: z.enum(["Receipt48", "InvoiceA4"]).optional(),
        receiptDeviceSignature: z.object({
            signatureData: z.string(),
            hash: z.string(),
        }),
    }),
});
