'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { RegistrationContext } from '../RegisterProvider';



type CompanyData = { companyName: string; companyEmail: string; device: string };

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
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-lg font-semibold mb-4">Register Your Company</h1>

            <div className="mb-4">
                <label htmlFor="device">Device ID</label>
                <input
                    id="device"
                    {...register('device', { required: 'Device ID is required' })}
                    className="w-full mt-1 p-2 border rounded"
                    placeholder="Enter your device id"
                />
                {errors.device && <p className="text-red-600">{errors.device.message}</p>}
            </div>


            <div className="mb-4">
                <label htmlFor="companyName">Company Name</label>
                <input
                    id="companyName"
                    {...register('companyName', { required: 'Company name is required' })}
                    className="w-full mt-1 p-2 border rounded"
                    placeholder="Enter your company name"
                />
                {errors.companyName && <p className="text-red-600">{errors.companyName.message}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="companyEmail">Company Email</label>
                <input
                    id="companyEmail"
                    {...register('companyEmail', { required: 'Company email is required' })}
                    className="w-full mt-1 p-2 border rounded"
                    placeholder="Enter your company email"
                />
                {errors.companyEmail && <p className="text-red-600">{errors.companyEmail.message}</p>}
            </div>

            <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-white p-2 rounded"
            >
                Next
            </button>
        </form>
    );
}
