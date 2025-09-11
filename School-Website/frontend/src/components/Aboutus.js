import React from 'react';
import { BookOpen, Users, Star } from 'lucide-react';

const Aboutus = () => {
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Treetop Academy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Established in 1985, Treetop Academy has been a beacon of educational excellence, 
            nurturing young minds and building tomorrow's leaders.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              To provide a comprehensive education that develops intellectual curiosity, critical thinking, 
              creativity, and strong moral character in our students. We strive to create a supportive 
              environment where every child can reach their full potential.
            </p>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-600">
              To be the leading educational institution that prepares students for success in an 
              ever-changing world by fostering innovation, collaboration, and lifelong learning.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Quick Facts</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold">Established:</span>
                <span>1985</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Students:</span>
                <span>1,200+</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Faculty:</span>
                <span>80+ Expert Teachers</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Campus Size:</span>
                <span>25 Acres</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Grades:</span>
                <span>Nursery - Grade 12</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Accreditation:</span>
                <span>NEASC, IB</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Academic Excellence</h3>
              <p className="text-gray-600">Commitment to high academic standards and continuous improvement.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Community</h3>
              <p className="text-gray-600">Building strong relationships and fostering a sense of belonging.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Character</h3>
              <p className="text-gray-600">Developing integrity, responsibility, and ethical leadership.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;