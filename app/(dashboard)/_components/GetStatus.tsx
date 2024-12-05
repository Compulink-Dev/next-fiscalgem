// GetConfigForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ClipboardList } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

const GetStatusButton = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const pathname = usePathname();

    // Helper function to determine if a route is active
    const isActive = (path: string) => pathname === path;

    const onSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/get-status', {
                method: 'GET'
            });

            if (!res.ok) {
                const error = await res.json();
                toast.error('Failed to get status');
                console.error('Failed to get status:', error);
                setLoading(false);
                return;
            }

            const responseData = await res.json();
            toast.success('Status retrieved successfully');
            sessionStorage.setItem('statusData', JSON.stringify(responseData));
            setLoading(false);

            // Save data to session storage for use on the success page
            sessionStorage.setItem('statusData', JSON.stringify(responseData));

            router.push('/dashboard/status-success');
        } catch (error) {
            console.error('An error occurred during retrieval:', error);
            toast.error('An error occurred during retrieval');
            setLoading(false);
        }
    };

    return (
        <div className="">
            <form
                onSubmit={(e) => {
                    e.preventDefault(); // Prevent form reload
                    onSubmit();
                }} className="">
                <Button
                    variant={isActive('/dashboard/status-success') ? undefined : 'outline'}
                    className={isActive('/dashboard/status-success') ? 'bg-green-700 text-white flex gap-8' : 'flex gap-8'}
                    type="submit"
                    disabled={loading}
                >
                    {loading ? <ClipboardList className="animate-spin" /> : <ClipboardList />}
                    <p className="">
                        {loading ? "Loading" : 'Status'}
                    </p>
                </Button>
            </form>
        </div>
    );
};

export default GetStatusButton;
