// app/components/OpenDayButton.tsx
'use client';

import { openFiscalDay } from '@/actions/openDay';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const OpenDayButton = () => {
    const router = useRouter();

    const handleOpenDay = async () => {
        const fiscalDayOpened = new Date().toISOString(); // Example: current time

        // Call openFiscalDay and redirect to success page
        const result = await openFiscalDay(fiscalDayOpened); // Example fiscalDayNo

        if (result && !result.error) {
            router.push('/success');
        } else {
            alert('Failed to open fiscal day');
        }
    };

    return (
        <Button onClick={handleOpenDay} className="bg-green-800 hover:bg-green-500 text-white px-4 py-2 rounded">
            Open Fiscal Day
        </Button>
    );
};

export default OpenDayButton;
