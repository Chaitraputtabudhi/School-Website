import React, { useState, useRef, useEffect } from 'react';
import { Home, BookOpen, Users, Image, Phone, Calendar, Sun, Menu, X, GraduationCap, Settings, Shield, BarChart3, UserPlus, Edit3 } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navigation = ({ isLoggedIn, user, handleLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEventsDropdownOpen, setIsEventsDropdownOpen] = useState(false);
    const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
    const eventsDropdownRef = useRef(null);
    const adminDropdownRef = useRef(null);
    const navigate = useNavigate();

    const isAdmin = user?.role === 'admin';

    //drop down close when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (eventsDropdownRef.current && !eventsDropdownRef.current.contains(event.target)) {
                setIsEventsDropdownOpen(false);
            }
            if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
                setIsAdminDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navigationItems = [
        { id: 'home', label: 'Home', icon: Home, path: '/home', roles: ['user', 'admin'], public: true },
        { id: 'about', label: 'About', icon: BookOpen, path: '/about', roles: ['user', 'admin'], public: true },
        { id: 'academics', label: 'Academics', icon: GraduationCap, path: '/academics', roles: ['user', 'admin'], public: true },
        { id: 'admissions', label: 'Admissions', icon: Users, path: '/admission', roles: ['user', 'admin'], public: true },
        { id: 'events', label: 'Events', icon: Calendar, path: '/events', roles: ['user', 'admin'], dropdown: true, public: true },
        { id: 'summer-camp', label: 'Summer Camp', icon: Sun, path: '/summercamp', roles: ['user', 'admin'], public: true },
        { id: 'gallery', label: 'Gallery', icon: Image, path: '/gallery', roles: ['user', 'admin'], public: true },
        { id: 'contact', label: 'Contact', icon: Phone, path: '/contact', roles: ['user', 'admin'], public: true },
    ];

    const adminItems = [
        { id: 'admin-dashboard', label: 'Dashboard', icon: BarChart3, path: '/admin/dashboard' },
        { id: 'manage-events', label: 'Manage Events', icon: Calendar, path: '/admin/events' },
        { id: 'manage-users', label: 'Manage Users', icon: UserPlus, path: '/admin/users' },
        { id: 'manage-content', label: 'Manage Content', icon: Edit3, path: '/admin/content' },
        { id: 'admin-settings', label: 'Settings', icon: Settings, path: '/admin/settings' },

    ];

    //Filter nav items based on user auth and role
    const getVisibleItems = () => {
        if (!user) {
            //guest user
            return navigationItems.filter(item => item.public);
        }
        //loggedin user
        return navigationItems.filter(item => item.roles.includes(item.role) || item.public)
    }

    const visibleItems = getVisibleItems();

    const handleEventsDropdown = (e) => {
        e.preventDefault();
        setIsAdminDropdownOpen(!isAdminDropdownOpen);
        setIsEventsDropdownOpen(false);
    };

    const handleAdminDropdown = (e) => {
        e.preventDefault();
        setIsAdminDropdownOpen(!isAdminDropdownOpen);
        setIsEventsDropdownOpen(false);
    };

    const closeAllDropdowns = (e) => {
        e.preventDefault();
        setIsAdminDropdownOpen(!isAdminDropdownOpen);
        setIsEventsDropdownOpen(false);
    };

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
                        {visibleItems.map(item => {

                            // Admin dropdown for Events
                            if (item.id === 'events' && item.dropdown) {
                                return (
                                    <div key={item.id} className="relative" ref={eventsDropdownRef}>
                                        <button
                                            onClick={handleEventsDropdown}
                                            className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-700"
                                        >
                                            <item.icon className="w-4 h-4" />
                                            <span>{item.label}</span>
                                            <svg className={`w-4 h-4 transition-transform ${isEventsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {isEventsDropdownOpen && (
                                            <div className="absolute top-full mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 py-1">
                                                <NavLink
                                                    to="/events"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                                    onClick={closeAllDropdowns}
                                                >
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    View Events
                                                </NavLink>
                                                {isAdmin && (
                                                    <>
                                                        <hr className="my-1" />
                                                        <NavLink
                                                            to="/admin/events"
                                                            className="flex items-center px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                                                            onClick={closeAllDropdowns}
                                                        >
                                                            <Settings className="w-4 h-4 mr-2" />
                                                            Manage Events
                                                        </NavLink>
                                                    </>
                                                )}

                                                {user && (
                                                    <NavLink
                                                        to="/user/events"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                                        onClick={closeAllDropdowns}
                                                    >
                                                        <Users className="w-4 h-4 mr-2" />
                                                        My Events
                                                    </NavLink>
                                                )}


                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            // Regular navigation items
                            return (
                                <NavLink
                                    key={item.id}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                                        }`
                                    }
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </NavLink>
                            );
                        })}

                        {/* Admin Panel Dropdown */}
                        {isAdmin && (
                            <div className="relative" ref={adminDropdownRef}>
                                <button
                                    onClick={handleAdminDropdown}
                                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                                >
                                    <Shield className="w-4 h-4" />
                                    <span>Admin</span>
                                    <svg className={`w-4 h-4 transition-transform ${isAdminDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isAdminDropdownOpen && (
                                    <div className="absolute top-full mt-2 w-56 bg-white shadow-lg rounded-md border border-gray-200 py-1 right-0">
                                        {adminItems.map(adminItem => (
                                            <NavLink
                                                key={adminItem.id}
                                                to={adminItem.path}
                                                className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                                                onClick={closeAllDropdowns}
                                            >
                                                <adminItem.icon className="w-4 h-4 mr-2" />
                                                {adminItem.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* User Authentication Section */}
                        {isLoggedIn ? (
                            <div className="flex items-center space-x-4 ml-4 border-l border-gray-200 pl-4">
                                <div className="flex items-center space-x-2">
                                    <div className="hidden lg:block">
                                        <span className="text-sm text-gray-600">Hello, {user?.name}</span>
                                        {isAdmin && (
                                            <span className="block text-xs text-amber-600 font-medium">Admin</span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3 ml-4 border-l border-gray-200 pl-4">
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Profile
                                </button>
                                {/* <button
                                    onClick={() => navigate('/signup')}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Sign Up
                                </button> */}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white">
                        <div className="py-4 space-y-1">
                            {visibleItems.map(item => (
                                <NavLink
                                    key={item.id}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-2 w-full px-4 py-3 text-left transition-colors ${isActive
                                            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`
                                    }
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </NavLink>
                            ))}

                            {/* Mobile Admin Section */}
                            {isAdmin && (
                                <>
                                    <div className="border-t border-gray-200 mt-4 pt-4">
                                        <div className="px-4 py-2">
                                            <span className="text-sm font-semibold text-amber-700 flex items-center">
                                                <Shield className="w-4 h-4 mr-2" />
                                                Admin Panel
                                            </span>
                                        </div>
                                        {adminItems.map(adminItem => (
                                            <NavLink
                                                key={adminItem.id}
                                                to={adminItem.path}
                                                className="flex items-center space-x-2 w-full px-6 py-2 text-left text-gray-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <adminItem.icon className="w-4 h-4" />
                                                <span>{adminItem.label}</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Mobile User Section */}
                            <div className="border-t border-gray-200 mt-4 pt-4">
                                {isLoggedIn ? (
                                    <div className="px-4 space-y-3">
                                        <div className="flex items-center space-x-3 py-2">
                                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                <span className="font-medium text-gray-600">
                                                    {user?.name?.charAt(0)?.toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-800">{user?.name}</div>
                                                {isAdmin && (
                                                    <div className="text-sm text-amber-600">Administrator</div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="px-4 space-y-2">
                                        <button
                                        
                                            onClick={() => {
                                                navigate('/profile')
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full text-gray-600 hover:text-blue-700 px-4 py-2 rounded-md text-sm font-medium border border-gray-300 hover:border-blue-300 transition-colors"
                                        >
                                            Profile
                                        </button>
                                        
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
