import { Label } from "@/components/ui/label";
import { FieldError } from "react-hook-form";

interface FormSelectProps {
    label: string;
    name: string;
    options: { value: string | number; label: string }[];
    register: any;
    error?: FieldError;
    onChangeCallback?: (selectedOption: { value: string | number; label: string } | undefined) => void; // Make it optional
    valueType?: "string" | "number"; // Specify the expected value type
}

const FormSelect: React.FC<FormSelectProps> = ({ label, name, options, register, error, valueType = "string", onChangeCallback = () => { } }) => {
    return (
        <div className="w-full">
            <Label htmlFor={name}>{label}</Label>
            <select
                id={name}
                {...register(name, {
                    setValueAs: (value: any) =>
                        valueType === "number" ? (value ? Number(value) : undefined) : value, // Convert based on expected type
                    onChange: (e: any) => {
                        if (onChangeCallback) {
                            const selectedOption = options.find(option => option.value.toString() === e.target.value);
                            onChangeCallback(selectedOption); // Notify parent of the change
                        }
                    },
                })}
                className="w-full border border-gray-300 text-sm rounded-md p-2 mt-1"
            >
                <option value="">Select...</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-700 text-xs">{error.message}</p>}
        </div>
    );
};

export default FormSelect;
