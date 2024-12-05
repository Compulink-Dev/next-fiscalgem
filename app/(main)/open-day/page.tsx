'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { NextResponse } from 'next/server';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define Zod schemas for each step
const stepOneSchema = z.object({
    deviceID: z.string().min(1, 'Device ID is required'),
});

const stepTwoSchema = z.object({
    deviceID: z.string().min(1, 'Device ID is required'),
});


// Create type definitions from schemas
type StepOneData = z.infer<typeof stepOneSchema>;
type StepTwoData = z.infer<typeof stepTwoSchema>;


const OnboardingForm = () => {
    // Manage current step
    const [currentStep, setCurrentStep] = useState(1);
    const router = useRouter();
    const [loading, setLoading] = useState(false); // Loading state

    // Step 1 form
    const {
        register: registerStepOne,
        handleSubmit: handleSubmitStepOne,
        formState: { errors: errorsStepOne },
        reset,
    } = useForm<StepOneData>({
        resolver: zodResolver(stepOneSchema),
    });

    // Step 2 form
    const {
        register: registerStepTwo,
        handleSubmit: handleSubmitStepTwo,
        formState: { errors: errorsStepTwo },
    } = useForm<StepTwoData>({
        resolver: zodResolver(stepTwoSchema),
    });

    // Form submit handlers
    const onSubmitStepOne = async (data: StepOneData) => {
        setCurrentStep(2)



        setLoading(true); // Set loading state to true
        // const formattedCSR = formatCSR(data.certificateRequest);
        try {
            const res = await fetch('/api/get-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deviceID: data.deviceID }),
            });

            if (!res.ok) {
                const error = await res.json();
                toast.error('Failed to get status');
                console.error('Failed to status:', error);
                reset()
                setLoading(false); // Set loading to false if registration failed
                return;
            }

            const responseData = await res.json();
            toast.success('Get status success');
            setLoading(false); // Reset loading state


            // Navigate to another page after successful registration
            router.push('/config-success');
            return NextResponse.json(responseData)
        } catch (error) {
            console.error('An error occurred during retrieval:', error);
            toast.error('An error occurred during retrieval');
            setLoading(false); // Reset loading state if an error occurs
        }
    };

    const onSubmitStepTwo = async (data: StepTwoData) => {
        toast.success('Onboarding complete')

        router.push('/')
        setLoading(true); // Set loading state to true
        // const formattedCSR = formatCSR(data.certificateRequest);
        try {
            const res = await fetch('/api/get-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deviceID: data.deviceID }),
            });

            if (!res.ok) {
                const error = await res.json();
                toast.error('Failed to get config');
                console.error('Failed to config:', error);
                reset()
                setLoading(false); // Set loading to false if registration failed
                return;
            }

            const responseData = await res.json();
            toast.success('Get config success');
            setLoading(false); // Reset loading state

            // Navigate to another page after successful registration
            router.push('/config-success');
            return NextResponse.json(responseData)
        } catch (error) {
            console.error('An error occurred during retrieval:', error);
            toast.error('An error occurred during retrieval');
            setLoading(false); // Reset loading state if an error occurs
        }
    };


    return (
        <div className="">
            {currentStep === 1 && (
                <div className="flex flex-col items-center justify-center h-screen w-screen text-green-700">
                    <div className="border border-green-900 p-4 rounded md:w-2/5">
                        <div className="flex gap-1 items-center pb-4 text-green-900">
                            <p className="text-2xl font-bold">Fiscal</p>
                            <Gem className="text-green-900" />
                        </div>
                        <p className="pb-4 text-lg font-bold">Get Device Status</p>
                        <form onSubmit={handleSubmitStepOne(onSubmitStepOne)} className="space-y-4">
                            <div>
                                <Label className='font-bold '>Device ID :</Label>
                                <Input
                                    {...registerStepOne('deviceID')}
                                    aria-invalid={!!errorsStepOne.deviceID}
                                />
                                {errorsStepOne.deviceID && (
                                    <span className="text-red-500 text-xs">{errorsStepOne.deviceID.message}</span>
                                )}
                            </div>
                            <Button
                                className="w-full bg-green-900 hover:bg-green-700"
                                type="submit"
                                disabled={loading} // Disable button when loading
                            >
                                {loading ? 'Retrieving Status...' : 'Get Status'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {currentStep === 2 && (
                <div className="flex flex-col items-center justify-center h-screen w-screen text-green-700">
                    <div className="border border-green-900 p-4 rounded md:w-2/5">
                        <div className="flex gap-1 items-center pb-4 text-green-900">
                            <p className="text-2xl font-bold">Fiscal</p>
                            <Gem className="text-green-900" />
                        </div>
                        <p className="pb-4 text-lg font-bold">Get Device Config</p>
                        <form onSubmit={handleSubmitStepTwo(onSubmitStepTwo)} className="space-y-4">
                            <div>
                                <Label className='font-bold'>Device ID :</Label>
                                <Input
                                    {...registerStepTwo('deviceID')}
                                    aria-invalid={!!errorsStepTwo.deviceID}
                                />
                                {errorsStepTwo.deviceID && (
                                    <span className="text-red-500 text-xs">{errorsStepTwo.deviceID.message}</span>
                                )}
                            </div>
                            <Button
                                className="w-full bg-green-900 hover:bg-green-700"
                                type="submit"
                                disabled={loading} // Disable button when loading
                            >
                                {loading ? 'Retrieving Config...' : 'Get Config'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OnboardingForm;
