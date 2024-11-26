'use client';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import Title from '@/app/_components/Title';

// Define the schema with Zod
const schema = z.object({
    receiptType: z.string(),
    receiptCurrency: z.string(),
    receiptCounter: z.preprocess((val) => Number(val), z.number()),
    receiptGlobalNo: z.preprocess((val) => Number(val), z.number()), // Convert to number
    invoiceNo: z.string(),
    receiptDate: z.string(),
    receiptNotes: z.string(),
    buyerData: z.object({
        buyerRegisterName: z.string(),
        buyerTradeName: z.string(),
        vatNumber: z.string(),
        buyerTIN: z.string(),
        buyerContacts: z.object({
            phoneNo: z.string(),
            email: z.string().email(),
        }),
        buyerAddress: z.object({
            province: z.string(),
            city: z.string(),
            street: z.string(),
            houseNo: z.string(),
            district: z.string(),
        }),
    }),
    creditDebitNote: z.object({
        receiptID: z.preprocess((val) => Number(val), z.number()),
        deviceID: z.preprocess((val) => Number(val), z.number()),
        receiptGlobalNo: z.preprocess((val) => Number(val), z.number()),
        fiscalDayNo: z.preprocess((val) => Number(val), z.number()),
    }),
    receiptLinesTaxInclusive: z.boolean(),
    receiptLines: z.array(
        z.object({
            receiptLineType: z.string(),
            receiptLineNo: z.preprocess((val) => Number(val), z.number()),
            receiptLineHSCode: z.string(),
            receiptLineName: z.string(),
            receiptLinePrice: z.preprocess((val) => Number(val), z.number()),
            receiptLineQuantity: z.preprocess((val) => Number(val), z.number()),
            receiptLineTotal: z.preprocess((val) => Number(val), z.number()),
            taxCode: z.string(),
            taxPercent: z.preprocess((val) => Number(val), z.number()),
            taxID: z.preprocess((val) => Number(val), z.number()),
        })
    ),
    receiptTaxes: z.array(
        z.object({
            taxCode: z.string(),
            taxPercent: z.preprocess((val) => Number(val), z.number()),
            taxID: z.preprocess((val) => Number(val), z.number()),
            taxAmount: z.preprocess((val) => Number(val), z.number()),
            salesAmountWithTax: z.preprocess((val) => Number(val), z.number()),
        })
    ),
    receiptPayments: z.array(
        z.object({
            moneyTypeCode: z.string(),
            paymentAmount: z.preprocess((val) => Number(val), z.number()),
        })
    ),
    receiptTotal: z.preprocess((val) => Number(val), z.number()),
    receiptPrintForm: z.string(),
    receiptDeviceSignature: z.object({
        hash: z.string(),
        signature: z.string(),
    }),
});

type FormData = z.infer<typeof schema>;

function ReceiptForm() {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState<string | null>(null);

    // Use React Hook Form with Zod validation
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const { fields: receiptLinesFields, append: appendReceiptLine, remove: removeReceiptLine } = useFieldArray({
        control,
        name: 'receiptLines',
    });

    const { fields: receiptTaxesFields, append: appendReceiptTax, remove: removeReceiptTax } = useFieldArray({
        control,
        name: 'receiptTaxes',
    });

    const { fields: receiptPaymentsFields, append: appendReceiptPayment, remove: removeReceiptPayment } = useFieldArray({
        control,
        name: 'receiptPayments',
    });

    const onSubmit = async (data: FormData) => {
        console.log('Form submitted:', data);
        try {
            const transformedData = {
                ...data,
                receiptCounter: Number(data.receiptCounter),
                receiptGlobalNo: Number(data.receiptGlobalNo),
                receiptTotal: Number(data.receiptTotal),
                receiptLines: data.receiptLines.map(line => ({
                    ...line,
                    receiptLineNo: Number(line.receiptLineNo),
                    receiptLinePrice: Number(line.receiptLinePrice),
                    receiptLineQuantity: Number(line.receiptLineQuantity),
                    receiptLineTotal: Number(line.receiptLineTotal),
                    taxPercent: Number(line.taxPercent),
                    taxID: Number(line.taxID),
                })),
                receiptTaxes: data.receiptTaxes.map(tax => ({
                    ...tax,
                    taxPercent: Number(tax.taxPercent),
                    taxID: Number(tax.taxID),
                    taxAmount: Number(tax.taxAmount),
                    salesAmountWithTax: Number(tax.salesAmountWithTax),
                })),
                receiptPayments: data.receiptPayments.map(payment => ({
                    ...payment,
                    paymentAmount: Number(payment.paymentAmount),
                })),
                creditDebitNote: {
                    ...data.creditDebitNote,
                    receiptID: Number(data.creditDebitNote.receiptID),
                    deviceID: Number(data.creditDebitNote.deviceID),
                    fiscalDayNo: Number(data.creditDebitNote.fiscalDayNo),
                },
            };

            console.log('Transformed Data:', transformedData);  // Log the transformed data

            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ receiptData: transformedData }),
            });

            const result = await res.json();
            if (result.success) {
                setResponse(result.data);
                setError(null);
            } else {
                setError(result.error || 'Submission failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setResponse(null);
        }
    };

    return (
        <div className='p-8 flex flex-col w-full items-center justify-center gap-8'>
            <form onSubmit={handleSubmit(onSubmit)} className="w-[600px] border border-green-700 p-4 space-y-2 rounded">
                <div className="">
                    <Title />
                    <h2 className='font-bold text-green-700'>Submit Receipt</h2>
                </div>

                <Separator className='my-4 bg-green-700' />

                {/* Receipt Details */}
                <div className="flex items-center justify-between gap-2">
                    <div className="w-full">
                        <Label >Receipt Type:</Label>
                        <Input type="text" {...register('receiptType')} />
                        {errors.receiptType && <span className='text-xs text-red-700'>{errors.receiptType.message}</span>}
                    </div>
                    <div className="w-full">
                        <Label>Receipt Currency:</Label>
                        <Input type="text" {...register('receiptCurrency')} />
                        {errors.receiptCurrency && <span className='text-xs text-red-700'>{errors.receiptCurrency.message}</span>}
                    </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <div className="w-full">
                        <Label>Receipt Counter:</Label>
                        <Input type="number" {...register('receiptCounter')} />
                        {errors.receiptCounter && <span className='text-xs text-red-700'>{errors.receiptCounter.message}</span>}
                    </div>
                    <div className="w-full">
                        <Label>Receipt Global No: </Label>
                        <Input type="number" {...register('receiptGlobalNo')} />
                        {errors.receiptGlobalNo && <span className='text-xs text-red-700'>{errors.receiptGlobalNo.message}</span>}
                    </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <div className="w-full">
                        <Label>Invoice No:</Label>
                        <Input type="text" {...register('invoiceNo')} />
                        {errors.invoiceNo && <span className='text-xs text-red-700'>{errors.invoiceNo.message}</span>}
                    </div>
                    <div className="w-full">
                        <Label> Receipt Date:</Label>
                        <Input type="datetime-local" {...register('receiptDate')} />
                        {errors.receiptDate && <span className='text-xs text-red-700'>{errors.receiptDate.message}</span>}
                    </div>
                </div>
                <div className="">
                    <Label>Receipt Notes:</Label>
                    <Textarea {...register('receiptNotes')} />
                    {errors.receiptNotes && <span className='text-xs text-red-700'>{errors.receiptNotes.message}</span>}
                </div>

                <Separator className='my-4 bg-green-700' />

                {/* Buyer Data */}
                <h3 className='font-bold text-green-700'>Buyer Data:</h3>
                <div className="flex items-center justify-between gap-2">

                </div>
                <div className="flex items-center justify-between gap-2">
                    <div className="w-full">
                        <Label>Buyer Register Name:</Label>
                        <Input type="text" {...register('buyerData.buyerRegisterName')} />
                        {errors.buyerData?.buyerRegisterName && <span className='text-xs text-red-700'>{errors.buyerData.buyerRegisterName.message}</span>}
                    </div>
                    <div className="w-full">
                        <Label>Buyer Trade Name*: </Label>
                        <Input type="text" {...register('buyerData.buyerTradeName')} />
                        {errors.buyerData?.buyerTradeName && <span className='text-xs text-red-700'>{errors.buyerData.buyerTradeName.message}</span>}
                    </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <div className="w-full">
                        <Label>VAT Number*:</Label>
                        <Input type="text" {...register('buyerData.vatNumber')} />
                        {errors.buyerData?.vatNumber && <span className='text-xs text-red-700'>{errors.buyerData.vatNumber.message}</span>}
                    </div>
                    <div className="w-full">
                        <Label>Buyer TIN*:</Label>
                        <Input type="text" {...register('buyerData.buyerTIN')} />
                        {errors.buyerData?.buyerTIN && <span className='text-xs text-red-700'>{errors.buyerData.buyerTIN.message}</span>}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-full">
                        <Label>
                            Phone Number*:
                        </Label>
                        <Input type="text" {...register('buyerData.buyerContacts.phoneNo')} />
                        {errors.buyerData?.buyerContacts?.phoneNo && <span className='text-xs text-red-700'>{errors.buyerData.buyerContacts.phoneNo.message}</span>}
                    </div>
                    <div className="w-full">
                        <Label>
                            Email*:
                        </Label>
                        <Input type="email" {...register('buyerData.buyerContacts.email')} />
                        {errors.buyerData?.buyerContacts?.email && <span className='text-xs text-red-700'>{errors.buyerData.buyerContacts.email.message}</span>}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-full">
                        <Label>
                            Province*:
                        </Label>
                        <Input type="text" {...register('buyerData.buyerAddress.province')} />
                        {errors.buyerData?.buyerAddress?.province && <span className='text-xs text-red-700'>{errors.buyerData.buyerAddress.province.message}</span>}
                    </div>
                    <div className="w-full">
                        <Label>
                            City*:
                        </Label>
                        <Input type="text" {...register('buyerData.buyerAddress.city')} />
                        {errors.buyerData?.buyerAddress?.city && <span className='text-xs text-red-700'>{errors.buyerData.buyerAddress.city.message}</span>}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Label className='w-full'>
                        Street*:
                        <Input type="text" {...register('buyerData.buyerAddress.street')} />
                        {errors.buyerData?.buyerAddress?.street && <span className='text-xs text-red-700'>{errors.buyerData.buyerAddress.street.message}</span>}
                    </Label>
                    <Label className='w-full'>
                        House No*:
                        <Input type="text" {...register('buyerData.buyerAddress.houseNo')} />
                        {errors.buyerData?.buyerAddress?.houseNo && <span className='text-xs text-red-700'>{errors.buyerData.buyerAddress.houseNo.message}</span>}
                    </Label>
                </div>
                <Label>
                    District*:
                    <Input type="text" {...register('buyerData.buyerAddress.district')} />
                    {errors.buyerData?.buyerAddress?.district && <span className='text-xs text-red-700'>{errors.buyerData.buyerAddress.district.message}</span>}
                </Label>

                <Separator className='my-4 bg-green-700' />

                {/* Credit/Debit Note */}
                <h3 className='font-bold text-green-700'>Credit/Debit Note:</h3>
                <div className="flex items-center gap-2">
                    <div className="w-full">
                        <Label>
                            Receipt ID*:
                        </Label>
                        <Input type="number" {...register('creditDebitNote.receiptID')} />
                        {errors.creditDebitNote?.receiptID && <span className='text-xs text-red-700'>{errors.creditDebitNote.receiptID.message}</span>}
                    </div>
                    <div className="w-full">
                        <Label>
                            Device ID*:
                        </Label>
                        <Input type="number" {...register('creditDebitNote.deviceID')} />
                        {errors.creditDebitNote?.deviceID && <span className='text-xs text-red-700'>{errors.creditDebitNote.deviceID.message}</span>}
                    </div>
                </div>
                <div className="">
                    <Label>
                        Fiscal Day No*:
                    </Label>
                    <Input type="number" {...register('creditDebitNote.fiscalDayNo')} />
                    {errors.creditDebitNote?.fiscalDayNo && <span className='text-xs text-red-700'>{errors.creditDebitNote.fiscalDayNo.message}</span>}
                </div>

                <Separator className='my-4 bg-green-700' />

                {/* Receipt Lines */}
                <h3 className='font-bold text-green-700'>Receipt Lines:</h3>
                {receiptLinesFields.map((item, index) => (
                    <div key={item.id}>
                        <div className="flex items-center gap-2`">

                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-full">
                                <Label>
                                    Receipt Line Type:
                                </Label>
                                <Input type="text" {...register(`receiptLines.${index}.receiptLineType`)} />
                            </div>
                            <div className="w-full">
                                <Label>
                                    Receipt Line No:
                                </Label>
                                <Input type="number" {...register(`receiptLines.${index}.receiptLineNo`)} />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-full">
                                <Label>
                                    Receipt Line HS Code*:
                                </Label>
                                <Input type="text" {...register(`receiptLines.${index}.receiptLineHSCode`)} />
                            </div>
                            <div className="w-full">
                                <Label>
                                    Receipt Line Name:
                                </Label>
                                <Input type="text" {...register(`receiptLines.${index}.receiptLineName`)} />
                            </div>
                        </div>



                        <div className="flex items-center gap-2">
                            <div className="w-full">
                                <Label>
                                    Receipt Line Price*:
                                </Label>
                                <Input type="number" {...register(`receiptLines.${index}.receiptLinePrice`)} />
                            </div>
                            <div className="w-full">
                                <Label>
                                    Receipt Line Quantity:
                                </Label>
                                <Input type="number" {...register(`receiptLines.${index}.receiptLineQuantity`)} />
                            </div>
                        </div>



                        <div className="flex items-center gap-2">
                            <div className="w-full">
                                <Label>
                                    Receipt Line Total:
                                </Label>
                                <Input type="number" {...register(`receiptLines.${index}.receiptLineTotal`)} />
                            </div>
                            <div className="w-full">
                                <Label>
                                    Tax Code*:
                                </Label>
                                <Input type="text" {...register(`receiptLines.${index}.taxCode`)} />
                            </div>

                        </div>


                        <div className="flex items-center gap-2">
                            <div className="w-full">
                                <Label>
                                    Tax Percent*:
                                </Label>
                                <Input type="number" {...register(`receiptLines.${index}.taxPercent`)} />
                            </div>
                            <div className="w-full">
                                <Label>
                                    Tax ID:
                                </Label>
                                <Input type="number" {...register(`receiptLines.${index}.taxID`)} />
                            </div>
                        </div>

                        <Button
                            type="button"  // Prevents form submission
                            className='bg-red-700 hover:bg-red-500 my-4' onClick={() => removeReceiptLine(index)}>Remove Line</Button>
                    </div>
                ))}
                <Button
                    variant={'outline'}
                    type="button"  // Prevents form submission
                    className='w-full text-green-700'
                    onClick={() => appendReceiptLine({
                        receiptLineType: '',
                        receiptLineNo: 0,
                        receiptLineHSCode: '',
                        receiptLineName: '',
                        receiptLinePrice: 0,
                        receiptLineQuantity: 0,
                        receiptLineTotal: 0,
                        taxCode: '',
                        taxPercent: 0,
                        taxID: 0,
                    })}>
                    <Plus />
                    <p className="">Add Line</p>
                </Button>

                <Separator className='my-4 bg-green-700' />

                {/* Receipt Taxes */}
                <h3 className='font-bold text-green-700'>Receipt Taxes:</h3>
                {receiptTaxesFields.map((item, index) => (
                    <div key={item.id}>
                        <div className="flex items-center gap-2">
                            <div className="w-full">
                                <Label>Tax Code*:</Label>
                                <Input type="text" {...register(`receiptTaxes.${index}.taxCode`)} />
                            </div>
                            <div className="w-full">
                                <Label> Tax Percent*:</Label>
                                <Input type="number" {...register(`receiptTaxes.${index}.taxPercent`)} />
                            </div>
                        </div>


                        <div className="flex items-center gap-2">
                            <div className="w-full">
                                <Label>
                                    Tax ID:
                                </Label>
                                <Input type="number" {...register(`receiptTaxes.${index}.taxID`)} />
                            </div>
                            <div className="w-full">
                                <Label>
                                    Tax Amount:
                                </Label>
                                <Input type="number" {...register(`receiptTaxes.${index}.taxAmount`)} />
                            </div>
                        </div>

                        <div className="w-full">
                            <Label>
                                Sales Amount With Tax:
                            </Label>
                            <Input type="number" {...register(`receiptTaxes.${index}.salesAmountWithTax`)} />
                        </div>
                        <Button className='bg-red-700 hover:bg-red-500 my-4' onClick={() => removeReceiptTax(index)}>Remove Tax</Button>
                    </div>
                ))}
                <Button
                    variant={'outline'}
                    type="button"  // Prevents form submission
                    className='w-full text-green-700'
                    onClick={() => appendReceiptTax({
                        taxCode: '',
                        taxPercent: 0,
                        taxID: 0,
                        taxAmount: 0,
                        salesAmountWithTax: 0,
                    })}>
                    <Plus />
                    <p className="">Add Tax</p>
                </Button>

                <Separator className='my-4 bg-green-700' />

                {/* Receipt Payments */}
                <h3 className='font-bold text-green-700'>Receipt Payments:</h3>
                {receiptPaymentsFields.map((item, index) => (
                    <div key={item.id} className='mb-4'>

                        <div className="flex items-center gap-2">
                            <div className="w-full">
                                <Label>
                                    Money Type Code:
                                </Label>
                                <Input type="text" {...register(`receiptPayments.${index}.moneyTypeCode`)} />
                            </div>
                            <div className="w-full">
                                <Label>
                                    Payment Amount:
                                </Label>
                                <Input type="number" {...register(`receiptPayments.${index}.paymentAmount`)} />
                            </div>
                        </div>

                        <Button
                            type="button"  // Prevents form submission
                            className='bg-red-700 hover:bg-red-500 my-4' onClick={() => removeReceiptPayment(index)}>Remove Payment</Button>
                    </div>
                ))}
                <Button
                    variant={'outline'}
                    type="button"  // Prevents form submission
                    className='w-full text-green-700'
                    onClick={() => appendReceiptPayment({
                        moneyTypeCode: '',
                        paymentAmount: 0,
                    })}>
                    <Plus />
                    <p className="">Add Payment</p>
                </Button>

                <Separator className='my-4 bg-green-700' />

                {/* Submit Button */}
                <div className="w-full">
                    <Button type="submit" className='bg-green-700 hover:bg-green-500 mt-4 w-full'>Submit Receipt</Button>
                </div>
            </form>

            {response && (
                <div>
                    <h3>Submission successful:</h3>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}

            {error && <div>Error submitting receipt: {error}</div>}
        </div>
    );
}

export default ReceiptForm