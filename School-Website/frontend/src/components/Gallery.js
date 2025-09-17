import React, { useState, useEffect } from "react";

function Gallery() {
  const [images, setImages] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewImages, setPreviewImages] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [user, setUser] = useState(null);

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
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched images:', data); // Debug log
        setImages(data);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setMessage("Error loading gallery images - please check your connection");
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const previews = [];

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        if (file.size <= 5 * 1024 * 1024) { // 5MB limit
          validFiles.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            previews.push({
              file: file,
              preview: e.target.result,
              title: file.name.split('.')[0]
            });
            if (previews.length === validFiles.length) {
              setPreviewImages(previews);
            }
          };
          reader.readAsDataURL(file);
        } else {
          setMessage(`File ${file.name} is too large. Maximum size is 5MB.`);
        }
      } else {
        setMessage(`File ${file.name} is not an image.`);
      }
    });

    setSelectedFiles(validFiles);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setMessage("Please select at least one image to upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();

    selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    previewImages.forEach(preview => {
      formData.append('titles', preview.title);
    });

    try {
      const response = await fetch("http://localhost:5000/admin/gallery", {
        method: "POST",
        credentials: "include",
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Successfully uploaded ${data.files.length} image(s)!`);
        fetchImages();
        handleCloseModal();
      } else {
        const data = await response.json();
        setMessage(data.error || "Error uploading images");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      setMessage("Error uploading images");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm(`Are you sure you want to delete image ${imageId}?`)) {
      console.log('🗑️ DELETE CANCELLED BY USER');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/admin/gallery/${imageId}`, {
        method: "DELETE",
        credentials: "include"
      });

      console.log('Delete response status:', response.status); // Debug log
      console.log('Delete response headers:', response.headers); // Debug headers
      const data = await response.json();
      if (response.ok) {

        console.log('Delete success response:', data);
        setMessage("Image deleted successfully!");
        fetchImages();
      } else {
        setMessage(`❌ Delete failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Network error deleting image:", error);
      setMessage(`Network error while deleting image: ${error.message}`);
    }
  };
  const handleEditTitle = async (imageId, newTitle) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/gallery/${imageId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle })
      });

      console.log('Edit response status:', response.status); // Debug log
      const data = await response.json();
      if (response.ok) {
        console.log('Edit success response:', data);
        setMessage("Image title updated successfully!");
        setEditingImage(null);
        setEditTitle('');
        fetchImages();
      } else {
        const errorText = await response.text();
        console.error('Edit error response:', errorText);
        console.error('Edit response status:', response.status);
        console.error('Edit response statusText:', response.statusText);
        setMessage(`❌ Edit failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Network error updating image title:", error);
      setMessage(`Network error while updating image title: ${error.message}`);
    }
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    setSelectedFiles([]);
    setPreviewImages([]);
  };

  const updatePreviewTitle = (index, newTitle) => {
    const updatedPreviews = [...previewImages];
    updatedPreviews[index].title = newTitle;
    setPreviewImages(updatedPreviews);
  };

  const startEditing = (image) => {
    setEditingImage(image.id);
    setEditTitle(image.title);
  };

  const cancelEditing = () => {
    setEditingImage(null);
    setEditTitle('');
  };

  const isAdmin = user?.emprole?.toLowerCase() === 'admin';

  // Debug logging
  console.log('Gallery - user prop:', user);
  console.log('Gallery - user.emprole:', user?.emprole);
  console.log('Gallery - isAdmin:', isAdmin);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">School Gallery</h1>
            <p className="text-gray-600">Capturing memories and moments from our school community</p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg flex items-center space-x-2"
            >
              <span>📸</span>
              <span>Upload Images</span>
            </button>
          )}
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${message.includes('success') || message.includes('Successfully')
            ? 'bg-green-100 border border-green-400 text-green-700'
            : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
            {message}
            <button
              onClick={() => setMessage('')}
              className="float-right text-lg font-bold hover:opacity-70"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="text-center">
            <span className="text-3xl font-bold text-gray-800">{images.length}</span>
            <span className="text-gray-600 ml-2">
              {images.length === 1 ? 'Image' : 'Images'} in Gallery
            </span>
          </div>
        </div>

        {/* Gallery Grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div key={image.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative">
                  <img
                    src={`http://localhost:5000/gallery/image/${image.id}`}
                    alt={image.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      ID: {image.id}
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
                            className={`flex-1 py-2 rounded ${isAdmin
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
                            className={`flex-1 py-2 rounded ${isAdmin
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🖼️</div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No images in gallery</h3>
            <p className="text-gray-500 mb-6">
              The gallery is empty. {isAdmin ? "Upload some images to get started!" : "Check back later for new images."}
            </p>
            {isAdmin && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Upload First Images
              </button>
            )}
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Upload Images to Gallery</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  disabled={uploading}
                >
                  ×
                </button>
              </div>

              {/* File Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Images (Max 5MB each)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  disabled={uploading}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Supports: JPG, PNG, GIF, WebP. You can select multiple images at once.
                </p>
              </div>

              {/* Image Previews */}
              {previewImages.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Preview & Edit Titles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <img
                          src={preview.preview}
                          alt="Preview"
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                        <input
                          type="text"
                          value={preview.title}
                          onChange={(e) => updatePreviewTitle(index, e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500"
                          placeholder="Enter image title"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Controls */}
              <div className="flex gap-4">
                <button
                  onClick={handleUpload}
                  disabled={uploading || selectedFiles.length === 0}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${uploading || selectedFiles.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading to Database...
                    </span>
                  ) : (
                    `Upload ${selectedFiles.length} Image${selectedFiles.length !== 1 ? 's' : ''}`
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={uploading}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery;