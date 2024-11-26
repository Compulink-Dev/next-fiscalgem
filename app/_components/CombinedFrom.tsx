'use client';

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, } from "lucide-react";
import Title from "./Title";
import QRCode from "react-qr-code";
import { Separator } from "@/components/ui/separator";
import FormInput from "./FormInput";
import md5 from "md5";
import Link from "next/link";
import { useReceiptStore } from "@/lib/useReceiptStore";
import { useRouter } from "next/navigation";
import FormSelect from "./FromSelect";
// import FormDisabled from "./FormDisabled";

// Define schema
const receiptSchema = z.object({
    deviceID: z.number().min(1, "Device ID is required"),
    receipt: z.object({
        receiptType: z.string().min(1, "Receipt Type is required"), receiptCurrency: z.string().min(1, "Currency is required"), receiptCounter: z.number().min(1, "Counter must be valid"), receiptGlobalNo: z.number().min(1, "Global Number must be valid"), invoiceNo: z.string().min(1, "Invoice Number is required"),
        buyerData: z.object({
            buyerRegisterName: z.string(),
            buyerTradeName: z.string(),
            vatNumber: z.string().min(9, "Vat Number must be min length of 9").max(9, 'Vat Number must be max length of 9').optional(),
            buyerTIN: z.string().min(10, "Buyer TIN must be min length of 10").max(10, 'Buyer TIN must be max length of 10').optional(),
            buyerContacts: z.object({
                phoneNo: z.string().optional(),
                email: z.string().optional()
            }),
            buyerAddress: z.object({
                province: z.string().optional(),
                city: z.string().optional(),
                street: z.string().optional(),
                houseNo: z.string().optional(),
                district: z.string().optional(),
            }),
        }),
        receiptDate: z.string().refine(
            date => !isNaN(Date.parse(date)),
            { message: "Invalid date format. Please use 'YYYY-MM-DDTHH:mm'" }
        ),
        receiptLinesTaxInclusive: z.boolean().refine(val => val === true || val === false, {
            message: "Tax Inclusive field must be true or false",
        }),
        receiptNotes: z.string().optional(),
        receiptLines: z.array(
            z.object({
                receiptLineType: z.string().min(1, "Line Type is required"), receiptLineNo: z.number().min(1, "Line Number is required"), receiptLineHSCode: z.string().max(8, "HS Code must be a string with a maximum length of 8").optional(), receiptLineName: z.string().min(1, "Line Name is required"), receiptLinePrice: z.number().min(0, "Price must be valid"), receiptLineQuantity: z.number().min(1, "Quantity must be valid"), receiptLineTotal: z.number().min(0, "Total must be valid"), taxPercent: z.number().min(0, "Tax Percent must be valid"), taxCode: z.string().min(0, "Tax Code must be valid").max(3, "Tax Code must be a string with a maximum length of 3"), taxID: z.number().min(0, "Tax ID must be valid").max(3, "Tax Code must be a string with a maximum length of 3"),
            })
        ),
        receiptTaxes: z.array(
            z.object({
                taxCode: z.string().min(0, "Tax Code must be valid").optional(),
                taxID: z.number().min(0, "Tax ID must be valid").max(3, "Tax Code must be a string with a maximum length of 3"),
                taxPercent: z.number().min(0, "Tax Percent must be valid"),
                taxAmount: z.number().min(0, "Tax Amount must be valid"),
                salesAmountWithTax: z.number().min(0, "Sales Amount must be valid"),
            })
        ),
        receiptPayments: z.array(
            z.object({
                moneyTypeCode: z.string().min(1, "Payment Type is required"),
                paymentAmount: z.number().min(0, "Payment Amount must be valid"),
            })
        ),
        receiptTotal: z.number().min(0, "Receipt Total must be valid"),
        receiptDeviceSignature: z.object({
            hash: z.string(),
            signature: z.string(),
        })
    }),
});



type ReceiptFormData = z.infer<typeof receiptSchema>;


export default function CombinedForm() {
    const {
        receiptSignature,
        qrUrl,
        error,
        md5Hash16,
        finalPayload,
        setReceiptSignature,
        setResponse,
        setQrUrl,
        setError,
        setMd5Hash16,
        setFinalPayload,
    } = useReceiptStore();

    const { register, handleSubmit, setValue, watch, getValues, formState: { errors }, control } = useForm<ReceiptFormData>({
        resolver: zodResolver(receiptSchema),
        defaultValues: {
            deviceID: 19034,
            receipt: {
                receiptType: "0",
                receiptCurrency: "USD",
                receiptCounter: 1,
                receiptGlobalNo: 1,
                invoiceNo: "",
                receiptDate: "",
                receiptLinesTaxInclusive: true,
                receiptNotes: "",
                receiptLines: [
                    {
                        receiptLineType: "1",
                        receiptLineNo: 1,
                        receiptLineHSCode: "112",
                        receiptLineName: "",
                        receiptLinePrice: 0,
                        receiptLineQuantity: 1,
                        receiptLineTotal: 0,
                        taxPercent: 0,
                        taxCode: "2",
                        taxID: 1,
                    },
                ],
                receiptTaxes: [
                    {
                        taxCode: "2",
                        taxID: 3,
                        taxPercent: 0,
                        taxAmount: 0,
                        salesAmountWithTax: 0,
                    },
                ],
                receiptPayments: [
                    { moneyTypeCode: "Cash", paymentAmount: 0 },
                ],
                receiptTotal: 0,
                receiptDeviceSignature: { hash: '', signature: "" },
            },
        }
    });

    // Watch the receiptTaxes array
    const receiptTaxes = watch("receipt.receiptTaxes");

    useEffect(() => {
        console.log("Watched receiptTaxes:", receiptTaxes);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        receiptTaxes.forEach((tax: any, index: any) => {
            const { salesAmountWithTax, taxPercent } = tax;

            console.log('TaxPercent : ', taxPercent);
            console.log('salesAmountWithTax : ', salesAmountWithTax);


            // Ensure valid values before calculation
            if (salesAmountWithTax > 0 && taxPercent > 0) {
                const calculatedTaxAmount = parseFloat(
                    (salesAmountWithTax * (taxPercent / 115)).toFixed(2)
                );

                // Log calculation for debugging
                console.log(
                    `Index ${index} - Calculated Tax Amount:`,
                    calculatedTaxAmount
                );


                // Update taxAmount in the form state
                setValue(
                    `receipt.receiptTaxes.${index}.taxAmount`,
                    Number(calculatedTaxAmount), // Ensure proper formatting
                    { shouldValidate: true } // Trigger validation
                );
            }
        });
        // Log the updated state after applying changes
        console.log("Updated Form State:", getValues("receipt.receiptTaxes"));
    }, [receiptTaxes, setValue]);


    console.log('Tax Amount 2 :', receiptTaxes);

    console.log("Updated Form State:", getValues("receipt.receiptTaxes"));

    const testCalculation = 123.50 * (15 / 115);
    console.log("Test Calculation:", testCalculation);

    const { fields: receiptLines, append: appendReceiptLine, remove: removeReceiptLine } = useFieldArray({
        control,
        name: 'receipt.receiptLines',
    });

    const { fields: receiptTaxesFields, append: appendReceiptTax, remove: removeReceiptTax } = useFieldArray({
        control,
        name: 'receipt.receiptTaxes',
    });

    const { fields: receiptPayments, append: appendReceiptPayment, remove: removeReceiptPayment } = useFieldArray({
        control,
        name: 'receipt.receiptPayments',
    });

    const router = useRouter()

    const onSubmit = async (data: ReceiptFormData) => {
        console.log("Form data submitted: ", data);
        console.log("Receipt Device Signature: ", data.receipt.receiptDeviceSignature);

        const formatDate = (date: string) => {
            const dateObj = new Date(date);
            const dd = String(dateObj.getDate()).padStart(2, '0');
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const yyyy = dateObj.getFullYear();
            return `${dd}${mm}${yyyy}`; // ddMMyyyy
        };

        // Calculate receipt total dynamically
        const calculateReceiptTotal = (receiptLines: ReceiptFormData["receipt"]["receiptLines"]) => {
            return receiptLines.reduce((total, line) => total + line.receiptLineTotal, 0);
        };

        try {
            console.log("Form data before submission: ", data);

            // Calculate receipt total dynamically
            const receiptTotal = calculateReceiptTotal(data.receipt.receiptLines);
            console.log("Calculated Receipt Total:", receiptTotal);
            data.receipt.receiptTotal = receiptTotal;

            // Ensure receipt taxes align
            // data.receipt.receiptTaxes.forEach(tax => {
            //     tax.taxAmount = parseFloat((tax.salesAmountWithTax * (tax.taxPercent / 115)).toFixed(2)); // Round to 2 decimal places
            // });
            data.receipt.receiptTaxes.forEach(tax => {
                // Filter receipt lines with the same taxCode and taxPercent
                const relatedLines = data.receipt.receiptLines.filter(
                    line => line.taxCode === tax.taxCode && line.taxPercent === tax.taxPercent
                );

                // Sum up receiptLineTotal for the related lines
                const totalLineAmount = relatedLines.reduce((sum, line) => sum + line.receiptLineTotal, 0);

                if (data.receipt.receiptLinesTaxInclusive) {
                    // For tax-inclusive calculations
                    tax.taxAmount = parseFloat((totalLineAmount * (tax.taxPercent / (100 + tax.taxPercent))).toFixed(2));
                    tax.salesAmountWithTax = parseFloat(totalLineAmount.toFixed(2));
                } else {
                    // For tax-exclusive calculations
                    tax.taxAmount = parseFloat((totalLineAmount * (tax.taxPercent / 100)).toFixed(2));
                    tax.salesAmountWithTax = parseFloat((totalLineAmount * (1 + tax.taxPercent / 100)).toFixed(2));
                }
            });



            console.log("Updated Taxes:", data.receipt.receiptTaxes)

            const taxAmounts = data.receipt.receiptTaxes.map(tax => {
                tax.taxAmount = parseFloat((tax.salesAmountWithTax * (tax.taxPercent / 115)).toFixed(2));
                return tax.taxAmount;
            });
            console.log("Tax Amounts:", taxAmounts);

            const formattedDate = formatDate(data.receipt.receiptDate);

            // Step 1: Generate Signature
            const signatureResponse = await fetch('/api/hash', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    receiptDate: data.receipt.receiptDate,
                    receiptTotal: data.receipt.receiptTotal,
                    receiptTaxes: data.receipt.receiptTaxes,
                    receiptGlobalNo: data.receipt.receiptGlobalNo,
                }),
            });


            if (!signatureResponse.ok) {
                console.error("Failed to generate signature:", await signatureResponse.text());
                throw new Error('Failed to generate signature');
            }
            const result = await signatureResponse.json();


            console.log("Device Signature :", result.receiptDeviceSignature);


            // Attach the generated signature
            data.receipt.receiptDeviceSignature = result.receiptDeviceSignature;


            setReceiptSignature(result.receiptDeviceSignature);

            const md5Hash = md5(result.receiptQrData16);

            setMd5Hash16(md5Hash);


            console.log('Md5 : ', md5Hash);


            console.log("Signature attached:", result.receiptDeviceSignature)


            // QR Code Logic
            const first16Chars = result.receiptQrData16;
            const paddedDeviceID = String(data.deviceID).padStart(10, "0");
            const paddedGlobalNo = String(data.receipt.receiptGlobalNo).padStart(10, "0");

            const qrCodeUrl = `https://fdmstest.zimra.co.zw/${paddedDeviceID}${formattedDate}${paddedGlobalNo}${first16Chars}`;
            console.log("Generated QR Code URL:", qrCodeUrl);
            setQrUrl(qrCodeUrl);

            const finalData = {
                deviceID: data.deviceID,
                receipt: data.receipt,
            };

            // Step 2: Submit to FDMS
            const submissionResponse = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });

            console.log("Final Payload to API:", JSON.stringify({
                deviceID: data.deviceID,
                receipt: data.receipt,
            }, null, 2));


            if (!submissionResponse.ok) {
                console.error("Failed to submit receipt:", await submissionResponse.text());
                throw new Error('Failed to submit receipt to FDMS');
            }


            const submissionResult = await submissionResponse.json();
            console.log("Submission Result:", submissionResult);



            if (submissionResult.success) {
                setResponse(submissionResult.data);
                setFinalPayload(JSON.stringify(finalData, null, 2)); // Save the final payload to state

                // Navigate to the success page
                router.push(`/invoice?hash=${encodeURIComponent(result.receiptDeviceSignature.hash)}&signature=${encodeURIComponent(result.receiptDeviceSignature.signature)}&qrUrl=${encodeURIComponent(qrCodeUrl)}&md5Hash=${encodeURIComponent(md5Hash)}&payload=${encodeURIComponent(JSON.stringify(finalData))}`);

                console.log("Frontend Final Payload : ", finalPayload);
                setError(null);
            } else {
                setError(submissionResult.error || 'Submission failed');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
            setResponse(null);
            console.error("Error submitting data:", error);
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
                    <FormSelect label="Receipt Type:" name="receipt.receiptType"
                        options={[
                            { value: "FiscalInvoice", label: "Fiscal Invoice" },
                            { value: "CreditNote", label: "Credit Note" },
                            { value: "DebitNote", label: "Debit Note" },
                        ]}
                        register={register}
                        error={errors.receipt?.receiptType}
                    />
                    <FormSelect label="Receipt Currency:" name="receipt.receiptCurrency"
                        options={[
                            { value: "USD", label: "USD" },
                            { value: "ZWG", label: "ZWG" },
                        ]}
                        register={register}
                        error={errors.receipt?.receiptCurrency}
                    />
                </div>
                <div className="flex items-center justify-between gap-2">
                    <FormInput label="Receipt Counter:" name="receipt.receiptCounter" type="number" register={(name: any) => register(name, { setValueAs: (value) => (value === "" ? undefined : Number(value)) })} error={errors.receipt?.receiptCounter} />
                    <FormInput label="Receipt Global No:" name="receipt.receiptGlobalNo" type="number" register={(name: any) => register(name, { setValueAs: (value) => (value === "" ? undefined : Number(value)) })} error={errors.receipt?.receiptGlobalNo} />
                </div>
                <div className="flex items-center justify-between gap-2">
                    <FormInput label="Invoice No:" name="receipt.invoiceNo" type="text" register={register} error={errors.receipt?.invoiceNo} />
                    <FormInput label="Receipt Date:" name="receipt.receiptDate" type="datetime-local" register={register} error={errors.receipt?.receiptDate} />
                </div>
                <div>
                    <FormInput label="Receipt Notes:" name="receipt.receiptNotes" type="textarea" register={register} error={errors.receipt?.receiptNotes} />
                </div>

                <Separator className="my-4 bg-green-700" />

                {/* Buyer Data */}
                <h3 className="font-bold text-green-700">Buyer Data:</h3>
                <div className="flex items-center justify-between gap-2">
                    <FormInput label="Buyer Register Name:" name="receipt.buyerData.buyerRegisterName" type="text" register={register} error={errors.receipt?.buyerData?.buyerRegisterName} />
                    <FormInput label="Buyer Trade Name*:" name="receipt.buyerData.buyerTradeName" type="text" register={register} error={errors.receipt?.buyerData?.buyerTradeName} />
                </div>
                <div className="flex items-center justify-between gap-2">
                    <FormInput label="VAT Number*:" name="receipt.buyerData.vatNumber" type="text" register={register} error={errors.receipt?.buyerData?.vatNumber} />
                    <FormInput label="Buyer TIN*:" name="receipt.buyerData.buyerTIN" type="text" register={register} error={errors.receipt?.buyerData?.buyerTIN} />
                </div>
                <div className="flex items-center gap-2">
                    <FormInput label="Phone Number*:" name="receipt.buyerData.buyerContacts.phoneNo" type="text" register={register} error={errors.receipt?.buyerData?.buyerContacts?.phoneNo} />
                    <FormInput label="Email*:" name="receipt.buyerData.buyerContacts.email" type="email" register={register} error={errors.receipt?.buyerData?.buyerContacts?.email} />
                </div>
                <div className="flex items-center gap-2">
                    <FormInput label="Province*:" name="receipt.buyerData.buyerAddress.province" type="text" register={register} error={errors.receipt?.buyerData?.buyerAddress?.province} />
                    <FormInput label="City*:" name="receipt.buyerData.buyerAddress.city" type="text" register={register} error={errors.receipt?.buyerData?.buyerAddress?.city} />
                </div>
                <div className="flex items-center gap-2">
                    <FormInput label="Street*:" name="receipt.buyerData.buyerAddress.street" type="text" register={register} error={errors.receipt?.buyerData?.buyerAddress?.street} />
                    <FormInput label="House No*:" name="receipt.buyerData.buyerAddress.houseNo" type="text" register={register} error={errors.receipt?.buyerData?.buyerAddress?.houseNo} />
                </div>
                <FormInput label="District*:" name="receipt.buyerData.buyerAddress.district" type="text" register={register} error={errors.receipt?.buyerData?.buyerAddress?.district} />

                <Separator className='my-4 bg-green-700' />

                {/* Receipt Lines */}
                <h3 className='font-bold text-green-700'>Receipt Lines:</h3>
                {receiptLines.map((item, index) => (
                    <div key={item.id}>
                        <div className="flex items-center gap-2">
                            <FormSelect label="Receipt Line Type:" name={`receipt.receiptLines.${index}.receiptLineType`}
                                options={[
                                    { value: 0, label: "Sale" },
                                    { value: 1, label: "Discount" },
                                ]}
                                register={register}
                                error={errors.receipt?.receiptLines?.[index]?.receiptLineType}
                            />
                            <FormInput label="Receipt Line No:" name={`receipt.receiptLines.${index}.receiptLineNo`} type="number" register={(name: any) => register(name, { setValueAs: (value) => (value === "" ? undefined : Number(value)) })} error={errors.receipt?.receiptLines?.[index]?.receiptLineNo} />
                        </div>
                        <div className="flex items-center gap-2">
                            <FormInput label="Receipt Line HS Code*:" name={`receipt.receiptLines.${index}.receiptLineHSCode`} type="text" register={register} error={errors.receipt?.receiptLines?.[index]?.receiptLineHSCode} />
                            <FormInput label="Receipt Line Name:" name={`receipt.receiptLines.${index}.receiptLineName`} type="text" register={register} error={errors.receipt?.receiptLines?.[index]?.receiptLineName} />
                        </div>
                        <div className="flex items-center gap-2">
                            <FormInput label="Receipt Line Price*:" name={`receipt.receiptLines.${index}.receiptLinePrice`} type="number" register={(name: any) => register(name, { setValueAs: (value) => (value === "" ? undefined : Number(value)) })} error={errors.receipt?.receiptLines?.[index]?.receiptLinePrice} />
                            <FormInput label="Receipt Line Quantity:" name={`receipt.receiptLines.${index}.receiptLineQuantity`} type="number" register={(name: any) => register(name, { setValueAs: (value) => (value === "" ? undefined : Number(value)) })} error={errors.receipt?.receiptLines?.[index]?.receiptLineQuantity} />
                        </div>
                        <div className="flex items-center gap-2">
                            <FormInput label="Receipt Line Total:" name={`receipt.receiptLines.${index}.receiptLineTotal`} type="number" register={(name: any) => register(name, { setValueAs: (value) => (value === "" ? undefined : Number(value)) })} error={errors.receipt?.receiptLines?.[index]?.receiptLineTotal} />
                            <FormInput label="Tax Code*:" name={`receipt.receiptLines.${index}.taxCode`} type="text" register={register} error={errors.receipt?.receiptLines?.[index]?.taxCode} />
                        </div>
                        <div className="flex items-center gap-2">
                            <FormInput label="Tax Percent*:" name={`receipt.receiptLines.${index}.taxPercent`} type="number" register={(name: any) => register(name, { setValueAs: (value) => (value === "" ? undefined : Number(value)) })} error={errors.receipt?.receiptLines?.[index]?.taxPercent} />
                            <FormSelect label="Tax ID:" name={`receipt.receiptLines.${index}.taxID`}
                                options={[
                                    { value: 2, label: "0" },
                                    { value: 1, label: "Exempted" },
                                    { value: 3, label: "15" },
                                    { value: 514, label: "5" },
                                ]}
                                register={register}
                                valueType="number"
                                error={errors.receipt?.receiptLines?.[index]?.taxID}
                            />
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
                        receiptLineType: '', receiptLineNo: 0, receiptLineHSCode: '', receiptLineName: '', receiptLinePrice: 0, receiptLineQuantity: 0, receiptLineTotal: 0, taxCode: '', taxPercent: 0, taxID: 0,
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
                            <FormInput label="Tax Code*:" name={`receipt.receiptTaxes.${index}.taxCode`} type="text" register={register} error={errors.receipt?.receiptTaxes?.[index]?.taxCode} />
                            <FormInput label="Tax Percent*:" name={`receipt.receiptTaxes.${index}.taxPercent`} type="number" register={(name: any) => register(name, { setValueAs: (value) => (value === "" ? undefined : Number(value)) })} error={errors.receipt?.receiptTaxes?.[index]?.taxPercent} />
                        </div>
                        <div className="flex items-center gap-2">
                            {/* <FormInput label="Tax ID:" name={`receipt.receiptTaxes.${index}.taxID`} type="number" register={(name: any) => register(name, { setValueAs: (value) => (value === "" ? undefined : Number(value)) })} error={errors.receipt?.receiptTaxes?.[index]?.taxID} /> */}
                            <FormSelect label="Tax ID:" name={`receipt.receiptTaxes.${index}.taxID`}
                                options={[
                                    { value: 2, label: "0" },
                                    { value: 1, label: "Exempted" },
                                    { value: 3, label: "15" },
                                    { value: 514, label: "5" },
                                ]}
                                register={register}
                                valueType="number"
                                error={errors.receipt?.receiptTaxes?.[index]?.taxID}
                            />
                            {/* <FormDisabled
                                register={register}
                                label="Tax Amount:"
                                name={`receipt.receiptTaxes.${index}.taxAmount`}
                                type="number"
                                value={getValues(`receipt.receiptTaxes.${index}.taxAmount`)} // Updated dynamically
                                disabled
                            />
                            <FormInput
                                label="Tax Amount:"
                                name={`receipt.receiptTaxes.${index}.taxAmount`}
                                type="number"
                                register={(name: any) =>
                                    register(name, {
                                        setValueAs: (value) =>
                                            value === '' ? undefined : parseFloat(Number(value).toFixed(2)), // Ensure two decimal points
                                    })
                                }
                                error={errors.receipt?.receiptTaxes?.[index]?.taxAmount}
                            /> */}
                        </div>
                        <FormInput label="Sales Amount With Tax:" name={`receipt.receiptTaxes.${index}.salesAmountWithTax`} type="number" register={(name: any) => register(name, { setValueAs: (value) => (value === "" ? undefined : Number(value)) })} error={errors.receipt?.receiptTaxes?.[index]?.salesAmountWithTax} />
                        <Button
                            type="button"
                            className='bg-red-700 hover:bg-red-500 my-4'
                            onClick={() => removeReceiptTax(index)}
                        >
                            Remove Tax
                        </Button>
                    </div>
                ))}
                <Button
                    variant={'outline'}
                    type="button"
                    className='w-full text-green-700'
                    onClick={() =>
                        appendReceiptTax({
                            taxCode: '', taxPercent: 0, taxID: 0, taxAmount: 0, salesAmountWithTax: 0,
                        })
                    }
                >
                    <Plus />
                    <p className="">Add Tax</p>
                </Button>

                <Separator className='my-4 bg-green-700' />

                {/* Receipt Payments */}
                <h3 className='font-bold text-green-700'>Receipt Payments:</h3>
                {receiptPayments.map((item, index) => (
                    <div key={item.id} className='mb-4'>
                        <div className="flex items-center gap-2">
                            <FormSelect label="Receipt Currency:" name={`receipt.receiptPayments.${index}.moneyTypeCode`}
                                options={[
                                    { value: "Cash", label: "Cash" },
                                    { value: "Card", label: "Card" },
                                    { value: "MobileWallet", label: "MobileWallet" },
                                    { value: "Coupon", label: "Coupon" },
                                    { value: "Credit", label: "Credit" },
                                    { value: "BankTransfer", label: "BankTransfer" },
                                    { value: "Other", label: "Other" },
                                ]}
                                register={register}
                                error={errors.receipt?.receiptPayments?.[index]?.moneyTypeCode}
                            />
                            <FormInput label="Payment Amount:" name={`receipt.receiptPayments.${index}.paymentAmount`} type="number" register={(name: any) => register(name, { setValueAs: (value) => (value === "" ? undefined : Number(value)) })} error={errors.receipt?.receiptPayments?.[index]?.paymentAmount} />
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
                        moneyTypeCode: '', paymentAmount: 0,
                    })}>
                    <Plus />
                    <p className="">Add Payment</p>
                </Button>

                <Separator className='my-4 bg-green-700' />

                {/* Submit Button */}
                <div className="w-full">
                    <Button type="submit" className='bg-green-700 hover:bg-green-500 mt-4 w-full'>Submit Receipt</Button>
                </div>

                {/* Display Signature and QR Code */}
                {receiptSignature && (
                    <div className="bg-green-400 text-green-950 rounded p-4 text-sm w-full">
                        <h3 className="my-2 font-bold text-lg">Receipt Signature</h3>
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <strong>Hash:</strong>
                                <span>{receiptSignature.hash}</span>
                                <Button
                                    variant='ghost'
                                    onClick={() => navigator.clipboard.writeText(receiptSignature.hash)}
                                >
                                    Copy
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <strong>Signature:</strong>
                                <span className="text-ellipsis text-xs overflow-hidden" style={{ wordBreak: "break-all" }}>
                                    {receiptSignature.signature}
                                </span>
                                <Button
                                    variant='ghost'
                                    onClick={() => navigator.clipboard.writeText(receiptSignature.signature)}
                                >
                                    Copy
                                </Button>
                            </div>
                            {qrUrl && (
                                <div className="">
                                    <p className="font-bold my-2"> MD5 Hash: <span className="font-normal">{md5Hash16}</span></p>
                                    <QRCode value={qrUrl} />
                                    <p className="font-bold">Receipt Qr Data:</p>
                                    <div className="bg-white p-2 rounded">
                                        <Link href={qrUrl} target="_blank">

                                            <p className="text-xs  w-auto">{qrUrl}</p>
                                        </Link>
                                    </div>
                                </div>

                            )}

                            {/* Display Final Payload */}
                            {finalPayload ? (
                                <div className="text-ellipsis text-xs overflow-hidden" style={{ wordBreak: "break-all" }}>
                                    <h3 className="font-bold">Final Payload to API:</h3>
                                    <pre className="text-xs">{finalPayload}</pre>
                                </div>
                            ) : (<p>No Final Data</p>)}

                        </div>
                    </div>
                )}
            </form>


            {error && <div className="text-red-600">{error}</div>}

        </div>
    );
}