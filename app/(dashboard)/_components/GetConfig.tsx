'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Cog } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const GetConfigButton = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const pathname = usePathname();

    // Helper function to determine if a route is active
    const isActive = (path: string) => pathname === path;

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

            // Save data to session storage for use on the success page
            sessionStorage.setItem('configData', JSON.stringify(responseData));

            console.log("Navigating to /config-success...");
            router.push('/dashboard/config-success');
            console.log("Navigation triggered to /config-success");
        } catch (error) {
            console.error('An error occurred during retrieval:', error);
            toast.error('An error occurred during retrieval');
            setLoading(false);
        }
    };


    return (
        <div className="">
            <div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault(); // Prevent form reload
                        onSubmit();
                    }} className="">
                    <Button
                        variant={isActive('/dashboard/config-success') ? undefined : 'outline'}
                        className={isActive('/dashboard/config-success') ? 'bg-green-700 text-white flex gap-8' : 'flex gap-8'}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <Cog className="animate-spin" /> : <Cog />}
                        <p className="">
                            {loading ? "Loading" : 'Config'}
                        </p>
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default GetConfigButton;
