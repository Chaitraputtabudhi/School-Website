import React from 'react';
import { BookOpen, Users, GraduationCap, Calendar } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Footer = ({ setCurrentPage }) => {
    const navigationItems = [

        { id: 'about', label: 'About', icon: BookOpen, path: '/about' },
        { id: 'academics', label: 'Academics', icon: GraduationCap, path: '/academics' },
        { id: 'admissions', label: 'Admissions', icon: Users, path: '/admission' },
        { id: 'events', label: 'Events', icon: Calendar, path: '/events' }
        
    ];
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Placeholder Academy</span>
            </div>
            <p className="text-gray-300">
              Excellence in education since 1985. Nurturing minds, building futures.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2">
              {navigationItems.map(link => (
                <NavLink
                  key={link.id}
                  to={link.path}
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Programs</h3>
            <div className="space-y-2 text-gray-300">
              <p>Early Childhood</p>
              <p>Elementary School</p>
              <p>Middle School</p>
              <p>High School</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <div className="space-y-2 text-gray-300">
              <p>📧 info@Placeholder-academy.edu</p>
              <p>📞 (555) 123-4567</p>
              <p>📍 123 Education Drive</p>
              <p>Treetop City, CA 12345</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Placeholder Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;