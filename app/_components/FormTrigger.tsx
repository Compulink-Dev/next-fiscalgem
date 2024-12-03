import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, Path, UseFormRegister, FieldValues } from "react-hook-form";

interface FormInputProps<TFormValues extends FieldValues> {
    label: string;
    name: Path<TFormValues>; // Ensures `name` matches keys in the form schema
    type: string;
    register: UseFormRegister<TFormValues>; // Correct typing for `register`
    trigger: (name: Path<TFormValues>) => void; // Type-safe trigger function
    error?: FieldError;
    placeholder?: string;
    onChange: (value: string | number) => void; // Handle price and quantity change
}

const FormTrigger = <TFormValues extends FieldValues>({
    label,
    name,
    type,
    register,
    trigger,
    error,
    placeholder,
    onChange,
}: FormInputProps<TFormValues>) => {
    return (
        <div className="w-full">
            <Label htmlFor={name}>{label}</Label>
            <Input
                id={name}
                type={type}
                step="any"
                placeholder={placeholder}
                {...register(name, {
                    setValueAs: (value) => (value === "" ? undefined : Number(value)), // Ensure it's a number
                    onChange: (e) => {
                        const value = e.target.value;
                        onChange(value); // Trigger total calculation
                        trigger(name); // Trigger validation
                    },
                })}
            />
            {error && <p className="text-red-700 text-xs">{error.message}</p>}
        </div>
    );
};

export default FormTrigger;
