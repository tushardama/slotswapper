/**
 * Calendar Component
 * 
 * Interactive calendar component that displays events and allows event management.
 * Features:
 * - Monthly view with navigation
 * - Event creation, editing, and deletion
 * - Visual indication for today and past dates
 * - Integration with event management system
 * - Real-time refresh capabilities
 * 
 * @component
 */

'use client';
import { useEffect, useState } from 'react';
import EventModal from './EventModal';
import EventCard from './EventCard';
import { useRefresh } from '@/app/RefreshContext';

function getDaysInMonth(year, month) {
	return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
	return new Date(year, month, 1).getDay();
}

export default function Calendar() {
	const { refresh, setRefresh } = useRefresh();
	const today = new Date();
	const [events, setEvents] = useState([]);
	const [open, setOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState(null);
	const [editEvent, setEditEvent] = useState(null);
	const [currentMonth, setCurrentMonth] = useState(today.getMonth());
	const [currentYear, setCurrentYear] = useState(today.getFullYear());

	const fetchEvents = async () => {
		const data = await fetch('/api/events').then(res => res.json());
		setEvents(data);
	};

	useEffect(() => { fetchEvents(); }, []);

	// 🔥 Whenever refresh = true, reload events and reset
	useEffect(() => {
		if (refresh) {
			fetchEvents().then(() => setRefresh(false));
		}
	}, [refresh]);

	const handleAddOrEdit = async (data, isEdit) => {
		const method = isEdit ? 'PUT' : 'POST';
		await fetch('/api/events', {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});
		setOpen(false);
		setEditEvent(null);
		await fetchEvents();
	};

	const handleDelete = async (id) => {
		await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
		await fetchEvents();
		setOpen(false);
	};

	const daysInMonth = getDaysInMonth(currentYear, currentMonth);
	const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const canGoPrev = currentMonth > today.getMonth() || currentYear > today.getFullYear();

	const handlePrevMonth = () => {
		if (!canGoPrev) return;
		if (currentMonth === 0) {
			setCurrentMonth(11);
			setCurrentYear(currentYear - 1);
		} else {
			setCurrentMonth(currentMonth - 1);
		}
	};
	const handleNextMonth = () => {
		if (currentMonth === 11) {
			setCurrentMonth(0);
			setCurrentYear(currentYear + 1);
		} else {
			setCurrentMonth(currentMonth + 1);
		}
	};

	const isPastDate = (day) => {
		const date = new Date(currentYear, currentMonth, day);
		return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
	};

	return (
		<div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<button
					onClick={handlePrevMonth}
					disabled={!canGoPrev}
					className={`px-3 py-1 rounded-md ${canGoPrev ? 'bg-blue-100 hover:bg-blue-200' : 'opacity-30 cursor-not-allowed'}`}
				>←</button>
				<h2 className="text-2xl font-semibold text-primary">
					{monthNames[currentMonth]} {currentYear}
				</h2>
				<button
					onClick={handleNextMonth}
					className="px-3 py-1 rounded-md bg-blue-100 hover:bg-blue-200"
				>→</button>
			</div>

			{/* Weekdays */}
			<div className="grid grid-cols-7 text-center text-gray-600 mb-2 font-medium">
				{dayNames.map((d) => <div key={d}>{d}</div>)}
			</div>

			{/* Calendar Grid */}
			<div className="grid grid-cols-7 gap-2">
				{Array(firstDay).fill(null).map((_, i) => <div key={`e-${i}`} />)}
				{Array.from({ length: daysInMonth }, (_, i) => {
					const day = i + 1;
					const date = new Date(currentYear, currentMonth, day);
					const iso = date.toISOString().split('T')[0];
					const isToday = date.toDateString() === today.toDateString();
					const dayEvents = events.filter(e => e.date === iso);

					return (
						<div
							key={day}
							onClick={() => !isPastDate(day) && (setSelectedDate(day), setOpen(true))}
							className={`relative border rounded-md p-2 min-h-20 cursor-pointer 
              ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-blue-50'}
              ${isPastDate(day) ? 'cursor-not-allowed bg-gray-100 text-gray-400' : ''}`}
						>
							<div className="font-medium">{day}</div>
							<div className="space-y-1 mt-1">
								{dayEvents.map(e => (
									<div key={e._id} onClick={(ev) => { ev.stopPropagation(); setEditEvent(e); setOpen(true); }}>
										<EventCard event={e} />
									</div>
								))}
							</div>
						</div>
					);
				})}
			</div>

			{open && (
				<EventModal
					date={editEvent ? editEvent.date : new Date(currentYear, currentMonth, selectedDate)}
					event={editEvent}
					onClose={() => { setOpen(false); setEditEvent(null); }}
					onAdd={handleAddOrEdit}
					onDelete={handleDelete}
				/>
			)}
		</div>
	);
}
