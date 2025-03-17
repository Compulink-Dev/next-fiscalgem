import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Company from '@/models/Company'; // Adjust path based on your folder structure
import User from '@/models/User'; // Adjust path based on your folder structure

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { companyName, companyEmail, device, tinNumber, phoneNumber, street, address, city, firstName, lastName, email, password } = data;

        if (!companyName || !companyEmail || !device || !tinNumber || !phoneNumber || !street || !address || !city || !firstName || !lastName || !email || !password) {
            return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Start a MongoDB session for a transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        // Create the company
        const company = new Company({
            name: companyName,
            email: companyEmail,
            device,
            tinNumber,
            phoneNumber,
            street,
            city,
            address: 'Default Address', // Add address field if needed

        });
        await company.save({ session });

        // Create the user and associate it with the company
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            company: company._id,
            role: 'admin',
        });
        await user.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({ success: true, message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ success: false, message: 'Registration failed', error }, { status: 500 });
    }
}
