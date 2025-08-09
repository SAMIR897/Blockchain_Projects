import React, { useState } from 'react';
import EventList from './components/EventList';
import Booking from './components/Booking';
import UserTickets from './components/UserTickets';

function App() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ownerId, setOwnerId] = useState('');

  return (
    <div className="App" style={{ padding: 20 }}>
      <h1>Ticket Booking System</h1>

      <input
        type="text"
        placeholder="Enter Your User ID"
        value={ownerId}
        onChange={e => setOwnerId(e.target.value)}
      />

      <EventList onSelectEvent={setSelectedEvent} />

      {selectedEvent && (
        <Booking
          event={selectedEvent}
          onBookingComplete={() => {
            setSelectedEvent(null);
          }}
        />
      )}

      <UserTickets ownerId={ownerId} />
    </div>
  );
}

export default App;
