/**
 * API Route: Individual Event Operations
 * 
 * Handles operations for specific events by ID:
 * - GET: Retrieves details of a single event
 * 
 * Validates event existence and returns appropriate status codes.
 * 
 * @module api/events/[id]
 */

import { dbConnect } from '@/lib/dbConnect'
import Event from '@/lib/models/Event'

export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params;
  const event = await Event.findById(id);
  if (!event) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(event);
}
