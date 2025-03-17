'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Title from '@/app/_components/Title';
import { RegistrationContext } from './RegisterProvider';



type CompanyData = { companyName: string; companyEmail: string; device: string; tinNumber: string; phoneNumber: string; street: string; address: string; city: string };

export default function CompanyStep() {
    const context = useContext(RegistrationContext);

    if (!context) {
        throw new Error('CompanyStep must be used within a RegistrationContext.Provider');
    }

    const { formData, setFormData } = context;
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<CompanyData>();

    const onSubmit = (data: CompanyData) => {
        setFormData({ ...formData, ...data });
        router.push('/register/user');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='p-8'>
            <Title />
            <h1 className="text-lg font-semibold mb-4">Register Your Company</h1>

            <div className="mb-4">
                <Label htmlFor="device">Device ID</Label>
                <Input
                    id="device"
                    {...register('device', { required: 'Device ID is required' })}
                    className="w-full mt-1 p-2 border rounded"
                    placeholder="Enter your device id"
                />
                {errors.device && <p className="text-xs text-red-600">{errors.device.message}</p>}
            </div>


            <div className="mb-4">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                    id="companyName"
                    {...register('companyName', { required: 'Company name is required' })}
                    className="w-full mt-1 p-2 border rounded"
                    placeholder="Enter your company name"
                />
                {errors.companyName && <p className="text-xs text-red-600">{errors.companyName.message}</p>}
            </div>

            <div className="mb-4">
                <Label htmlFor="companyEmail">Company Email</Label>
                <Input
                    id="companyEmail"
                    {...register('companyEmail', { required: 'Company email is required' })}
                    className="w-full mt-1 p-2 border rounded"
                    placeholder="Enter your company email"
                />
                {errors.companyEmail && <p className="text-xs text-red-600">{errors.companyEmail.message}</p>}
            </div>
            <div className="mb-4">
                <Label htmlFor="tinNumber">TIN Number</Label>
                <Input
                    id="tinNumber"
                    {...register('tinNumber', { required: 'TIN number is required' })}
                    className="w-full mt-1 p-2 border rounded"
                    placeholder="Enter your TIN Number"
                />
                {errors.tinNumber && <p className="text-xs text-red-600">{errors.tinNumber.message}</p>}
            </div>
            <div className="mb-4">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                    id="phoneNumber"
                    {...register('phoneNumber', { required: 'Phone Number is required' })}
                    className="w-full mt-1 p-2 border rounded"
                    placeholder="Enter your phone number"
                />
                {errors.phoneNumber && <p className="text-xs text-red-600">{errors.phoneNumber.message}</p>}
            </div>


            <div className="mb-4">
                <Label htmlFor="city">City</Label>
                <Input
                    id="city"
                    {...register('city', { required: 'City is required' })}
                    className="w-full mt-1 p-2 border rounded"
                    placeholder="Enter your city"
                />
                {errors.city && <p className="text-xs text-red-600">{errors.city.message}</p>}
            </div>

            <div className="mb-4">
                <Label htmlFor="street">Street</Label>
                <Input
                    id="street"
                    {...register('street', { required: 'Street is required' })}
                    className="w-full mt-1 p-2 border rounded"
                    placeholder="Enter your street"
                />
                {errors.street && <p className="text-xs text-red-600">{errors.street.message}</p>}
            </div>

            <div className="mb-4">
                <Label htmlFor="address">Address</Label>
                <Input
                    id="address"
                    {...register('address', { required: 'Address is required' })}
                    className="w-full mt-1 p-2 border rounded"
                    placeholder="Enter your address"
                />
                {errors.address && <p className="text-xs text-red-600">{errors.address.message}</p>}
            </div>


            <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-white p-2 rounded"
            >
                Next
            </Button>
        </form>
    );
}
