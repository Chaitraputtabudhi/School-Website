// pages/GalleryPage.js
import React, { useState } from 'react';
import { Image, Camera, X } from 'lucide-react';

const Gallery = ({ user, gallery=[], addToGallery, removeFromGallery }) => {
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleAddImage = (e) => {
    e.preventDefault();
    if (newImageUrl) {
      addToGallery(newImageUrl);
      setNewImageUrl('');
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <Image className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">School Gallery</h1>
          <p className="text-xl text-gray-600">
            Capturing memories and moments from our vibrant school community
          </p>
        </div>
        
        {/* Add Image Form (for admin) */}
        {user?.role === 'admin' && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Add New Image</h2>
            <form onSubmit={handleAddImage} className="flex gap-4">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Add Image</span>
              </button>
            </form>
          </div>
        )}
        
        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map(image => (
            <div key={image.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-64 object-cover"
                />
                {user?.role === 'admin' && (
                  <button
                    onClick={() => removeFromGallery(image.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;