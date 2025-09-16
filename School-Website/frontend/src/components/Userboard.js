import React, { useState, useEffect } from "react";

function Gallery() {
  const [images, setImages] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [editingImage, setEditingImage] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      console.log('🔍 CURRENT USER:', parsedUser);
      console.log('🔍 USER EMPROLE:', parsedUser?.emprole);
      console.log('🔍 IS ADMIN?:', parsedUser?.emprole?.toLowerCase() === 'admin');
    }
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch("http://localhost:5000/gallery", {
        credentials: "include"
      });
      if (response.ok) {
        const data = await response.json();
        setImages(data);
        console.log('📸 LOADED IMAGES:', data.length);
      }
    } catch (error) {
      console.error("❌ Error fetching images:", error);
    }
  };

  const testAdminAccess = async () => {
    console.log('🧪 TESTING ADMIN ACCESS...');
    try {
      const response = await fetch('http://localhost:5000/admin-only-test', {
        credentials: 'include'
      });
      console.log('🧪 Admin test status:', response.status);
      const data = await response.json();
      console.log('🧪 Admin test response:', data);
      setMessage(`Admin test: ${response.status === 200 ? 'SUCCESS' : 'FAILED'} - ${JSON.stringify(data)}`);
    } catch (error) {
      console.error('🧪 Admin test error:', error);
      setMessage(`Admin test error: ${error.message}`);
    }
  };

  const handleDelete = async (imageId) => {
    console.log('🗑️ ATTEMPTING DELETE FOR IMAGE:', imageId);
    
    if (!window.confirm(`Are you sure you want to delete image ${imageId}?`)) {
      console.log('🗑️ DELETE CANCELLED BY USER');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/admin/gallery/${imageId}`, {
        method: "DELETE",
        credentials: "include"
      });

      console.log('🗑️ DELETE RESPONSE STATUS:', response.status);
      const data = await response.json();
      console.log('🗑️ DELETE RESPONSE DATA:', data);

      if (response.ok) {
        setMessage(`✅ Image ${imageId} deleted successfully!`);
        fetchImages(); // Reload images
      } else {
        setMessage(`❌ Delete failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("🗑️ DELETE ERROR:", error);
      setMessage(`❌ Delete error: ${error.message}`);
    }
  };

  const handleEditTitle = async (imageId, newTitle) => {
    console.log('✏️ ATTEMPTING TITLE UPDATE:', imageId, newTitle);

    try {
      const response = await fetch(`http://localhost:5000/admin/gallery/${imageId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle })
      });

      console.log('✏️ EDIT RESPONSE STATUS:', response.status);
      const data = await response.json();
      console.log('✏️ EDIT RESPONSE DATA:', data);

      if (response.ok) {
        setMessage(`✅ Title updated for image ${imageId}!`);
        setEditingImage(null);
        setEditTitle('');
        fetchImages(); // Reload images
      } else {
        setMessage(`❌ Edit failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("✏️ EDIT ERROR:", error);
      setMessage(`❌ Edit error: ${error.message}`);
    }
  };

  const startEditing = (image) => {
    console.log('✏️ STARTING EDIT FOR:', image.id, image.title);
    setEditingImage(image.id);
    setEditTitle(image.title);
  };

  const cancelEditing = () => {
    console.log('✏️ CANCELLING EDIT');
    setEditingImage(null);
    setEditTitle('');
  };

  const isAdmin = user?.emprole?.toLowerCase() === 'admin';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        

        {/* MESSAGE DISPLAY */}
        {message && (
          <div className="bg-white border-l-4 border-blue-500 p-4 mb-6 rounded shadow">
            <p className="font-mono text-sm">{message}</p>
            <button 
              onClick={() => setMessage('')}
              className="mt-2 text-red-500 hover:text-red-700"
            >
              ✕ Clear
            </button>
          </div>
        )}

        <h1 className="text-4xl font-bold mb-8">Gallery Debug Mode</h1>

        {/* IMAGES GRID */}
        {images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div key={image.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={`http://localhost:5000/gallery/image/${image.id}`}
                    alt={image.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* ALWAYS SHOW ADMIN CONTROLS FOR DEBUGGING */}
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      ID: {image.id}
                    </div>
                  </div>
                </div>

                {/* IMAGE INFO */}
                <div className="p-4">
                  {editingImage === image.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter new title"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditTitle(image.id, editTitle)}
                          className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
                        >
                          💾 Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-bold text-lg mb-2">{image.title}</h3>
                      <div className="text-sm text-gray-600 mb-4">
                        <div>Size: {(image.file_size / 1024).toFixed(1)} KB</div>
                        <div>By: {image.uploaded_by_name || 'Unknown'}</div>
                      </div>
                      
                      {/* CONTROL BUTTONS - ALWAYS SHOW FOR DEBUGGING */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            console.log('🔘 EDIT BUTTON CLICKED FOR IMAGE:', image.id);
                            startEditing(image);
                          }}
                          className={`flex-1 py-2 rounded ${
                            isAdmin 
                              ? 'bg-blue-500 text-white hover:bg-blue-600' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={!isAdmin}
                        >
                          ✏️ Edit {!isAdmin && '(Not Admin)'}
                        </button>
                        
                        <button
                          onClick={() => {
                            console.log('🔘 DELETE BUTTON CLICKED FOR IMAGE:', image.id);
                            handleDelete(image.id);
                          }}
                          className={`flex-1 py-2 rounded ${
                            isAdmin 
                              ? 'bg-red-500 text-white hover:bg-red-600' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={!isAdmin}
                        >
                          🗑️ Delete {!isAdmin && '(Not Admin)'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl text-gray-600">No images found</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery;