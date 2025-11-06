/**
 * API Route: User Signup
 * 
 * Handles new user registration:
 * - Validates email uniqueness
 * - Securely hashes passwords
 * - Creates user account
 * - Issues authentication token
 * - Sets secure HTTP-only cookies
 * 
 * @module api/auth/signup
 */

import { dbConnect } from '@/lib/dbConnect';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await dbConnect();
  const { name, email, password } = await req.json();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  // Create JWT
  const token = jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Build full URL for redirect (homepage)
  const redirectUrl = new URL('/', req.url);

  const response = NextResponse.redirect(redirectUrl);

  // Set token cookie
  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return response;
}
