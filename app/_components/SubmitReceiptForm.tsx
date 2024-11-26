// components/SubmitReceiptForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { receiptSchema } from "@/lib/schemas/submitReceiptSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type ReceiptFormValues = z.infer<typeof receiptSchema>;

export default function SubmitReceiptForm() {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<ReceiptFormValues>({
        resolver: zodResolver(receiptSchema),
    });

    const onSubmit = async (data: ReceiptFormValues) => {
        try {
            const response = await fetch("/api/submit-receipt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Failed to submit receipt");
            const result = await response.json();
            console.log("Receipt submitted successfully:", result);
        } catch (error) {
            console.error("Error submitting receipt:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Label>Device ID</Label>
            <Input  {...register("deviceID", { valueAsNumber: true })} />

            {/* More form fields for each required field in the schema */}

            <Button type="submit" disabled={isSubmitting}>
                Submit Receipt
            </Button>
        </form>
    );
}
