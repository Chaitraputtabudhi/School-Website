import React, { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";

const EventsPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events from backend
    fetch("http://localhost:5000/events", {
      credentials: "include", // include cookies if needed
    })
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Latest Events</h1>
          <p className="text-xl text-gray-600">
            Stay updated with all the exciting happenings at Placeholder Academy
          </p>
        </div>

        <div className="grid gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>
                        {event.event_date
                          ? new Date(event.event_date).toLocaleDateString()
                          : "Date not set"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span>{event.location || "Location not set"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <p className="text-center text-gray-500">No events to show.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
