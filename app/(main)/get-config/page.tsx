// GetConfigForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Gem } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const deviceSchema = z.object({
    deviceID: z.string().min(1, 'Device ID is required'),
});

type DeviceFormData = z.infer<typeof deviceSchema>;

const GetConfigForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DeviceFormData>({
        resolver: zodResolver(deviceSchema),
    });

    const onSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/get-config', {
                method: 'GET'
            });

            if (!res.ok) {
                const error = await res.json();
                toast.error('Failed to get config');
                console.error('Failed to get config:', error);
                reset();
                setLoading(false);
                return;
            }

            const responseData = await res.json();
            toast.success('Config retrieved successfully');
            sessionStorage.setItem('configData', JSON.stringify(responseData));
            setLoading(false);

            router.push('/config-success');
        } catch (error) {
            console.error('An error occurred during retrieval:', error);
            toast.error('An error occurred during retrieval');
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
            <div className="border border-green-900 p-4 rounded md:w-2/5">
                <div className="flex gap-1 items-center pb-4 text-green-900">
                    <p className="text-2xl font-bold">Fiscal</p>
                    <Gem className="text-green-900" />
                </div>
                <p className="pb-4">Get Device Config</p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label>Device ID :</Label>
                        <Input
                            {...register('deviceID')}
                            aria-invalid={!!errors.deviceID}
                        />
                        {errors.deviceID && (
                            <span className="text-red-500 text-xs">{errors.deviceID.message}</span>
                        )}
                    </div>
                    <Button
                        className="w-full bg-green-900 hover:bg-green-700"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Retrieving Config...' : 'Get Config'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default GetConfigForm;
