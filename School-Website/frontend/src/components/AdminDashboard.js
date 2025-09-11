import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import { Calendar, Image, Users, Settings, Activity, FileText, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalImages: 0,
    totalUsers: 0,
    upcomingEvents: 0
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch events
      const eventsRes = await fetch('http://localhost:5000/events', {
        credentials: 'include'
      });
      const events = await eventsRes.json();
      
      // Fetch gallery
      const galleryRes = await fetch('http://localhost:5000/gallery', {
        credentials: 'include'
      });
      const gallery = await galleryRes.json();

      // Calculate upcoming events
      const now = new Date();
      const upcoming = events.filter(event => new Date(event.event_date) > now).length;

      setStats({
        totalEvents: events.length,
        totalImages: gallery.length,
        totalUsers: 0, // This would require a separate endpoint
        upcomingEvents: upcoming
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Manage Events',
      description: 'Create, edit, and delete school events',
      icon: Calendar,
      link: '/admin/events',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      stat: stats.totalEvents,
      statLabel: 'Total Events'
    },
    {
      title: 'Manage Gallery',
      description: 'Upload and manage school images',
      icon: Image,
      link: '/admin/gallery',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      stat: stats.totalImages,
      statLabel: 'Total Images'
    },
    {
      title: 'User Management',
      description: 'Manage user roles and permissions',
      icon: Users,
      link: '/admin/users',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      stat: stats.totalUsers,
      statLabel: 'Total Users'
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: Settings,
      link: '/admin/settings',
      color: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600',
      stat: '—',
      statLabel: 'Settings'
    }
  ];

  const quickStats = [
    {
      label: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: Calendar,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'Recent Images',
      value: stats.totalImages,
      icon: Image,
      color: 'text-green-600 bg-green-100'
    },
    {
      label: 'System Status',
      value: 'Active',
      icon: Activity,
      color: 'text-emerald-600 bg-emerald-100'
    },
    {
      label: 'Reports',
      value: 'View',
      icon: BarChart3,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last login</div>
              <div className="font-semibold text-gray-800">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className={`block ${card.color} ${card.hoverColor} text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p className="text-white/90 text-sm">{card.description}</p>
                </div>
                <card.icon className="w-8 h-8 text-white/80" />
              </div>
              <div className="flex items-center justify-between mt-6">
                <div>
                  <div className="text-2xl font-bold">{card.stat}</div>
                  <div className="text-white/80 text-sm">{card.statLabel}</div>
                </div>
                <div className="text-white/60">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FileText className="w-6 h-6 mr-2" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-800">Event Management System</p>
                <p className="text-sm text-gray-600">Ready for managing school events</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Image className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-800">Gallery Management System</p>
                <p className="text-sm text-gray-600">Ready for managing school images</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-purple-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-800">Role-Based Access Control</p>
                <p className="text-sm text-gray-600">Admin, Teacher, and Student roles configured</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalEvents}</div>
              <div className="text-gray-600">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.totalImages}</div>
              <div className="text-gray-600">Gallery Images</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.upcomingEvents}</div>
              <div className="text-gray-600">Upcoming Events</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/events"
              className="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-colors text-center"
            >
              <Calendar className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold">Add Event</div>
            </Link>
            <Link
              to="/admin/gallery"
              className="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-colors text-center"
            >
              <Image className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold">Upload Images</div>
            </Link>
            <Link
              to="/admin/settings"
              className="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-colors text-center"
            >
              <Settings className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold">System Settings</div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500">
          <p>&copy; 2024 Excellence Academy Admin Panel. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;