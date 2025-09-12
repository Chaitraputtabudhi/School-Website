// pages/AdmissionsPage.js
import React from 'react';

const AdmissionsPage = () => {
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Admissions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join the Brightwood Academy family! We welcome students who are eager to learn and grow.
          </p>
        </div>
        
        {/* Admission Periods */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-6">Admission Periods 2025-2026</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-blue-200 p-6 rounded-lg bg-blue-50">
              <h3 className="font-bold text-lg mb-3 text-blue-800">Early Childhood</h3>
              <div className="space-y-2">
                <p><span className="font-semibold">Nursery:</span> Ages 3-4</p>
                <p><span className="font-semibold">Pre-K:</span> Ages 4-5</p>
                <p><span className="font-semibold">Kindergarten:</span> Ages 5-6</p>
                <div className="mt-4 p-3 bg-blue-100 rounded">
                  <p className="font-semibold text-blue-800">Application Opens:</p>
                  <p>November 1, 2024</p>
                  <p className="font-semibold text-blue-800 mt-2">Deadline:</p>
                  <p>February 15, 2025</p>
                </div>
              </div>
            </div>
            
            <div className="border border-green-200 p-6 rounded-lg bg-green-50">
              <h3 className="font-bold text-lg mb-3 text-green-800">Elementary School</h3>
              <div className="space-y-2">
                <p><span className="font-semibold">Grades:</span> 1-5</p>
                <p><span className="font-semibold">Ages:</span> 6-11</p>
                <div className="mt-4 p-3 bg-green-100 rounded">
                  <p className="font-semibold text-green-800">Application Opens:</p>
                  <p>October 15, 2024</p>
                  <p className="font-semibold text-green-800 mt-2">Deadline:</p>
                  <p>January 31, 2025</p>
                </div>
              </div>
            </div>
            
            <div className="border border-purple-200 p-6 rounded-lg bg-purple-50">
              <h3 className="font-bold text-lg mb-3 text-purple-800">Secondary School</h3>
              <div className="space-y-2">
                <p><span className="font-semibold">Middle School:</span> Grades 6-8</p>
                <p><span className="font-semibold">High School:</span> Grades 9-12</p>
                <div className="mt-4 p-3 bg-purple-100 rounded">
                  <p className="font-semibold text-purple-800">Application Opens:</p>
                  <p>September 1, 2024</p>
                  <p className="font-semibold text-purple-800 mt-2">Deadline:</p>
                  <p>January 15, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Application Process */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-6">Application Process</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Required Documents</h3>
              <div className="space-y-3">
                {[
                  'Completed Application Form',
                  'Birth Certificate',
                  'Previous School Records',
                  'Immunization Records',
                  'Parent/Guardian ID',
                  'Passport Photos (2)',
                  'Application Fee Receipt'
                ].map(doc => (
                  <div key={doc} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Steps to Apply</h3>
              <div className="space-y-4">
                {[
                  { step: 1, text: 'Submit Online Application' },
                  { step: 2, text: 'Pay Application Fee' },
                  { step: 3, text: 'Submit Required Documents' },
                  { step: 4, text: 'Attend Assessment/Interview' },
                  { step: 5, text: 'Receive Admission Decision' },
                  { step: 6, text: 'Complete Enrollment' }
                ].map(item => (
                  <div key={item.step} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Fees and Financial Aid */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Tuition Fees 2025-2026</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span>Nursery - Pre-K</span>
                <span className="font-semibold">$12,000/year</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Elementary (Grades 1-5)</span>
                <span className="font-semibold">$15,000/year</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Middle School (Grades 6-8)</span>
                <span className="font-semibold">$18,000/year</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>High School (Grades 9-12)</span>
                <span className="font-semibold">$22,000/year</span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm text-gray-600">
                <span>Application Fee</span>
                <span>$200 (non-refundable)</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Financial Aid</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                We believe every qualified student deserves access to excellent education. 
                Our financial aid program supports families based on demonstrated need.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Available Aid</h3>
                <ul className="space-y-1 text-blue-700">
                  <li>• Need-based scholarships</li>
                  <li>• Merit scholarships</li>
                  <li>• Payment plans</li>
                  <li>• Sibling discounts</li>
                </ul>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Apply for Financial Aid
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionsPage;