
import { useState, useMemo } from "react";
import { useEvents } from "./hooks/useEvents";
import { Event, EventFormData } from "./types";
import { Header } from "./components/Header";
import { EventForm } from "./components/EventForm";
import { EventCard } from "./components/EventCard";
import { DeleteConfirmationModal } from "./components/DeleteConfirmationModal";
import { SearchAndFilters } from "./components/SearchAndFilters";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { EmptyState } from "./components/EmptyState";
import { AlertCircle } from "lucide-react";

function App() {
  const {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    updateTicketAvailability,
  } = useEvents();

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    event: Event | null;
  }>({
    show: false,
    event: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "upcoming" | "past">(
    "all"
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters & sorting
  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q)
      );
    }

    if (filterType !== "all") {
      const now = new Date();
      filtered = filtered.filter((e) => {
        const dateTime = new Date(`${e.date}T${e.time}`);
        return filterType === "upcoming" ? dateTime >= now : dateTime < now;
      });
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`).getTime();
      const dateB = new Date(`${b.date}T${b.time}`).getTime();
      return dateA - dateB;
    });
  }, [events, searchQuery, filterType]);

  // Form handlers
  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleFormSubmit = async (eventData: EventFormData) => {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData);
      } else {
        await createEvent(eventData);
      }
      setShowForm(false);
      setEditingEvent(null);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  // Delete handlers
  const handleDeleteClick = (event: Event) => {
    setDeleteModal({ show: true, event });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.event) return;
    try {
      setIsDeleting(true);
      await deleteEvent(deleteModal.event.id);
      setDeleteModal({ show: false, event: null });
    } catch (err) {
      console.error("Error deleting event:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, event: null });
  };

  // Stats
  const eventStats = useMemo(() => {
    const totalEvents = events.length;
    const upcomingEvents = events.filter((e) => {
      const dateTime = new Date(`${e.date}T${e.time}`);
      return dateTime >= new Date();
    }).length;
    const totalTickets = events.reduce((sum, e) => sum + e.ticketQuantity, 0);
    const availableTickets = events.reduce(
      (sum, e) => sum + e.availableTickets,
      0
    );

    return { totalEvents, upcomingEvents, totalTickets, availableTickets };
  }, [events]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onCreateEvent={handleCreateEvent} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-3">
            <AlertCircle size={24} className="text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">
                Error Loading Events
              </h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCreateEvent={handleCreateEvent} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Events" value={eventStats.totalEvents} color="blue" />
          <StatCard label="Upcoming" value={eventStats.upcomingEvents} color="green" />
          <StatCard label="Total Tickets" value={eventStats.totalTickets} color="purple" />
          <StatCard label="Available" value={eventStats.availableTickets} color="orange" />
        </div>

        {/* Filters */}
        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterType={filterType}
          onFilterChange={setFilterType}
        />

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            onCreateEvent={handleCreateEvent}
            isFiltered={searchQuery.trim() !== "" || filterType !== "all"}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={handleEditEvent}
                onDelete={() => handleDeleteClick(event)}
                onTicketUpdate={updateTicketAvailability}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showForm && (
        <EventForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          initialData={editingEvent || undefined}
          isEditing={!!editingEvent}
        />
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.show}
        eventName={deleteModal.event?.name || ""}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={isDeleting}
      />
    </div>
  );
}

// Reusable stat card
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 bg-${color}-50 rounded-lg`}>
          <div className={`w-6 h-6 bg-${color}-600 rounded`}></div>
        </div>
      </div>
    </div>
  );
}

export default App;
