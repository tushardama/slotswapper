"use client"
import React, { useEffect, useState } from 'react';
import SwapModal from '@/app/components/SwapModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function statusBadge(status) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
      ${status === 'Swappable' ? 'bg-green-100 text-green-700'
        : status === 'Swap Pending' ? 'bg-yellow-100 text-yellow-800'
        : status === 'Swapped' ? 'bg-gray-100 text-gray-700'
        : 'bg-red-100 text-red-700'
      }`}>
      {status}
    </span>
  );
}

export default function SwapMarketplacePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [targetEvent, setTargetEvent] = useState(null);
  const [myEvents, setMyEvents] = useState([]);

  useEffect(() => {
    fetch('/api/swappable-slots')
      .then(res => res.json())
      .then(data => {
        setEvents(data.filter(ev => ev.status === "Swappable"));
        setLoading(false);
      });
  }, []);

  // When opening modal, show only user's swappable events
  const handleRequestSwap = async (event) => {
    setTargetEvent(event);
    const res = await fetch('/api/events?mine=true');
    const myData = await res.json();
    setMyEvents(myData.filter(ev => ev.status === "Swappable"));
    setShowModal(true);
  };

  // Swap logic: call API to create swap request
  const handleSwap = async (myEvent) => {
    try {
      await fetch('/api/swap-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderUserId: myEvent.userId,
          targetUserId: targetEvent.userId,
          senderEventId: myEvent._id,
          targetEventId: targetEvent._id
        })
      });
      toast.success("Swap Request Sent!");
      setShowModal(false);
      // (Optional: refresh events here for visual update)
    } catch (err) {
      toast.error("Failed to send swap request.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Swap Marketplace</h1>
      {loading ? (
        <div className="text-center text-lg">Loading swappable events...</div>
      ) : events.length === 0 ? (
        <div className="text-center text-lg text-gray-500">No swappable slots available.</div>
      ) : (
        <div className="max-w-2xl mx-auto grid gap-6">
          {events.map(event => (
            <div key={event._id} className="bg-white shadow rounded-lg p-6 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">{event.title}</span>
                {statusBadge(event.status)}
              </div>
              <div className="text-gray-700 text-sm">
                <span className="font-semibold">{event.userName}</span>
                {' • '}
                <span>{event.userEmail}</span>
              </div>
              <div className="text-gray-600">
                {new Date(event.date).toLocaleDateString('en-IN')} | {formatTime24to12(event.startTime)} - {formatTime24to12(event.endTime)}
              </div>
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition font-medium text-sm shadow"
                disabled={event.status !== "Swappable"}
                onClick={() => handleRequestSwap(event)}
              >
                Request Swap
              </button>
            </div>
          ))}
        </div>
      )}
      <SwapModal
        open={showModal}
        onClose={() => setShowModal(false)}
        myEvents={myEvents}
        targetEvent={targetEvent}
        onSwap={handleSwap}
      />
      <ToastContainer position="top-center" autoClose={4000} theme="light" />
    </div>
  );
}

function formatTime24to12(time) {
  const [hour, minute] = time.split(':');
  let h = parseInt(hour, 10) % 24;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${minute} ${ampm}`;
}
