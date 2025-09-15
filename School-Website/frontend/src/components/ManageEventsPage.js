import React, { useEffect, useState } from "react";

const ManageEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", event_date: "", description: "", location: "" });
  const [editingEventId, setEditingEventId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);


  const handleAddEvent = async () => {
    const res = await fetch("http://localhost:5000/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newEvent)
    });
    const event = await res.json();
    setEvents([...events, event]);
    setNewEvent({ title: "", event_date: "", description: "", location: "" });
  };

  const handleDeleteEvent = async (id) => {
    await fetch(`http://localhost:5000/admin/events/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    setEvents(events.filter(e => e.id !== id));
  };

  const handlePutEvent = async (id) => {
    const updateEvent = events.find(e => e.id === id);
    const res = await fetch(`http://localhost:5000/admin/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updateEvent)
    });
    const updatedEvent = await res.json();
    setEditingEventId(null);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Events</h1>

      <div className="space-y-2 mb-6">
        <input
          type="text"
          placeholder="Event Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          className="border px-3 py-2 w-full"
        />
        <input
          type="date"
          value={newEvent.event_date.slice(0, 10)}
          onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
          className="border px-3 py-2 w-full"
        />
        <textarea
          placeholder="Description"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          className="border px-3 py-2 w-full"
        />
        <input
          type="text"
          placeholder="Location"
          value={newEvent.location}
          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
          className="border px-3 py-2 w-full"
        />
        <button
          onClick={handleAddEvent}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add Event
        </button>
      </div>

      <ul>
        {events.map(event => (
          <li key={event.id} className="border p-3 mb-2 flex justify-between">
            {editingEventId === event.id ? (
              // Edit form
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={event.title}
                  onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, title: e.target.value } : ev))}
                  className="border px-3 py-2 w-full"
                />
                <input
                  type="date"
                  value={event.event_date.slice(0, 10)} // Format YYYY-MM-DD
                  onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, event_date: e.target.value } : ev))}
                  className="border px-3 py-2 w-full"
                />
                <textarea
                  value={event.description}
                  onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, description: e.target.value } : ev))}
                  className="border px-3 py-2 w-full"
                />
                <input
                  type="text"
                  value={event.location}
                  onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, location: e.target.value } : ev))}
                  className="border px-3 py-2 w-full"
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handlePutEvent(event.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-md"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingEventId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Display mode
              <div className="flex-1">
                <h2 className="font-semibold">{event.title}</h2>
                <p>{event.event_date}</p>
                <p>{event.description}</p>
                <p>{event.location}</p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => setEditingEventId(event.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageEventsPage;



