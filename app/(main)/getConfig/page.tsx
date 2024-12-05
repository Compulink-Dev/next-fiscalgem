'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Gem } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const GetConfigForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        setLoading(true);
        console.log("Submitting request to /api/get-config...");
        try {
            const res = await fetch('/api/get-config', {
                method: 'GET',
            });

            console.log("API response status:", res.status);
            if (!res.ok) {
                const error = await res.json();
                toast.error('Failed to get config');
                console.error('Failed to get config:', error);
                setLoading(false);
                return;
            }

            const responseData = await res.json();
            console.log("Config retrieved:", responseData);
            toast.success('Config retrieved successfully');
            sessionStorage.setItem('configData', JSON.stringify(responseData));
            setLoading(false);

            console.log("Navigating to /config-success...");
            router.push('/config-success');
            console.log("Navigation triggered to /config-success");
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
                <form
                    onSubmit={(e) => {
                        e.preventDefault(); // Prevent form reload
                        onSubmit();
                    }} className="space-y-4">
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
