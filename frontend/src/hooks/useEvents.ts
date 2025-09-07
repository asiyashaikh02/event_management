import { useState, useEffect } from "react";
import { Event, EventFormData } from "../types";
import { eventService } from "../services/eventService";



export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedEvents = await eventService.getAllEvents();
      setEvents(fetchedEvents);
    } catch (err) {
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Create event
  const createEvent = async (eventData: EventFormData) => {
    try {
      const newEvent = await eventService.createEvent(eventData);
      setEvents((prev) => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      setError("Failed to create event");
      throw err;
    }
  };

  // Update event
  const updateEvent = async (id: string, eventData: EventFormData) => {
    try {
      const updatedEvent = await eventService.updateEvent(id, eventData);
      setEvents((prev) =>
        prev.map((event) => (event.id === id ? updatedEvent : event))
      );
      return updatedEvent;
    } catch (err) {
      setError("Failed to update event");
      throw err;
    }
  };

  // Delete event
  const deleteEvent = async (id: string) => {
    try {
      await eventService.deleteEvent(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (err) {
      setError("Failed to delete event");
      throw err;
    }
  };

  // Update available tickets
  const updateTicketAvailability = async (
    id: string,
    availableTickets: number
  ) => {
    try {
      const updatedEvent = await eventService.updateTicketAvailability(
        id,
        availableTickets
      );
      setEvents((prev) =>
        prev.map((event) => (event.id === id ? updatedEvent : event))
      );
      return updatedEvent;
    } catch (err) {
      setError("Failed to update tickets");
      throw err;
    }
  };

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    updateTicketAvailability,
    refetch: fetchEvents,
  };
}

