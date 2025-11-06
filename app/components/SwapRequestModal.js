/**
 * SwapRequestModal Component
 * 
 * Displays and manages incoming swap requests.
 * Features:
 * - List of pending swap requests with detailed event information
 * - Accept/reject functionality for each request
 * - Real-time updates through refresh context
 * - Responsive design with loading states
 * 
 * @component
 */

import React from 'react';
import { FiClock, FiCalendar, FiUser, FiMail, FiArrowRight } from 'react-icons/fi';
import { useRefresh } from '@/app/RefreshContext';

/**
 * Formats 24-hour time to 12-hour format with AM/PM indicator
 * @param {string} time - Time in 24-hour format (HH:MM)
 * @returns {string} Formatted time in 12-hour format with AM/PM
 */
function formatTime24to12(time) {
	if (!time) return '';
	const [hour, minute] = time.split(':');
	let h = parseInt(hour, 10) % 24;
	const ampm = h >= 12 ? 'PM' : 'AM';
	h = h % 12 || 12;
	return `${h}:${minute} ${ampm}`;
}

// Helper: Format date to readable format
function formatDate(dateStr) {
	if (!dateStr) return '';
	const date = new Date(dateStr);
	return date.toLocaleDateString('en-IN', {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}

export default function SwapRequestModal({ open, onClose, requests, loading, refreshRequests }) {
	if (!open) return null;
	const { setRefresh } = useRefresh();

	const handleSwapAction = async (id, accepted) => {
		await fetch('/api/swap-requests/handle', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id, action: accepted ? "accept" : "reject" }),
		});
		await refreshRequests();
		if (accepted) setRefresh(true);
	};

	return (
		<div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
				{/* Header */}
				<div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 px-6 py-4 flex justify-between items-center">
					<div>
						<h2 className="text-2xl font-bold text-white">Swap Requests</h2>
						<p className="text-blue-100 text-sm mt-1">
							{requests.length} {requests.length === 1 ? 'request' : 'requests'} pending
						</p>
					</div>
					<button
						className="text-white hover:bg-white/20 rounded-full p-2 transition"
						onClick={onClose}
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto p-6">
					{loading ? (
						<div className="flex items-center justify-center py-12">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
							<span className="ml-3 text-gray-600">Loading requests...</span>
						</div>
					) : requests.length === 0 ? (
						<div className="text-center py-12">
							<svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
							</svg>
							<h3 className="mt-4 text-lg font-medium text-gray-900">No pending requests</h3>
							<p className="mt-2 text-sm text-gray-500">You're all caught up! New swap requests will appear here.</p>
						</div>
					) : (
						<div className="space-y-4">
							{requests.map(req => (
								<div
									key={req._id}
									className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200"
								>
									{/* Sender Info */}
									<div className="flex items-start justify-between mb-4">
										<div className="flex items-center space-x-3">
											<div className="bg-blue-100 rounded-full p-2">
												<FiUser className="text-blue-600 w-5 h-5" />
											</div>
											<div>
												<div className="font-semibold text-gray-900">{req.senderUserName || 'Unknown'}</div>
												<div className="flex items-center text-sm text-gray-600 mt-0.5">
													<FiMail className="w-3 h-3 mr-1" />
													{req.senderUserEmail || 'Unknown'}
												</div>
											</div>
										</div>
										<span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
											Pending
										</span>
									</div>

									{/* Swap Details */}
									<div className="bg-white rounded-lg p-4 mb-4">
										<div className="grid md:grid-cols-2 gap-4">
											{/* Their Event */}
											<div className="border-r border-gray-200 pr-4">
												<div className="text-xs text-gray-500 uppercase tracking-wide mb-2">They Offer</div>
												<div className="font-semibold text-blue-600 text-lg mb-2">{req.senderEventTitle}</div>
												<div className="space-y-1.5">
													<div className="flex items-center text-sm text-gray-700">
														<FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
														<span>{formatDate(req.senderEventDate)}</span>
													</div>
													<div className="flex items-center text-sm text-gray-700">
														<FiClock className="w-4 h-4 mr-2 text-gray-400" />
														<span>
															{formatTime24to12(req.senderEventStartTime)} - {formatTime24to12(req.senderEventEndTime)}
														</span>
													</div>
												</div>
											</div>

											{/* Your Event */}
											<div className="pl-0 md:pl-4">
												<div className="text-xs text-gray-500 uppercase tracking-wide mb-2">For Your</div>
												<div className="font-semibold text-green-600 text-lg mb-2">{req.targetEventTitle}</div>
												<div className="space-y-1.5">
													<div className="flex items-center text-sm text-gray-700">
														<FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
														<span>{formatDate(req.targetEventDate)}</span>
													</div>
													<div className="flex items-center text-sm text-gray-700">
														<FiClock className="w-4 h-4 mr-2 text-gray-400" />
														<span>
															{formatTime24to12(req.targetEventStartTime)} - {formatTime24to12(req.targetEventEndTime)}
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Action Buttons */}
									<div className="flex gap-3">
										<button
											className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
											onClick={() => handleSwapAction(req._id, true)}
										>
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
											</svg>
											<span>Accept Swap</span>
										</button>
										<button
											className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
											onClick={() => handleSwapAction(req._id, false)}
										>
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
											</svg>
											<span>Decline</span>
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
