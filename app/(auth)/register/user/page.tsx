'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Title from '@/app/_components/Title';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { RegistrationContext } from '../RegisterProvider';

type UserData = { firstName: string; lastName: string; email: string; password: string };

export default function UserStep() {
    const context = useContext(RegistrationContext);

    // Ensure the context is defined
    if (!context) {
        throw new Error('UserStep must be used within a RegistrationContext.Provider');
    }

    const { formData, setFormData } = context;
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<UserData>();


    const onSubmit = async (data: UserData) => {
        setIsLoading(true); // Set loading to true
        const finalData = { ...formData, ...data };
        console.log('Final Data:', finalData); // Add this for debugging
        setFormData(finalData);

        // Submit data to API
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });

            if (response.ok) {
                toast.success('Registration successful!');
                router.push('/register/success');
            } else {
                toast.error('Registration failed. Please try again.');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='p-8'>
            <Title />
            <h1 className="text-lg font-semibold mb-4">Register user</h1>

            <div className="mb-4">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                    id="firstName"
                    {...register('firstName', { required: 'First name is required' })}
                    className="w-full mt-1 p-2 border rounded"
                    placeholder="Enter your first name"
                />
                {errors.firstName && <p className="texts-xs text-red-600">{errors.firstName.message}</p>}
            </div>

            <div className="mb-4">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                    id="lastName"
                    {...register('lastName', { required: 'Last name is required' })}
                    className="w-full mt-1 p-2 border rounded"
                    placeholder="Enter your last name"
                />
                {errors.lastName && <p className="texts-xs text-red-600">{errors.lastName.message}</p>}
            </div>

            <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    {...register('email', { required: 'Email is required' })}
                    className="w-full mt-1 p-2 border rounded"
                    placeholder="Enter your email"
                />
                {errors.email && <p className="texts-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div className="mb-4">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type='password'
                    {...register('password', { required: 'Password is required' })}
                    className="w-full mt-1 p-2 border rounded"
                    placeholder="Enter your password"
                />
                {errors.password && <p className="texts-xs text-red-600">{errors.password.message}</p>}
            </div>

            <Button
                disabled={isLoading} // Disable button when loading
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-white p-2 rounded"
            >
                {isLoading ? 'Submitting...' : 'Next'}
            </Button>
            <Button
                variant={'outline'}
                onClick={() => router.back()}
                className="w-full mt-2"
                disabled={isLoading} // Disable button when loading
            >
                Previous
            </Button>
        </form>
    );
}
