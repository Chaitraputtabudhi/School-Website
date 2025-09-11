import React, { useEffect, useState } from "react";

const ManageEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", description: "" });

  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  const handleAddEvent = async () => {
    const res = await fetch("http://localhost:5000/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newEvent)
    });
    const event = await res.json();
    setEvents([...events, event]);
    setNewEvent({ title: "", date: "", description: "" });
  };

  const handleDeleteEvent = async (id) => {
    await fetch(`http://localhost:5000/events/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    setEvents(events.filter(e => e.id !== id));
  };

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
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          className="border px-3 py-2 w-full"
        />
        <textarea
          placeholder="Description"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
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
            <div>
              <h2 className="font-semibold">{event.title}</h2>
              <p>{event.date}</p>
              <p>{event.description}</p>
            </div>
            <button
              onClick={() => handleDeleteEvent(event.id)}
              className="bg-red-600 text-white px-3 py-1 rounded-md"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageEventsPage;
