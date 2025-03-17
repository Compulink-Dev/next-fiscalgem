import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const resourcePath = req.nextUrl.searchParams.get("resourcePath");

    if (!resourcePath) {
        return NextResponse.json(
            { error: "Missing 'resourcePath' parameter" },
            { status: 400 }
        );
    }

    try {
        const baseUrl = "https://eu-test.oppwa.com";
        const url = `${baseUrl}${resourcePath}`;
        const entityId = process.env.ZIMSWITCH_ENTITY_ID;
        const authToken = process.env.ZIMSWITCH_BEARER_TOKEN;

        // Add a log for debugging
        console.log("Making request to:", url);

        const response = await fetch(`${url}?entityId=${entityId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("API Error:", data);
            const errorMessage =
                data?.result?.description ||
                "Failed to fetch payment status. Please try again.";
            return NextResponse.json(
                { error: errorMessage, details: data },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred. Please try again." },
            { status: 500 }
        );
    }
}
