// app/components/OpenDayButton.tsx
'use client';

import { closeFiscalDay, openFiscalDay } from '@/actions/openDay';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { DoorClosed, DoorOpen } from 'lucide-react';  // Add DoorClose icon
import { useState } from 'react';

const OpenDayButton = () => {
    const [isDayOpened, setIsDayOpened] = useState(false);  // State to track if the day is opened

    const handleOpenCloseDay = async () => {
        const fiscalDayOpened = new Date().toISOString(); // Example: current time
        const fiscalDayNo = 1; // This can be dynamic or retrieved as needed

        let result;

        if (isDayOpened) {
            // Close Fiscal Day logic
            result = await closeFiscalDay(fiscalDayOpened, fiscalDayNo);
            if (result && !result.error) {
                toast('Day Closed Successfully');
                setIsDayOpened(false);  // Change button state to show "Open Fiscal Day"
            } else {
                toast.error('Failed to close fiscal day');
            }
        } else {
            // Open Fiscal Day logic
            result = await openFiscalDay(fiscalDayOpened);
            if (result && !result.error) {
                toast('Day Open Successful');
                setIsDayOpened(true);  // Change button state to show "Close Fiscal Day"
            } else {
                toast.error('Failed to open fiscal day');
            }
        }
    };


    return (
        <Button
            onClick={handleOpenCloseDay}
            className="bg-green-800 hover:bg-green-500 text-white px-4 py-2 rounded"
        >
            {isDayOpened ? (
                <>
                    <DoorClosed className="mr-2" /> Close Fiscal Day
                </>
            ) : (
                <>
                    <DoorOpen className="mr-2" /> Open Fiscal Day
                </>
            )}
        </Button>
    );
};

export default OpenDayButton;
