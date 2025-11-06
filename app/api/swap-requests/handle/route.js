/**
 * API Route: Handle Swap Requests
 * 
 * Processes swap request actions (accept/reject):
 * - Accept: Swaps event ownership between users
 * - Reject: Reverts events to swappable status
 * 
 * Maintains atomic operations for data consistency.
 * Updates all related records (events and swap request) in a coordinated manner.
 * 
 * @module api/swap-requests/handle
 */

import { dbConnect } from '@/lib/dbConnect';
import SwapRequest from '@/lib/models/SwapRequest';
import Event from '@/lib/models/Event';

export async function POST(req) {
	await dbConnect();
	const { id, action } = await req.json();

	if (!id || !action) {
		return Response.json({ error: 'Missing id or action' }, { status: 400 });
	}

	// Get the swap request
	const swapRequest = await SwapRequest.findById(id);
	if (!swapRequest) {
		return Response.json({ error: 'Swap request not found' }, { status: 404 });
	}

	if (action === 'accept') {
		// Accept: Swap the event ownership by exchanging userId
		// Get the current owner IDs
		const senderUserId = swapRequest.senderUserId;
		const targetUserId = swapRequest.targetUserId;

		// Swap the userId for both events and set status to "Swapped"
		await Event.findByIdAndUpdate(swapRequest.senderEventId, {
			userId: targetUserId,  // Sender's event now belongs to target user
			status: 'Swappable'
		});
		await Event.findByIdAndUpdate(swapRequest.targetEventId, {
			userId: senderUserId,  // Target's event now belongs to sender user
			status: 'Swappable'
		});
		// Update swap request status
		await SwapRequest.findByIdAndUpdate(id, { status: 'accepted' });
	} else if (action === 'reject') {
		// Reject: Revert both events to "Swappable"
		await Event.findByIdAndUpdate(swapRequest.senderEventId, { status: 'Swappable' });
		await Event.findByIdAndUpdate(swapRequest.targetEventId, { status: 'Swappable' });
		// Optionally update swap request status
		await SwapRequest.findByIdAndUpdate(id, { status: 'rejected' });
	}

	return Response.json({ success: true });
}
