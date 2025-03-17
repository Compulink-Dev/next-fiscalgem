"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentResultPage = () => {
    const searchParams = useSearchParams();
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPaymentStatus = async () => {
            const resourcePath = searchParams.get("resourcePath");
            console.log("Resource path is: ", resourcePath);

            if (!resourcePath) {
                setError("Invalid payment session. Please retry.");
                return;
            }

            try {
                const response = await fetch(`/api/payment-status?resourcePath=${encodeURIComponent(resourcePath)}`);
                const data = await response.json();

                if (response.ok) {
                    setPaymentStatus(data);
                } else {
                    setError(data.error || "Unknown error occurred.");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch payment status. Please try again.");
            }
        };

        fetchPaymentStatus();
    }, [searchParams]);

    if (error) {
        return (
            <div>
                <h1>Error</h1>
                <p style={{ color: "red" }}>{error}</p>
            </div>
        );
    }

    if (!paymentStatus) {
        return <div>Loading payment status...</div>;
    }

    return (
        <div>
            <h1>Payment Result</h1>
            <pre>{JSON.stringify(paymentStatus, null, 2)}</pre>
        </div>
    );
};

export default PaymentResultPage;
