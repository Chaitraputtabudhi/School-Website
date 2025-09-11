import React, { useState } from 'react';
import { Home, User, BookOpen, Users, Image, Phone, Calendar, Sun, Menu, X, GraduationCap } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navigation = ({ isLoggedIn, user, handleLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const navigationItems = [
        { id: 'home', label: 'Home', icon: Home, path: '/home' },
        { id: 'about', label: 'About', icon: BookOpen, path: '/about' },
        { id: 'academics', label: 'Academics', icon: GraduationCap, path: '/academics' },
        { id: 'admissions', label: 'Admissions', icon: Users, path: '/admission' },
        { id: 'events', label: 'Events', icon: Calendar, path: '/events' },
        { id: 'summer-camp', label: 'Summer Camp', icon: Sun, path: '/summercamp' },
        { id: 'gallery', label: 'Gallery', icon: Image, path: '/gallery' },
        { id: 'contact', label: 'Contact', icon: Phone, path: '/contact' }
    ];

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-800">Treetop Academy</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navigationItems.map(item => (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-700'
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}

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
                            <div className="relative">
                                <button
                                    // onClick={() => setMenuOpen(!menuOpen)}
                                    onClick={() => navigate('/profile')}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Profile
                                </button>

                                {/* {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                                        <button
                                            onClick={() => navigate('/login')}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            Login
                                        </button>
                                        <button
                                            onClick={() => navigate('/signup')}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            Register
                                        </button>
                                    </div>
                                )} */}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        {navigationItems.map(item => (
                            <NavLink
                                key={item.id}
                                to={item.path} //navigate via router
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
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;