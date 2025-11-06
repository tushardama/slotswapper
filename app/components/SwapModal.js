/**
 * SwapModal Component
 * 
 * Modal dialog for initiating event swaps.
 * Displays available user events that can be swapped with a selected target event.
 * Handles swap request initiation and user interaction.
 * 
 * @component
 * @param {Object} props
 * @param {boolean} props.open - Controls modal visibility
 * @param {Function} props.onClose - Handler for modal close action
 * @param {Array} props.myEvents - List of user's swappable events
 * @param {Object} props.targetEvent - Event selected for swap
 * @param {Function} props.onSwap - Handler for swap confirmation
 */

import React from 'react';

export default function SwapModal({ open, onClose, myEvents, targetEvent, onSwap }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-4 text-gray-400 text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">
          Choose your event to swap with <span className="text-blue-600">{targetEvent.title}</span>
        </h2>
        {myEvents.length === 0 ? (
          <div className="text-gray-500 text-center">You have no swappable events.</div>
        ) : (
          <div className="space-y-4">
            {myEvents.filter(ev => ev.status === "Swappable").map(ev => (
              <div key={ev._id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">{ev.title}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(ev.date).toLocaleDateString('en-IN')}, {formatTime24to12(ev.startTime)} - {formatTime24to12(ev.endTime)}
                  </div>
                </div>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  onClick={() => onSwap(ev)}
                >
                  Swap
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
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
