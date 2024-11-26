// FormInput.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "react-hook-form";

interface FormInputProps {
    label: string;
    name: string;
    type: string;
    value: any,
    register: any;
    error?: FieldError;
    placeholder?: string;
    disabled: boolean
}

const FormDisabled: React.FC<FormInputProps> = ({ label, name, type, register, error, value, disabled }) => (
    <div className="w-full">
        <Label htmlFor={name} className="font-medium">{label}</Label>
        <Input
            {...register(name)}
            type={type}
            className="border border-green-900 rounded p-2 text-black"
            value={value || ""}
            disabled={disabled}
        />
        {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
)


export default FormDisabled;
