import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      passwordHash: hashedPassword,
      streak: 0,
      lastActiveDate: new Date(),
    });

    return NextResponse.json(
      { message: 'User registered successfully', userId: user._id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
