
import { connectDB } from "@/lib/connectDB"
import Registration from "@/models/Registration"
import { NextRequest, NextResponse } from "next/server"


export async function POST(req: NextRequest) {
    const { firstName,
        lastName,
        jobTitle,
        company,
        phoneNumber,
        country,
        state,
        email,
        industry,
        position,
        companySize } = await req.json()
    await connectDB()
    await Registration.create({
        firstName,
        lastName,
        jobTitle,
        company,
        phoneNumber,
        country,
        state,
        email,
        industry,
        position,
        companySize
    })
    return NextResponse.json({ message: "User Registered" }, { status: 201 })
}


export async function GET() {
    await connectDB()
    const visitors = await Registration.find()
    return NextResponse.json({ visitors })
}

export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id")
    await connectDB()
    await Registration.findByIdAndDelete(id)
    return NextResponse.json({ message: "Visitor Deleted" }, { status: 201 })
}


