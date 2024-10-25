import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { getStatusSchema } from '@/lib/schemas/getStatusSchema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getStatus } from '@/lib/getStatus';
import { z } from 'zod'; // Import Zod if not already imported


type StatusFormData = z.infer<typeof getStatusSchema>;

const StatusForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<StatusFormData>({
        resolver: zodResolver(getStatusSchema),
    });

    const [statusResult, setStatusResult] = useState<string | null>(null);

    const onSubmit = async (data: StatusFormData) => {
        try {
            const response = await getStatus(data.fiscalCode);
            setStatusResult(JSON.stringify(response));
        } catch (error) {
            console.log('Status submit error', error);

            setStatusResult("Error fetching status");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Fiscal Code</label>
                    <Input {...register("fiscalCode")} />
                    {errors.fiscalCode && <span>{'An error occurred'}</span>}
                </div>
                <Button type="submit">Check Status</Button>
            </form>

            {statusResult && (
                <div>
                    <h3>Status Result</h3>
                    <pre>{statusResult}</pre>
                </div>
            )}
        </div>
    );
};

export default StatusForm;
