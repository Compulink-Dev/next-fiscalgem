import * as z from 'zod';

export const fiscalizationSchema = z.object({
    invoiceNumber: z.string().nonempty("Invoice number is required"),
    totalAmount: z.number().positive("Total amount must be positive"),
    taxAmount: z.number().positive("Tax amount must be positive"),
});
