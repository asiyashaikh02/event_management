import { Event, EventFormData } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/events';
fetch(API_URL)
export const eventService = {
  // Get all events
  async getAllEvents(): Promise<Event[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  },

  // Create event
  async createEvent(eventData: EventFormData): Promise<Event> {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    if (!res.ok) throw new Error('Failed to create event');
    return res.json();
  },

  // Update event
  async updateEvent(id: string, eventData: EventFormData): Promise<Event> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    if (!res.ok) throw new Error('Failed to update event');
    return res.json();
  },

  // Delete event
  async deleteEvent(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete event');
  },

  // Update available tickets
  async updateTicketAvailability(id: string, availableTickets: number): Promise<Event> {
    const res = await fetch(`${API_URL}/${id}/tickets`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ availableTickets }),
    });
    if (!res.ok) throw new Error('Failed to update tickets');
    return res.json();
  },
};
