import React from 'react';
import { Calendar, Plus } from 'lucide-react';

interface HeaderProps {
  onCreateEvent: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCreateEvent }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
              <Calendar size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Event Manager</h1>
              <p className="text-blue-100 mt-1">Organize and manage your events with ease</p>
            </div>
          </div>
          
          <button
            onClick={onCreateEvent}
            className="flex items-center gap-2 px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg transition-all duration-200 font-medium border border-white border-opacity-20"
          >
            <Plus size={20} />
            Create Event
          </button>
        </div>
      </div>
    </header>
  );
};