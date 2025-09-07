import React from 'react';
import { Calendar, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateEvent: () => void;
  isFiltered?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateEvent, isFiltered = false }) => {
  if (isFiltered) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar size={32} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
        <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Calendar size={40} className="text-blue-600" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-4">No events yet</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Get started by creating your first event. You can manage all the details including dates, locations, and ticket availability.
      </p>
      <button
        onClick={onCreateEvent}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
      >
        <Plus size={20} />
        Create Your First Event
      </button>
    </div>
  );
};