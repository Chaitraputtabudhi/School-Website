// import React from "react";
// import Header from "./Header";

// function Aboutus() {
//   return (
//     <div>
//     <Header />
//     <section className="flex overflow-hidden flex-col items-center px-20 py-40 w-full bg-white max-md:px-5 max-md:py-24 max-md:max-w-full">
      
//       <h2 className="text-2xl text-center text-black">
//         "Shaping Bright Futures Since 1990"
//       </h2>
//       <p className="mt-2 text-base text-center text-black">
//         A place where curiosity meets knowledge.
//       </p>
//       <div className="self-end mt-12 mb-0 w-full max-w-[1210px] max-md:mt-10 max-md:mb-2.5 max-md:max-w-full">
//         <div className="flex gap-5 max-md:flex-col">
//           <div className="w-6/12 max-md:ml-0 max-md:w-full">
//             <div className="self-stretch my-auto max-md:mt-10 max-md:max-w-full">
//               <h3 className="text-2xl text-black max-md:mr-1 max-md:max-w-full">
//                 Learn More About Our Work And Our Cultural Activities
//               </h3>
//               <p className="mt-14 text-base text-black max-md:mt-10 max-md:max-w-full ">
//                 At XYZ School, we follow the International Montessori Method,
//                 which emphasizes hands-on, child-centered learning. Our approach
//                 encourages children to learn at their own pace, fostering
//                 independence, curiosity, and a lifelong love for learning. By
//                 providing an environment rich in educational materials and
//                 guided by experienced educators, we support the holistic
//                 development of every child.
//               </p>
//             </div>
//           </div>
//           <div className="ml-5 w-6/12 max-md:ml-0 max-md:w-full">
//             <img
//               src="https://api.builder.io/api/v1/image/assets/55109cdc79e444868b7098cdc4cd42ee/8621d4260db04ecbcad7e858ed8cc91e3e79e92f?placeholderIfAbsent=true"
//               className="object-contain grow w-full aspect-[1.39] max-md:mt-10 max-md:max-w-full"
//               alt="School activities"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//     </div>
//   );
// }

// export default Aboutus;

// pages/AboutPage.js
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