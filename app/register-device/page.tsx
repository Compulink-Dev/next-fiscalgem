// app/register-device/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Define the schema using Zod
const deviceSchema = z.object({
    deviceID: z.string().min(1, 'Device ID is required'),
    activationKey: z.string().min(1, 'Activation Key is required'),
});

type DeviceFormData = z.infer<typeof deviceSchema>;

const RegisterDeviceForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<DeviceFormData>({
        resolver: zodResolver(deviceSchema),
    });

    const onSubmit = async (data: DeviceFormData) => {
        const res = await fetch('/api/register-device', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const responseData = await res.json();
        console.log(responseData);
        // Handle registration success or error here
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
            <div className=" border p-4 rounded md:w-2/6">
                <div className="">
                    <p className="pb-8">Register device</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
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
                    <div>
                        <Label>Activation Key :</Label>
                        <Input
                            {...register('activationKey')}
                            aria-invalid={!!errors.activationKey}
                        />
                        {errors.activationKey && (
                            <span className="text-red-500 text-xs">{errors.activationKey.message}</span>
                        )}
                    </div>
                    <Button className='w-full' type="submit">Register Device</Button>
                </form>
            </div>
        </div>
    );
};

export default RegisterDeviceForm;
