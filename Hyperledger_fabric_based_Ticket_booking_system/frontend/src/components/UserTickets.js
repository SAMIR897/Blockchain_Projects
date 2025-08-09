import React, { useState, useEffect } from 'react';
import { fetchTickets } from '../services/api';

function UserTickets({ ownerId }) {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (!ownerId) return;
    fetchTickets(ownerId).then(setTickets).catch(console.error);
  }, [ownerId]);

  if (!ownerId) return <p>Please provide your User ID to see booked tickets.</p>;

  return (
    <div>
      <h3>Your Booked Tickets</h3>
      {tickets.length === 0 ? (
        <p>No tickets booked yet.</p>
      ) : (
        <ul>
          {tickets.map(t => (
            <li key={t.ticketId}>
              Event: {t.eventId}, Seat: {t.seatNo}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserTickets;
