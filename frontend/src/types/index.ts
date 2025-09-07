export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  ticketQuantity: number;
  availableTickets: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventFormData {
  name: string;
  date: string;
  time: string;
  location: string;
  ticketQuantity: number;
  description?: string;
}