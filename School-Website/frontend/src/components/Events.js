import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const EventsPage = ({ user, events=[], setEvents }) => {
  const handleAddEvent = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEvent = {
      id: events.length + 1,
      title: formData.get('title'),
      date: formData.get('date'),
      time: formData.get('time'),
      description: formData.get('description')
    };
    setEvents([...events, newEvent]);
    e.target.reset();
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Latest Events</h1>
          <p className="text-xl text-gray-600">
            Stay updated with all the exciting happenings at Brightwood Academy
          </p>
        </div>
        
        <div className="grid gap-8">
          {events.map(event => (
            <div key={event.id} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Add Event Form (for admin) */}
        {user?.role === 'admin' && (
          <div className="mt-12 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Add New Event</h2>
            <form onSubmit={handleAddEvent} className="grid md:grid-cols-2 gap-6">
              <input
                name="title"
                type="text"
                placeholder="Event Title"
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                name="date"
                type="date"
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                name="time"
                type="time"
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Add Event
              </button>
              <div className="md:col-span-2">
                <textarea
                  name="description"
                  placeholder="Event Description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                ></textarea>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;