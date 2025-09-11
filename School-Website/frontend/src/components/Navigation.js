import React, { useState } from 'react';
import { Home, BookOpen, Users, Image, Phone, Calendar, Sun, Menu, X, GraduationCap } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navigation = ({ isLoggedIn, user, handleLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const isAdmin = user?.role === 'admin';

    const navigationItems = [
        { id: 'home', label: 'Home', icon: Home, path: '/home', roles: ['user', 'admin'] },
        { id: 'about', label: 'About', icon: BookOpen, path: '/about', roles: ['user', 'admin'] },
        { id: 'academics', label: 'Academics', icon: GraduationCap, path: '/academics', roles: ['user', 'admin'] },
        { id: 'admissions', label: 'Admissions', icon: Users, path: '/admission', roles: ['user', 'admin'] },
        { id: 'events', label: 'Events', icon: Calendar, path: '/events', roles: ['user', 'admin'], dropdown: true },
        { id: 'summer-camp', label: 'Summer Camp', icon: Sun, path: '/summercamp', roles: ['user', 'admin'] },
        { id: 'gallery', label: 'Gallery', icon: Image, path: '/gallery', roles: ['user', 'admin'] },
        { id: 'contact', label: 'Contact', icon: Phone, path: '/contact', roles: ['user', 'admin'] },
    ];

    // Filter menu items based on user role
    const filteredItems = navigationItems.filter(item => !user || item.roles.includes(user?.role));

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-800">Treetop Academy</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navigationItems.map(item => {
                            // Show item if user is null (guest) or has role included
                            if (!user || item.roles.includes(user.role)) {
                                // Admin dropdown for Events
                                if (item.id === 'events' && item.dropdown === true) {
                                    return (
                                        <div key={item.id} className="relative">
                                            <button
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-700"
                                            >
                                                <item.icon className="w-4 h-4" />
                                                <span>{item.label}</span>
                                            </button>
                                            {isDropdownOpen && (
                                                <div className="absolute top-full mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                                                    <NavLink
                                                        to="/events"
                                                        className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                                                    >
                                                        View Events
                                                    </NavLink>
                                                    <NavLink
                                                        to="/admin/events"
                                                        className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                                                    >
                                                        Manage Events
                                                    </NavLink>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                // Normal menu item
                                return (
                                    <NavLink
                                        key={item.id}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-700'
                                            }`
                                        }
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </NavLink>
                                );
                            }
                            return null; // hide items that the user shouldn’t see
                        })}

                        {/* User / Logout Buttons */}
                        {isLoggedIn ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600">Hello, {user?.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate('/profile')}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Profile
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        {filteredItems.map(item => (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-2 w-full px-4 py-2 text-left ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50'
                                    }`
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}

                        {/* Admin dropdown links for mobile */}
                        {user?.role === 'admin' && (
                            <div className="mt-2">
                                <NavLink
                                    to="/events"
                                    className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    View Events
                                </NavLink>
                                <NavLink
                                    to="/admin/events"
                                    className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Manage Events
                                </NavLink>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
