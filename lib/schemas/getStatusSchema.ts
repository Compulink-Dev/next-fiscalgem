import * as z from 'zod';

export const getStatusSchema = z.object({
    fiscalCode: z.string().nonempty("Fiscal code is required"),
});
