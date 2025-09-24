import React from 'react';
import { BookOpen, Users, Calendar, Sun, ChevronRight, Award, Star } from 'lucide-react';
import { useNavigate,Link } from 'react-router-dom';

const Home = ({ setCurrentPage }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <div className="relative bg-cover bg-center text-white" style={{ backgroundImage: "url('/Images/School-Image.jpg')" }}>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">Placeholder Academy</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Nurturing minds, building futures, and inspiring excellence in every student
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/admission')}
                className="bg-yellow-500 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-colors transform hover:scale-105"
              >
                Apply Now
              </button>
              <button
                onClick={() => navigate('/about')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-700 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Placeholder Academy?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Excellence in Education</h3>
              <p className="text-gray-600">Award-winning curriculum designed to challenge and inspire students at every level.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Expert Faculty</h3>
              <p className="text-gray-600">Dedicated teachers with advanced degrees and passion for student success.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <Star className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Holistic Development</h3>
              <p className="text-gray-600">Focus on academics, arts, sports, and character building for well-rounded growth.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Access</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { path: '/academics', title: 'Academics', icon: BookOpen, color: 'bg-blue-500' },
              { path: '/admissions', title: 'Admissions', icon: Users, color: 'bg-green-500' },
              { path: '/events', title: 'Events', icon: Calendar, color: 'bg-purple-500' },
              { path: '/summer-camp', title: 'Summer Camp', icon: Sun, color: 'bg-orange-500' }
            ].map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`${item.color} text-white p-6 rounded-xl hover:opacity-90 transition-opacity transform hover:scale-105`}
              >
                <item.icon className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <ChevronRight className="w-5 h-5 mx-auto mt-2" />
              </Link>

            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;