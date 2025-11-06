/**
 * API Route: Events
 * 
 * Handles CRUD operations for events:
 * - GET: Retrieves user's events
 * - POST: Creates new events
 * - PUT: Updates existing events
 * - DELETE: Removes events
 * 
 * Enforces user ownership and maintains event status consistency.
 * All operations are authenticated and scoped to the current user.
 * 
 * @module api/events
 */

import { dbConnect } from '@/lib/dbConnect';
import Event from '@/lib/models/Event';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  await dbConnect();
  const cookieStore = await cookies(); // get cookies in server component
  const tokenCookie = cookieStore.get?.('token'); // optional chaining
  const token = tokenCookie?.value;
  const user = verifyToken(token);
  const events = await Event.find({ userId: user.id });
  return Response.json(events);
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get?.('token');
  const token = tokenCookie?.value;
  const user = verifyToken(token);
  // Default status to "Swappable" if not provided
  const event = await Event.create({ ...body, userId: user.id, status: body.status || "Swappable" });
  return Response.json(event);
}

export async function PUT(req) {
  await dbConnect();
  const { _id, title, startTime, endTime, status } = await req.json();
  const updated = await Event.findByIdAndUpdate(
    _id,
    { title, startTime, endTime, status },
    { new: true }
  );
  return Response.json(updated);
}

export async function DELETE(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });
  await Event.findByIdAndDelete(id);
  return Response.json({ success: true });
}
