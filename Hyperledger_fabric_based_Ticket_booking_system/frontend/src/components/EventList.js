import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';

function EventList({ onSelectEvent }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents().then(setEvents).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map(e => (
            <li key={e.eventId}>
              <button onClick={() => onSelectEvent(e)}>{e.name} - {e.date} at {e.location}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EventList;
