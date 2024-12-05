// app/open-day/page.tsx
'use client';

import OpenDayButton from "../../_components/OpenDayButton";


const OpenDayPage = () => {
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="p-4 border border-green-600 rounded w-1/2">
                <h1 className="text-3xl font-bold mb-4 text-green-900">Open a New Fiscal Day</h1>
                <p className="mb-6 text-green-700">
                    Click the button below to open a new fiscal day. Ensure that the previous day is closed before proceeding.
                </p>
                <OpenDayButton />
            </div>
        </div>
    );
};

export default OpenDayPage;
