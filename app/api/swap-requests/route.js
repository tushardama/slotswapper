/**
 * API Route: Swap Requests
 * 
 * Manages swap request operations:
 * - GET: Retrieves pending swap requests for the current user
 * - POST: Creates new swap requests and updates event statuses
 * 
 * Enriches request data with user and event details for frontend display.
 * Handles atomic updates to maintain data consistency.
 * 
 * @module api/swap-requests
 */

import { dbConnect } from '@/lib/dbConnect'
import SwapRequest from '@/lib/models/SwapRequest'
import User from '@/lib/models/User'
import Event from '@/lib/models/Event'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function GET(req) {
	await dbConnect();
	const cookieStore = await cookies();
	const tokenCookie = cookieStore.get?.('token');
	const token = tokenCookie?.value;
	const user = verifyToken(token);

	// Find all swap requests where user is the target
  const swapRequests = await SwapRequest.find({ targetUserId: user.id, status: 'pending' });
	// Enrich with event & user info for frontend
	const detailedRequests = await Promise.all(swapRequests.map(async (req) => {
		const sender = await User.findById(req.senderUserId);
		const targetEvent = await Event.findById(req.targetEventId);
		const senderEvent = await Event.findById(req.senderEventId);

		return {
			...req.toObject(),
			senderUserName: sender?.name ?? '',
			senderUserEmail: sender?.email ?? '',
			senderEventTitle: senderEvent?.title ?? '',
        senderEventDate: senderEvent?.date ?? '',
        senderEventStartTime: senderEvent?.startTime ?? '',
        senderEventEndTime: senderEvent?.endTime ?? '',
			targetEventTitle: targetEvent?.title ?? '',
        targetEventDate: targetEvent?.date ?? '',
        targetEventStartTime: targetEvent?.startTime ?? '',
        targetEventEndTime: targetEvent?.endTime ?? '',
		}
	}))
	return Response.json(detailedRequests);
}

export async function POST(req) {
	await dbConnect();
	const data = await req.json();

	// 1. Create the swap request document
	await SwapRequest.create(data);

	// 2. Set both involved events to "Swap Pending"
	await Event.findByIdAndUpdate(data.senderEventId, { status: "Swap Pending" });
	await Event.findByIdAndUpdate(data.targetEventId, { status: "Swap Pending" });

	return Response.json({ success: true });
}
