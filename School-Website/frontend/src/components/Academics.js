// import React from "react";
// import TeachingApproach from "./TeachingApproach";
// import Header from "./Header";

// function Academics() {
//   return (
//     <div>
//       <section className="flex overflow-hidden flex-col items-center px-20 pt-12 pb-52 w-full bg-white max-md:px-5 max-md:pb-24 max-md:max-w-full">
//         <h2 className="text-2xl text-center text-black">Academics</h2>
//         <p className="mt-4 text-base text-center text-black">
//           Explore our curriculum, departments, and learning philosophy
//         </p>
//         <div className="self-stretch mt-7 mb-0 max-md:mb-2.5 max-md:max-w-full">
//           <div className="flex gap-5 max-md:flex-col">
//             <div className="w-6/12 max-md:ml-0 max-md:w-full">
//               <img
//                 src="https://api.builder.io/api/v1/image/assets/55109cdc79e444868b7098cdc4cd42ee/7eab2d02b6dc533c5a943bf2862cdf49351eb5a6?placeholderIfAbsent=true"
//                 className="object-contain grow w-full aspect-[1.29] max-md:mt-10 max-md:max-w-full"
//                 alt="Teaching approach"
//               />
//             </div>
//             <div className="ml-5 w-6/12 max-md:ml-0 max-md:w-full">
//               <TeachingApproach />
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

// export default Academics;

// pages/AcademicsPage.js
import React from 'react';
import { 
  ChevronRight,
  Award,
  BookOpen,
  GraduationCap
} from 'lucide-react';

const AcademicsPage = () => {
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Academic Excellence</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive curriculum is designed to challenge, inspire, and prepare students for future success.
          </p>
        </div>
        
        {/* Curriculum Overview */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-6">Our Curriculum</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Early Years', grades: 'Nursery - KG2', color: 'bg-pink-500' },
              { title: 'Elementary', grades: 'Grades 1-5', color: 'bg-blue-500' },
              { title: 'Middle School', grades: 'Grades 6-8', color: 'bg-green-500' },
              { title: 'High School', grades: 'Grades 9-12', color: 'bg-purple-500' }
            ].map(level => (
              <div key={level.title} className={`${level.color} text-white p-6 rounded-lg text-center`}>
                <h3 className="font-bold text-lg mb-2">{level.title}</h3>
                <p>{level.grades}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Departments */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Academic Departments</h2>
            <div className="space-y-4">
              {[
                'Mathematics & Science',
                'Language Arts & Literature',
                'Social Studies & History',
                'World Languages',
                'Arts & Music',
                'Physical Education',
                'Computer Science',
                'Life Skills'
              ].map(dept => (
                <div key={dept} className="flex items-center space-x-3">
                  <ChevronRight className="w-5 h-5 text-blue-600" />
                  <span>{dept}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Learning Philosophy</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold">Student-Centered Learning</h3>
                <p className="text-gray-600">Tailored approaches to meet individual learning styles and needs.</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold">Critical Thinking</h3>
                <p className="text-gray-600">Developing analytical skills and problem-solving abilities.</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold">Global Perspective</h3>
                <p className="text-gray-600">Preparing students for an interconnected world.</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold">Innovation</h3>
                <p className="text-gray-600">Encouraging creativity and entrepreneurial thinking.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Special Programs */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Special Programs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 p-6 rounded-lg">
              <Award className="w-8 h-8 text-yellow-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">International Baccalaureate (IB)</h3>
              <p className="text-gray-600">Rigorous international curriculum for college-bound students.</p>
            </div>
            <div className="border border-gray-200 p-6 rounded-lg">
              <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Advanced Placement (AP)</h3>
              <p className="text-gray-600">College-level courses with university credit opportunities.</p>
            </div>
            <div className="border border-gray-200 p-6 rounded-lg">
              <GraduationCap className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">STEM Excellence</h3>
              <p className="text-gray-600">Focused programs in Science, Technology, Engineering, and Mathematics.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicsPage;