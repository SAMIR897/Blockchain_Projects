const API_URL = 'http://localhost:3001';

export async function fetchEvents() {
  const res = await fetch(`${API_URL}/events`);
  return await res.json();
}

export async function fetchTickets(ownerId) {
  const res = await fetch(`${API_URL}/tickets/${ownerId}`);
  return await res.json();
}

export async function bookTicket(eventId, seatNo, ownerId) {
  const res = await fetch(`${API_URL}/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventId, seatNo, ownerId }),
  });
  return await res.json();
}
