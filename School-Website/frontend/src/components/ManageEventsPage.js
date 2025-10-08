import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Clock, Plus, Edit, Trash2, Users } from "lucide-react";

const ManageEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", event_date: "", description: "", location: "" });
  const [editingEvent, setEditingEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
    loadUser();
  }, []);

  const fetchEvents = async () => {
    try {

      const response = await fetch("http://localhost:5000/events");
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events");
    }
  };

  const loadUser = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.event_date || !newEvent.location) {
      setError("Please fill in all required fields");
      return;
    }

    try {

      const response = await fetch("http://localhost:5000/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newEvent)
      });

      if (!response.ok) {
        throw new Error('Failed to add event');
      }

      const event = await response.json();
      setEvents([...events, event]);
      setNewEvent({ title: "", event_date: "", description: "", location: "" });
      setError("");
    } catch (err) {
      console.error("Error adding event:", err);
      setError("Failed to add event");
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent({ ...event });
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;

    try {

      const response = await fetch(`http://localhost:5000/admin/events/${editingEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editingEvent)
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      const updatedEvent = await response.json();
      setEvents(events.map(event =>
        event.id === editingEvent.id ? updatedEvent : event
      ));
      setEditingEvent(null);
      setError("");
    } catch (err) {
      console.error("Error updating event:", err);
      setError("Failed to update event");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {

      const response = await fetch(`http://localhost:5000/admin/events/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      setEvents(events.filter(event => event.id !== id));
      setError("");
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("Failed to delete event");
    }
  };

  const isAdmin = user?.emprole?.toLowerCase() === 'admin';

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Calendar className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">School Events</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with all the exciting events happening at our school!
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Admin Management Section */}
        {isAdmin && (
          <div className="mb-12 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Plus className="w-6 h-6 mr-2" />
              Manage Events
            </h2>

            {/* Add New Event Form */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="Event Title *"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Location *"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="datetime-local"
                value={newEvent.event_date}
                onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
              />
            </div>
            <textarea
              placeholder="Event Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows="4"
            />
            <button
              onClick={handleAddEvent}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold disabled:opacity-50"
            >
              Add Event
            </button>

            {/* Edit Event Modal */}
            {editingEvent && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-xl max-w-2xl w-full mx-4 max-h-90vh overflow-y-auto">
                  <h3 className="text-xl font-bold mb-4">Edit Event</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Event Title"
                      value={editingEvent.title}
                      onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={editingEvent.location}
                      onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="datetime-local"
                      value={editingEvent.event_date?.slice(0, 16) || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, event_date: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                    />
                  </div>
                  <textarea
                    placeholder="Event Description"
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    rows="4"
                  />
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setEditingEvent(null)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateEvent}
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Events Display */}
        <div className="grid gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-blue-600">{event.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{formatTime(event.event_date)}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  {event.description && (
                    <p className="text-gray-700 leading-relaxed">{event.description}</p>
                  )}
                </div>

                {isAdmin && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                      title="Edit event"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                      title="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    <span>Open to all students and parents</span>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ManageEventsPage;