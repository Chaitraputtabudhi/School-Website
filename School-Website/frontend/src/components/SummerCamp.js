// pages/SummerCampPage.js
import React, { useState, useEffect } from 'react';
import { Sun, Users, Calendar, Clock, BookOpen, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SummerCamp = () => {
  const [camps, setCamp] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    fetch("http://localhost:5000/summercamp", {
      credentials: "include",
    }).then((res) => res.json())
      .then((data) => setCamp(data))
      .catch((err) => console.error("Error fetching SummerCamps:", err));
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      console.log('🔍 CURRENT USER:', parsedUser);
      console.log('🔍 USER EMPROLE:', parsedUser?.emprole);
      console.log('🔍 IS ADMIN?:', parsedUser?.emprole?.toLowerCase() === 'admin');
    }
  }, []);


  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <Sun className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Summer Camp 2025</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fun-filled summer programs designed to keep kids engaged, active, and learning during the holidays!
          </p>
        </div>
        <div className="grid gap-8">
          {camps.map(camp => (
            <div key={camp.id} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-orange-600">{camp.title}</h3>
                  <p className="text-gray-600 mb-4">{camp.description}</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold">Age Group: {camp.age}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-semibold">Dates</p>
                      {/* Display can still use 'dates' for static data, or 'date' for dynamic data */}
                      <p className="text-sm text-gray-600">{camp.dates || camp.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="font-semibold">Time</p>
                      <p className="text-sm text-gray-600">{camp.time}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-orange-600">${camp.price}</p>
                    <p className="text-sm text-gray-600">per week</p>
                  </div>
                  <button 
                  onClick={() => navigate('/contact')}
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold">
                   Contact Now to Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Camp Features */}
        <div className="mt-12 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">What Makes Our Summer Camp Special?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Educational Fun</h3>
              <p className="text-sm text-gray-600">Learning through play and hands-on activities</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Expert Staff</h3>
              <p className="text-sm text-gray-600">Qualified counselors and activity specialists</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Safe Environment</h3>
              <p className="text-sm text-gray-600">Secure campus with 24/7 supervision</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Outdoor Adventures</h3>
              <p className="text-sm text-gray-600">Field trips and outdoor exploration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummerCamp;