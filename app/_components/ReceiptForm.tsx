"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import md5 from "md5";
import Link from "next/link";
import QRCode from "qrcode.react";

// Zod Schema for receipt validation
const receiptSchema = z.object({
  deviceID: z.string().min(1, "Device ID is required"),
  receiptType: z.string().min(1, "Receipt Type is required"),
  receiptCurrency: z.string().min(1, "Receipt Currency is required"),
  receiptGlobalNo: z.preprocess(
    (val) => Number(val) || 0,
    z.number().positive().min(1, "Global Number must be valid")
  ),
  receiptDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format. Please use 'YYYY-MM-DDTHH:mm'",
    }),
  receiptTotal: z.preprocess(
    (val) => Math.round(Number(val) || 0),
    z.number().min(1, "Total must be greater than zero")
  ),
  receiptTaxes: z
    .array(
      z.object({
        taxID: z.preprocess(
          (val) => Number(val) || 0,
          z.number().positive("Tax ID must be a number")
        ),
        taxCode: z.string().optional(),
        taxPercent: z.preprocess(
          (val) => parseFloat(val as string) || 0.0,
          z.number().optional()
        ),
        taxAmount: z.preprocess(
          (val) => Math.round(Number(val) || 0),
          z.number().min(0)
        ),
        salesAmountWithTax: z.preprocess(
          (val) => Math.round(Number(val) || 0),
          z.number().min(0)
        ),
      })
    )
    .optional(),
  previousReceiptHash: z.string().optional(),
});

type ReceiptData = z.infer<typeof receiptSchema>;

export default function ReceiptForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ReceiptData>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      receiptTaxes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "receiptTaxes",
  });

  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [receiptSignature, setReceiptSignature] = useState<{
    hash: string;
    signature: string;
  } | null>(null);
  const [md5Hash16, setMd5Hash16] = useState<string | null>(null);

  const onSubmit = async (data: ReceiptData) => {
    const formattedData = {
      ...data,
      receiptGlobalNo: Number(data.receiptGlobalNo),
      receiptTotal: Math.round(Number(data.receiptTotal)),
      receiptDate: new Date(data.receiptDate).toISOString(),
      receiptTaxes:
        data.receiptTaxes?.map((tax) => ({
          ...tax,
          taxID: Number(tax.taxID),
          taxAmount: Math.round(Number(tax.taxAmount)),
          taxPercent: parseFloat(tax.taxPercent?.toString() || "0"),
          salesAmountWithTax: Math.round(Number(tax.salesAmountWithTax)),
        })) || [],
    };

    console.log("Url : ", formattedData);

    try {
      const response = await fetch("/api/hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const result = await response.json();

      console.log("Receipt Form Result :", result);

      const md5Hash16 = md5(result.receiptDeviceSignature.signature);

      const md5Hash = md5(result.receiptDeviceSignature.signature);

      const first16Chars = result.receiptQrData16; // This is the first 16 characters from the API response.

      console.log("First16Chars (First 16 Chars):", first16Chars);
      console.log("MD5 Hash (First 16 Chars):", md5Hash);

      console.log("MD5 Hash (First 16 Chars):", md5Hash16);

      setReceiptSignature(result.receiptDeviceSignature);
      setMd5Hash16(first16Chars);

      console.log("MD5 Hash 2 (First 16 Chars):", md5Hash16);

      const paddedDeviceID = String(formattedData.deviceID).padStart(10, "0");
      // Format date as ddMMyyyy
      const receiptDate = new Date(formattedData.receiptDate);
      const formattedDate =
        receiptDate.getDate().toString().padStart(2, "0") +
        (receiptDate.getMonth() + 1).toString().padStart(2, "0") +
        receiptDate.getFullYear();
      const paddedGlobalNo = String(formattedData.receiptGlobalNo).padStart(
        10,
        "0"
      );

      const qrCodeUrl = `https://fdmstest.zimra.co.zw/${paddedDeviceID}${formattedDate}${paddedGlobalNo}${first16Chars}`;

      setQrUrl(qrCodeUrl);
    } catch (error) {
      console.error("Submission Error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-gray-300 p-6 rounded space-y-6 w-[500px]"
    >
      <div className="space-y-2">
        <Label>Device ID</Label>
        <Input {...register("deviceID")} />
        {errors.deviceID && (
          <p className="text-red-600 text-sm">{errors.deviceID.message}</p>
        )}
      </div>
      <div>
        <Label>Receipt Type</Label>
        <Input {...register("receiptType")} />
        {errors.receiptType && (
          <p className="text-xs text-red-700 my-2">
            {errors.receiptType.message}
          </p>
        )}
      </div>
      <div>
        <Label>Receipt Currency</Label>
        <Input {...register("receiptCurrency")} />
        {errors.receiptCurrency && (
          <p className="text-xs text-red-700 my-2">
            {errors.receiptCurrency.message}
          </p>
        )}
      </div>
      <div>
        <Label>Receipt Global Number</Label>
        <Input type="number" {...register("receiptGlobalNo")} />
        {errors.receiptGlobalNo && (
          <p className="text-xs text-red-700 my-2">
            {errors.receiptGlobalNo.message}
          </p>
        )}
      </div>
      <div>
        <Label>Receipt Date</Label>
        <Input type="datetime-local" {...register("receiptDate")} />
        {errors.receiptDate && (
          <p className="text-xs text-red-700 my-2">
            {errors.receiptDate.message}
          </p>
        )}
      </div>
      <div>
        <Label>Receipt Total</Label>
        <Input type="number" step="0.01" {...register("receiptTotal")} />
        {errors.receiptTotal && (
          <p className="text-xs text-red-700 my-2">
            {errors.receiptTotal.message}
          </p>
        )}
      </div>

      {/* Dynamic Fields for receiptTaxes */}
      <div className="flex flex-col gap-2">
        <Label>Receipt Taxes</Label>
        {fields.map((item, index) => (
          <div key={item.id}>
            <div>
              <Label>Tax ID</Label>
              <Input
                type="number"
                {...register(`receiptTaxes.${index}.taxID`)}
              />
              {errors.receiptTaxes?.[index]?.taxID && (
                <p className="text-xs text-red-700 my-2">
                  {errors.receiptTaxes[index].taxID.message}
                </p>
              )}
            </div>
            <div>
              <Label>Tax Code</Label>
              <Input {...register(`receiptTaxes.${index}.taxCode`)} />
              {errors.receiptTaxes?.[index]?.taxCode && (
                <p className="text-xs text-red-700 my-2">
                  {errors.receiptTaxes[index].taxCode.message}
                </p>
              )}
            </div>
            <div>
              <Label>Tax Percent</Label>
              <Input
                type="number"
                step="0.01"
                {...register(`receiptTaxes.${index}.taxPercent`, {
                  valueAsNumber: true,
                  setValueAs: (value) => (value === "" ? 0 : parseFloat(value)), // Default to 0 if empty
                })}
              />
              {errors.receiptTaxes?.[index]?.taxPercent && (
                <p className="text-xs text-red-700 my-2">
                  {errors.receiptTaxes[index].taxPercent.message}
                </p>
              )}
            </div>
            <div>
              <Label>Tax Amount</Label>
              <Input
                type="number"
                step="0.01"
                {...register(`receiptTaxes.${index}.taxAmount`)}
              />
              {errors.receiptTaxes?.[index]?.taxAmount && (
                <p className="text-xs text-red-700 my-2">
                  {errors.receiptTaxes[index].taxAmount.message}
                </p>
              )}
            </div>
            <div>
              <Label>Sales Amount With Tax</Label>
              <Input
                type="number"
                step="0.01"
                {...register(`receiptTaxes.${index}.salesAmountWithTax`)}
              />
              {errors.receiptTaxes?.[index]?.salesAmountWithTax && (
                <p>{errors.receiptTaxes[index].salesAmountWithTax.message}</p>
              )}
            </div>
            <Button
              className="mt-4 bg-red-600 hover:bg-red-500 text-xs"
              type="button"
              onClick={() => remove(index)}
            >
              <X />
              <p className="">Remove Tax</p>
            </Button>
          </div>
        ))}
        <Button
          variant={"outline"}
          type="button"
          onClick={() =>
            append({
              taxID: 2,
              taxAmount: 0,
              taxPercent: 0,
              salesAmountWithTax: 0,
            })
          }
        >
          <Plus />
          <p className="text-xs">Add More Tax</p>
        </Button>
      </div>

      <div>
        <Label>Previous Receipt Hash (Optional)</Label>
        <Input {...register("previousReceiptHash")} />
        {errors.previousReceiptHash && (
          <p className="text-xs text-red-700 my-2">
            {errors.previousReceiptHash.message}
          </p>
        )}
      </div>

      {/* Other Form Inputs */}

      <Button
        type="submit"
        className="w-full bg-green-600 text-white hover:bg-green-700"
      >
        Submit
      </Button>
      {/* Display the hash and signature after submission */}
      {receiptSignature && (
        <div className="bg-green-400 text-green-950 rounded p-4 text-sm w-full">
          <h3 className="my-2 font-bold text-lg">Receipt Signature</h3>
          <div className="space-y-2">
            <div className="flex gap-2">
              <strong>Hash:</strong>
              <span
                className="text-ellipsis text-sx overflow-hidden"
                style={{ wordBreak: "break-all" }}
              >
                {receiptSignature.hash}
              </span>
              <Button
                variant={"ghost"}
                className="text-xs text-green-900 hover:text-green-700"
                onClick={() =>
                  navigator.clipboard.writeText(receiptSignature.hash)
                }
              >
                Copy
              </Button>
            </div>
            <div className="flex gap-2">
              <strong>Signature:</strong>
              <span
                className="text-ellipsis text-xs overflow-hidden"
                style={{ wordBreak: "break-all" }}
              >
                {receiptSignature.signature}
              </span>
              <Button
                variant={"ghost"}
                className="text-xs text-green-900 hover:text-green-700"
                onClick={() =>
                  navigator.clipboard.writeText(receiptSignature.signature)
                }
              >
                Copy
              </Button>
            </div>

            {/* Display the QR Code */}
            {qrUrl && (
              <div className="mt-2">
                <p className="font-bold">
                  {" "}
                  MD5 Hash: <span className="font-normal">{md5Hash16}</span>
                </p>
                <div className="my-4">
                  <h3 className="font-bold">QR Code:</h3>
                  <QRCode value={qrUrl} />
                </div>
                <p className="font-bold">Receipt Qr Data:</p>
                <div className="bg-white">
                  <Link href={qrUrl} target="_blank">
                    <p className="text-xs  w-auto">{qrUrl}</p>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
