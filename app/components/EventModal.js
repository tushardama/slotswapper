/**
 * EventModal Component
 * 
 * Modal dialog for creating and editing calendar events.
 * Provides form controls for event details including title, time range, and swap status.
 * Handles both new event creation and existing event modification.
 * 
 * @component
 */

import { useState } from 'react';

/**
 * Available status options for events
 * Restricted to prevent invalid status assignments
 */
const STATUS_OPTIONS = ['Swappable', 'Non-Swappable'];

export default function EventModal({ date, event, onClose, onAdd, onDelete }) {
  const [title, setTitle] = useState(event?.title || '');
  const [startTime, setStartTime] = useState(event?.startTime || '');
  const [endTime, setEndTime] = useState(event?.endTime || '');
  // If status is absent (new event), default to Swappable
  const [status, setStatus] = useState(event?.status || 'Swappable');
  const isEdit = !!event;

  const formattedDate = typeof date === 'string' ? date : date.toISOString().split('T')[0];

  const handleSubmit = () => {
    if (!title || !startTime || !endTime || !status) return;
    const payload = {
      _id: event?._id,
      title,
      date: formattedDate,
      startTime,
      endTime,
      status,
    };
    onAdd(payload, isEdit);
  };

  // Generate status badge (edit mode only)
  function statusBadge(stat) {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold
        ${stat === 'Swappable' ? 'bg-green-100 text-green-700'
          : stat === 'Swap Pending' ? 'bg-yellow-100 text-yellow-800'
          : stat === 'Swapped' ? 'bg-gray-100 text-gray-700'
          : 'bg-red-100 text-red-700'
        }`}>
        {stat}
      </span>
    );
  }

  const canEditStatus = STATUS_OPTIONS.includes(status);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-80">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          {isEdit ? 'Edit Event' : 'Add Event'}
        </h2>
        <div className="text-sm text-gray-600 mb-3">
          Date: <strong>{formattedDate}</strong>
        </div>

        {/* Title */}
        <input
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        {/* Time Range */}
        <div className="flex gap-2 mb-3">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-1/2 border p-2 rounded"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-1/2 border p-2 rounded"
          />
        </div>

        {/* Status Selector or Badge */}
        <div className="mb-4">
          {isEdit && !canEditStatus ? (
            <div className="flex items-center gap-2">
              Status: {statusBadge(status)}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <select
                id="status"
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="border p-2 rounded"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          {isEdit && (
            <button
              onClick={() => onDelete(event._id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          )}
          <div className="flex gap-2">
            <button onClick={onClose} className="text-gray-600 hover:underline">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-primary text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              {isEdit ? 'Save' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
