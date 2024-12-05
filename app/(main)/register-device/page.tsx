'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Gem } from 'lucide-react';
import { useRouter } from 'next/navigation'; // For navigation
import toast from 'react-hot-toast';
import { NextResponse } from 'next/server';

// Define the schema using Zod
const deviceSchema = z.object({
    deviceID: z.string().min(1, 'Device ID is required'),
    activationKey: z.string().min(1, 'Activation Key is required'),
    certificateRequest: z.string().min(1, 'Certificate Request (CSR) is required'),
});

type DeviceFormData = z.infer<typeof deviceSchema>;

const RegisterDeviceForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false); // Loading state
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DeviceFormData>({
        resolver: zodResolver(deviceSchema),
    });

    const formatCSR = (csr: string) => {
        // Ensure it has the correct PEM structure with line breaks every 64 characters
        const cleanCSR = csr.replace(/\r?\n|\r/g, '').trim(); // Remove all existing line breaks and spaces
        const lines = cleanCSR.match(/.{1,64}/g)?.join('\n'); // Re-add line breaks every 64 characters
        return `-----BEGIN CERTIFICATE REQUEST-----\n${lines}\n-----END CERTIFICATE REQUEST-----`;
    };

    const onSubmit = async (data: DeviceFormData) => {
        setLoading(true); // Set loading state to true
        const formattedCSR = formatCSR(data.certificateRequest);
        try {
            const res = await fetch('/api/register-device', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    certificateRequest: formattedCSR,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                toast.error('Failed to register device');
                console.error('Failed to register device:', error);
                reset()
                setLoading(false); // Set loading to false if registration failed
                return;
            }

            const responseData = await res.json();
            toast.success('Registration success');
            setLoading(false); // Reset loading state

            // Navigate to another page after successful registration
            router.push('/success-page');
            return NextResponse.json(responseData)
        } catch (error) {
            console.error('An error occurred during submission:', error);
            toast.error('An error occurred during registration');
            setLoading(false); // Reset loading state if an error occurs
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
            <div className="border border-green-900 p-4 rounded md:w-2/5">
                <div className="flex gap-1 items-center pb-4 text-green-900">
                    <p className="text-2xl font-bold">Fiscal</p>
                    <Gem className="text-green-900" />
                </div>
                <p className="pb-4">Register device</p>
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
                    <div>
                        <Label>Certificate Request (CSR) :</Label>
                        <textarea
                            {...register('certificateRequest')}
                            aria-invalid={!!errors.certificateRequest}
                            className="w-full p-2 text-sm border rounded"
                            onBlur={(e) => {
                                e.target.value = formatCSR(e.target.value); // Clean up formatting on blur to ensure PEM structure
                            }}
                            rows={8}
                        />
                        {errors.certificateRequest && (
                            <span className="text-red-500 text-xs">{errors.certificateRequest.message}</span>
                        )}
                    </div>
                    <Button
                        className="w-full bg-green-900 hover:bg-green-700"
                        type="submit"
                        disabled={loading} // Disable button when loading
                    >
                        {loading ? 'Registering...' : 'Register Device'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default RegisterDeviceForm;
