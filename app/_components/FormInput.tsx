// FormInput.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "react-hook-form";

interface FormInputProps {
    label: string;
    name: string;
    type: string;
    register: any;
    error?: FieldError;
    placeholder?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, name, type, register, error, placeholder }) => {
    return (
        <div className="w-full">
            <Label htmlFor={name}>{label}</Label>
            <Input
                id={name}
                type={type}
                step="any"
                placeholder={placeholder}
                {...register(name)}
            />
            {error && <p className="text-red-700 text-xs">{error.message}</p>}
        </div>
    );
};

export default FormInput;
