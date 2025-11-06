/**
 * API route handler for user authentication (login)
 * Validates user credentials and issues a JWT token for authenticated sessions
 * 
 * @module api/auth/login
 */

import { dbConnect } from '@/lib/dbConnect';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req) {
	await dbConnect();
	const { email, password } = await req.json();

	const user = await User.findOne({ email });
	if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

	const token = jwt.sign(
		{ id: user._id, name: user.name, email: user.email },
		process.env.JWT_SECRET,
		{ expiresIn: '7d' }
	);
	// Build full URL for redirect
	const redirectUrl = new URL('/', req.url); // '/' relative to current request

	const response = NextResponse.redirect(redirectUrl);
	response.cookies.set({
		name: 'token',
		value: token,
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		maxAge: 7 * 24 * 60 * 60,
		path: '/',
	});

	return response;
}
