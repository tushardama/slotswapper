/**
 * API Route: Swappable Slots
 * 
 * Handles retrieval of available swappable events from other users.
 * Enriches event data with creator information for display.
 * Excludes current user's events from results.
 * 
 * @module api/swappable-slots
 */

import { dbConnect } from '@/lib/dbConnect';
import Event from '@/lib/models/Event';
import User from '@/lib/models/User';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  await dbConnect();
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get?.('token');
  const token = tokenCookie?.value;
  const user = verifyToken(token);

  // Fetch swappable events NOT owned by current user
  const events = await Event.find({
    status: 'Swappable',
    userId: { $ne: user.id },
  });

  // For each event, fetch its creator's name & email
  const detailedEvents = await Promise.all(events.map(async (e) => {
    const eventUser = await User.findById(e.userId);
    return {
      ...e.toObject(),
      userName: eventUser?.name || 'Unknown',
      userEmail: eventUser?.email || 'Unknown',
    }
  }));

  return Response.json(detailedEvents);
}
