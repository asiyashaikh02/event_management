import React from 'react';
import { Event } from '../types';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Ticket } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onTicketUpdate: (eventId: string, availableTickets: number) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onEdit, 
  onDelete, 
  onTicketUpdate 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTicketStatus = () => {
    const percentage = (event.availableTickets / event.ticketQuantity) * 100;
    if (percentage === 0) return { color: 'text-red-600', bg: 'bg-red-50', status: 'Sold Out' };
    if (percentage <= 25) return { color: 'text-orange-600', bg: 'bg-orange-50', status: 'Low Stock' };
    if (percentage <= 50) return { color: 'text-yellow-600', bg: 'bg-yellow-50', status: 'Half Available' };
    return { color: 'text-green-600', bg: 'bg-green-50', status: 'Available' };
  };

  const ticketStatus = getTicketStatus();

  const handleSellTicket = () => {
    if (event.availableTickets > 0) {
      onTicketUpdate(event.id, event.availableTickets - 1);
    }
  };

  const isEventPast = () => {
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    return eventDateTime < new Date();
  };

  const isPastEvent = isEventPast();

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border ${
      isPastEvent ? 'opacity-75 border-gray-200' : 'border-gray-100'
    }`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {event.name}
            </h3>
            {isPastEvent && (
              <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full mb-2">
                Past Event
              </span>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onEdit(event)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Event"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Event"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-3 text-blue-500" />
            <span className="font-medium">{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock size={16} className="mr-3 text-purple-500" />
            <span className="font-medium">{formatTime(event.time)}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-3 text-green-500" />
            <span className="font-medium">{event.location}</span>
          </div>
        </div>

        {event.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className={`p-4 rounded-lg ${ticketStatus.bg} mb-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users size={16} className={`mr-2 ${ticketStatus.color}`} />
              <span className={`font-semibold ${ticketStatus.color}`}>
                {event.availableTickets} / {event.ticketQuantity} tickets available
              </span>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${ticketStatus.bg} ${ticketStatus.color} border border-current border-opacity-20`}>
              {ticketStatus.status}
            </span>
          </div>
          
          <div className="mt-2 bg-white bg-opacity-50 rounded-full h-2">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                ticketStatus.color.includes('red') ? 'bg-red-400' :
                ticketStatus.color.includes('orange') ? 'bg-orange-400' :
                ticketStatus.color.includes('yellow') ? 'bg-yellow-400' :
                'bg-green-400'
              }`}
              style={{ width: `${(event.availableTickets / event.ticketQuantity) * 100}%` }}
            />
          </div>
        </div>

        {!isPastEvent && event.availableTickets > 0 && (
          <button
            onClick={handleSellTicket}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <Ticket size={16} />
            Sell Ticket
          </button>
        )}

        {event.availableTickets === 0 && (
          <div className="w-full px-4 py-3 bg-gray-100 text-gray-500 rounded-lg font-medium text-center">
            Sold Out
          </div>
        )}
      </div>
    </div>
  );
};