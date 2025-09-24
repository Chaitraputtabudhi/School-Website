// pages/SummerCampPage.js
import React, { useState, useEffect } from 'react';
import { Sun, Users, Calendar, Clock, BookOpen, Star, Edit, Trash2, Plus } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const ManageSummerCamp = () => {
    const [camps, setCamps] = useState([]);
    const [newCamp, setNewCamp] = useState({ title: "", age: "", date: "", time: "", description: "", price: "" });
    const [editingCamp, setEditingCamp] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCamps();
        loadUser();
    }, []);

    const fetchCamps = async () => {
        try {
            
            const response = await fetch("http://localhost:5000/summercamp", {
                credentials: "include",
            });
            const data = await response.json();
            setCamps(data);
        } catch (err) {
            console.error("Error fetching SummerCamps:", err);
            setError("Failed to load camps");
        }
    };

    const loadUser = () => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
        }
    };

    const handleAddCamp = async () => {
        if (!newCamp.title || !newCamp.age || !newCamp.date || !newCamp.time || !newCamp.price) {
            setError("Please fill in all required fields");
            return;
        }

        try {
           
            const response = await fetch('http://localhost:5000/admin/summercamp', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(newCamp)
            });

            if (!response.ok) {
                throw new Error('Failed to add camp');
            }

            const camp = await response.json();
            setCamps([...camps, camp]);
            setNewCamp({ title: "", age: "", date: "", time: "", description: "", price: "" });
            setError("");
        } catch (err) {
            console.error("Error adding camp:", err);
            setError("Failed to add camp");
        }
    };

    const handleEditCamp = (camp) => {
        setEditingCamp({ ...camp });
    };

    const handleUpdateCamp = async () => {
        if (!editingCamp) return;

        try {
            
            const response = await fetch(`http://localhost:5000/admin/summercamp/${editingCamp.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(editingCamp)
            });

            if (!response.ok) {
                throw new Error('Failed to update camp');
            }

            const updatedCamp = await response.json();
            setCamps(camps.map(camp =>
                camp.id === editingCamp.id ? updatedCamp : camp
            ));
            setEditingCamp(null);
            setError("");
        } catch (err) {
            console.error("Error updating camp:", err);
            setError("Failed to update camp");
        }
    };

    const handleDeleteCamp = async (id) => {
        if (!window.confirm("Are you sure you want to delete this camp?")) return;

        try {
            
            const response = await fetch(`http://localhost:5000/admin/summercamp/${id}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error('Failed to delete camp');
            }

            setCamps(camps.filter(camp => camp.id !== id));
            setError("");
        } catch (err) {
            console.error("Error deleting camp:", err);
            setError("Failed to delete camp");
        }
    };

    const isAdmin = user?.emprole?.toLowerCase() === 'admin';

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen py-12 bg-gradient-to-br from-orange-50 to-yellow-50">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <Sun className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold mb-4">Summer Camp 2025</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Fun-filled summer programs designed to keep kids engaged, active, and learning during the holidays!
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
                            Manage Summer Camps
                        </h2>

                        {/* Add New Camp Form */}
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <input
                                type="text"
                                placeholder="Camp Title *"
                                value={newCamp.title}
                                onChange={(e) => setNewCamp({ ...newCamp, title: e.target.value })}
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <input
                                type="text"
                                placeholder="Age Group *"
                                value={newCamp.age}
                                onChange={(e) => setNewCamp({ ...newCamp, age: e.target.value })}
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <input
                                type="date"
                                value={newCamp.date}
                                onChange={(e) => setNewCamp({ ...newCamp, date: e.target.value })}
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <input
                                type="text"
                                placeholder="Duration/Time *"
                                value={newCamp.time}
                                onChange={(e) => setNewCamp({ ...newCamp, time: e.target.value })}
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <textarea
                                placeholder="Description"
                                value={newCamp.description}
                                onChange={(e) => setNewCamp({ ...newCamp, description: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <input
                                type="text"
                                placeholder="Price *"
                                value={newCamp.price}
                                onChange={(e) => setNewCamp({ ...newCamp, price: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <button
                            onClick={handleAddCamp}
                            
                            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:opacity-50"
                        >
                            Add Summer Camp
                        </button>

                        {/* Edit Camp Modal */}
                        {editingCamp && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white p-8 rounded-xl max-w-2xl w-full mx-4">
                                    <h3 className="text-xl font-bold mb-4">Edit Summer Camp</h3>
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="text"
                                            placeholder="Camp Title"
                                            value={editingCamp.title}
                                            onChange={(e) => setEditingCamp({ ...editingCamp, title: e.target.value })}
                                            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Age Group"
                                            value={editingCamp.age}
                                            onChange={(e) => setEditingCamp({ ...editingCamp, age: e.target.value })}
                                            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                        <input
                                            type="date"
                                            value={editingCamp.date?.slice(0, 10) || ''}
                                            onChange={(e) => setEditingCamp({ ...editingCamp, date: e.target.value })}
                                            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Duration/Time"
                                            value={editingCamp.time}
                                            onChange={(e) => setEditingCamp({ ...editingCamp, time: e.target.value })}
                                            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                        <textarea
                                            placeholder="Description"
                                            value={editingCamp.description}
                                            onChange={(e) => setEditingCamp({ ...editingCamp, description: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
                                            rows="3"
                                        />

                                        <input
                                            type="text"
                                            placeholder="Price *"
                                            value={newCamp.price}
                                            onChange={(e) => setNewCamp({ ...editingCamp, price: e.target.value })}
                                            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <button
                                            onClick={() => setEditingCamp(null)}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdateCamp}
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

        
                {/* Camps Display */}
                <div className="grid gap-8">
                    {camps.map(camp => (
                        <div key={camp.id} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <div className="flex items-start justify-between">
                                        <h3 className="text-2xl font-bold mb-3 text-orange-600">{camp.title}</h3>
                                        {isAdmin && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditCamp(camp)}
                                                    className="text-blue-600 hover:text-blue-800 p-1"
                                                    title="Edit camp"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCamp(camp.id)}
                                                    className="text-red-600 hover:text-red-800 p-1"
                                                    title="Delete camp"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
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
                                            <p className="font-semibold">Date</p>
                                            <p className="text-sm text-gray-600">{formatDate(camp.date)}</p>
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
                                    onClick={() =>navigate('/contact')}
                                    className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold">
                                        Contact Now to Register
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {camps.length === 0 && (
                    <div className="text-center py-12">
                        <Sun className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Summer Camps Yet</h3>
                        <p className="text-gray-500">
                            {isAdmin ? "Add your first summer camp to get started!" : "Check back soon for exciting summer programs!"}
                        </p>
                    </div>
                )}

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

export default ManageSummerCamp;