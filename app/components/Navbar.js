/**
 * Navbar Component
 * 
 * Application header with navigation links, notification system, and user controls.
 * Features:
 * - Dynamic navigation based on current route
 * - Real-time swap request notifications
 * - Smart polling for notifications with visibility optimization
 * - User session management (logout)
 * 
 * @component
 */

'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FaBell, FaRegBell } from 'react-icons/fa';
import SwapRequestModal from '@/app/components/SwapRequestModal';

export default function Navbar({ title = "SlotSwapper" }) {
	const router = useRouter();
	const pathname = usePathname();

	const navLinks = [
		{ label: 'Home', href: '/' },
		{ label: 'Swap Events', href: '/swap-events' },
	];

	// Notification state
	const [swapRequests, setSwapRequests] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);

	// Polling interval reference
	const pollingIntervalRef = useRef(null);
	// Track if initial load to auto-open modal
	const isInitialLoad = useRef(true);

	// Function to fetch swap requests
	const fetchSwapRequests = async () => {
		try {
			const res = await fetch('/api/swap-requests');
			const data = await res.json();
			setSwapRequests(data);

			// Auto-open modal on initial page load if requests exist
			if (data && data.length > 0) {
				setShowModal(true);
				isInitialLoad.current = false;
			}
		} catch (error) {
			console.error('Error fetching swap requests:', error);
		}
	};

	// Initial fetch and smart polling setup
	useEffect(() => {
		// Initial fetch
		setLoading(true);
		fetchSwapRequests().finally(() => setLoading(false));

		// Start polling every 30 seconds
		const startPolling = () => {
			pollingIntervalRef.current = setInterval(() => {
				fetchSwapRequests();
			}, 30000); // Poll every 30 seconds
		};

		// Stop polling
		const stopPolling = () => {
			if (pollingIntervalRef.current) {
				clearInterval(pollingIntervalRef.current);
				pollingIntervalRef.current = null;
			}
		};

		// Handle visibility change - stop polling when tab is hidden
		const handleVisibilityChange = () => {
			if (document.hidden) {
				stopPolling();
			} else {
				// When tab becomes visible again, fetch immediately and restart polling
				fetchSwapRequests();
				startPolling();
			}
		};

		// Start initial polling
		startPolling();

		// Listen for visibility changes
		document.addEventListener('visibilitychange', handleVisibilityChange);

		// Cleanup on unmount
		return () => {
			stopPolling();
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, []);

	const hasRequests = swapRequests && swapRequests.length > 0;

	const handleLogout = async () => {
		await fetch('/api/auth/logout', { method: 'POST' });
		router.push('/login');
	};

	return (
		<nav className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 shadow-md px-8 py-3 rounded-b-xl flex items-center justify-between w-full">
			{/* Title: clickable */}
			<span
				className="text-2xl font-bold text-white tracking-wide cursor-pointer hover:text-yellow-300 transition"
				onClick={() => router.push('/')}
			>
				{title}
			</span>

			{/* Nav Buttons */}
			<div className="flex items-center space-x-2 bg-white/30 rounded-lg p-1">
				{navLinks.map(link => (
					<button
						key={link.href}
						onClick={() => router.push(link.href)}
						className={`px-4 py-2 font-semibold rounded-md transition 
              ${pathname === link.href
								? 'bg-white text-blue-600 shadow hover:bg-blue-100'
								: 'bg-transparent text-white hover:bg-white/40 hover:text-yellow-200'}
            `}
					>
						{link.label}
					</button>
				))}
			</div>

			{/* Right: Notifications + Logout */}
			<div className="flex items-center space-x-6">
				<button
					title="Swap Requests"
					className="relative text-white hover:text-yellow-300 text-xl transition"
					onClick={() => setShowModal(true)}
				>
					{hasRequests ? <FaBell /> : <FaRegBell />}
					{hasRequests && (
						<span className="absolute -top-1 -right-2 bg-red-500 rounded-full w-2 h-2" />
					)}
				</button>

				<button
					className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-md shadow hover:bg-yellow-300 hover:text-blue-900 transition"
					onClick={handleLogout}
				>
					Logout
				</button>
			</div>

			{/* Modal for pending swap requests */}
			<SwapRequestModal
				open={showModal}
				onClose={() => setShowModal(false)}
				requests={swapRequests}
				loading={loading}
				refreshRequests={async () => {
					setLoading(true);
					await fetchSwapRequests();
					setLoading(false);
				}}
			/>
		</nav>
	);
}
