//@ts-nocheck
// app/register/success/page.tsx
'use client';
import Title from '@/app/_components/Title';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

export default function SuccessStep() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(4);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        const redirectTimer = setTimeout(() => {
            router.push('/login');
        }, 4000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimer);
        };
    }, [router]);

    return (
        <div className="text-center p-8">
            <Confetti count={100} size={20} gravity={0.1} />
            <div className="flex items-center justify-center w-full">
                <Title />
            </div>
            <h1 className="text-lg font-semibold mb-4">Success!</h1>
            <p>Your registration is complete.</p>
            <p className='text-slate-500 text-sm'>Redirecting to login page in {countdown} seconds...</p>
            <button
                onClick={() => router.push('/dashboard')}
                className="mt-4 bg-green-600 hover:bg-green-500 text-white p-2 rounded"
            >
                Go to Dashboard
            </button>
        </div>
    );
}