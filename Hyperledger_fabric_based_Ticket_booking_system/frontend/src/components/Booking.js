import React, { useState } from 'react';
import { bookTicket } from '../services/api';

function Booking({ event, onBookingComplete }) {
  const [seatNo, setSeatNo] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [message, setMessage] = useState('');

  const handleBook = async () => {
    try {
      if (!seatNo || !ownerId) {
        setMessage('Please provide Seat Number and Your ID.');
        return;
      }
      const response = await bookTicket(event.eventId, seatNo, ownerId);
      if (response.error) {
        setMessage(`Error: ${response.error}`);
      } else {
        setMessage(`Ticket booked successfully: ${JSON.stringify(response)}`);
        onBookingComplete();
      }
    } catch (err) {
      setMessage('Booking failed: ' + err.message);
    }
  };

  return (
    <div>
      <h3>Book Ticket for {event.name}</h3>
      <input
        type="number"
        placeholder="Seat Number"
        value={seatNo}
        onChange={e => setSeatNo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Your ID"
        value={ownerId}
        onChange={e => setOwnerId(e.target.value)}
      />
      <button onClick={handleBook}>Book</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Booking;
