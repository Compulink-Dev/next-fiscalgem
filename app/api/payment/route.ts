import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { amount, currency, paymentType } = await request.json();

    try {
        const response = await fetch(`${process.env.ZIMSWITCH_API_URL}/checkouts`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.ZIMSWITCH_BEARER_TOKEN}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                entityId: process.env.ZIMSWITCH_ENTITY_ID || "",
                amount,
                currency,
                paymentType,
            }).toString(),
        });

        const result = await response.json();

        if (response.ok) {
            return NextResponse.json({ id: result.id });
        } else {
            return NextResponse.json({ error: result }, { status: 400 });
        }
    } catch (error) {
        console.error("Error creating checkout:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
