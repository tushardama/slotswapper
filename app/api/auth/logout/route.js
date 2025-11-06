/**
 * API Route: User Logout
 * 
 * Handles user session termination:
 * - Invalidates authentication token
 * - Clears secure cookies
 * - Redirects to login page
 * 
 * Ensures secure session cleanup and proper user flow.
 * 
 * @module api/auth/logout
 */

import { NextResponse } from 'next/server';

export async function POST(req) { // <-- req must be a parameter
  // Build full URL for redirect
  const redirectUrl = new URL('/login', req.url);

  const response = NextResponse.redirect(redirectUrl);

  // Expire the token cookie
  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // expire immediately
    path: '/',
  });

  return response;
}
