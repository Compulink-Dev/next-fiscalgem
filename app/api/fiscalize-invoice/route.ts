import { NextResponse } from "next/server";
import axios from "axios";
import { transformInvoice } from "@/actions/transformInvoice";

const FISCALIZATION_API_URL = "https://your-fiscalization-api.com/fiscalize";
const AUTH_TOKEN = "your-auth-token";

export async function POST(req: Request) {
    try {
        const { invoice } = await req.json();

        const payload = transformInvoice(invoice);

        const response = await axios.post(FISCALIZATION_API_URL, payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${AUTH_TOKEN}`,
            },
        });

        return NextResponse.json({ success: true, data: response.data });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message });
    }
}
