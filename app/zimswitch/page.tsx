"use client";

import { useEffect, useState } from "react";
import { prepareCheckout } from "@/lib/actions/checkout";
import { Button } from "@/components/ui/button";

const PaymentPage = () => {
    const [checkoutId, setCheckoutId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handlePrepareCheckout = async () => {
        try {
            const id = await prepareCheckout("92.00", "EUR", "DB"); // Example values
            console.log("Checkout ID:", id);

            if (!id) throw new Error("Failed to retrieve a valid checkout ID");

            setCheckoutId(id);
        } catch (err: any) {
            setError("Error during checkout preparation. Please try again.");
            console.error("Error during checkout preparation:", err.message || err);
        }
    };

    useEffect(() => {
        if (checkoutId) {
            const script = document.createElement("script");
            script.src = `https://eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
            script.async = true;
            script.crossOrigin = "anonymous";

            script.onload = () => console.log("Payment widget script loaded successfully.");
            script.onerror = (e) => {
                setError("Failed to load the payment widget. Please try again.");
                console.error("Error loading payment widget script:", e);
            };

            document.body.appendChild(script);

            return () => {
                console.log("Cleaning up payment widget script.");
                document.body.removeChild(script);
            };
        }
    }, [checkoutId]);

    return (
        <div className="p-8">
            <h1>Payment Page</h1>

            {error && (
                <div className="error-message">
                    <p style={{ color: "red" }}>{error}</p>
                    <Button onClick={handlePrepareCheckout}>Retry Payment</Button>
                </div>
            )}

            {!checkoutId ? (
                <Button onClick={handlePrepareCheckout}>Start Payment</Button>
            ) : (
                <form
                    action="/zimswitch/result"
                    className="paymentWidgets"
                    data-brands="VISA MASTER AMEX"
                ></form>
            )}
        </div>
    );
};

export default PaymentPage;
