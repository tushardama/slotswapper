/**
 * EventCard Component
 * 
 * Renders an individual event card within the calendar view.
 * Displays event title, time, and swap status with appropriate visual styling.
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.event - The event object containing title, time, and swap status
 */
export default function EventCard({ event }) {
  return (
    <div
      className={`bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm truncate hover:bg-blue-200 ${
        event.swappable ? 'border border-dashed border-blue-400' : ''
      }`}
    >
      <div className="font-medium flex items-center justify-between">
        <span>{event.title}</span>
        {event.swappable && (
          <span className="text-xs text-green-700 bg-green-100 px-1 rounded ml-1">
            🔁
          </span>
        )}
      </div>
      <div className="text-xs">{event.startTime} - {event.endTime}</div>
    </div>
  );
}
