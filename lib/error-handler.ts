import { NextResponse } from 'next/server';

// Centralized error handler function
export function handleError(error: any) {
    // If the error is from a response, handle the ZIMRA API's ProblemDetails structure
    if (error.response) {
        const problemDetails = error.response.data;

        const errorResponse = {
            title: problemDetails.title || 'An error occurred',
            status: problemDetails.status || error.response.status,
            errorCode: problemDetails.errorCode || null,
            message: problemDetails.detail || 'Unknown error',
        };

        return NextResponse.json(errorResponse, { status: errorResponse.status });
    }

    // If it's not from a response, return a generic server error
    return NextResponse.json(
        { title: 'Internal Server Error', status: 500, message: error.message || 'Unexpected error' },
        { status: 500 }
    );
}
