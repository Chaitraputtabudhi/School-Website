import React, { useState, useEffect } from "react";
import Header from "./Header";


function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
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
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setMessage("Error loading gallery images");
    } finally {
      setLoading(false);
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
      const response = await fetch("http://localhost:5000/gallery", {
        method: "POST",
        credentials: "include",
        body: formData
      });

      if (response.ok) {
        setMessage(`Successfully uploaded ${selectedFiles.length} image(s)!`);
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

  const handleDelete = async (imageId, imagePath) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch(`http://localhost:5000/gallery/${imageId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        setMessage("Image deleted successfully!");
        fetchImages();
      } else {
        const data = await response.json();
        setMessage(data.error || "Error deleting image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      setMessage("Error deleting image");
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div>
        {/* <Navigation /> */}
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl">Loading gallery...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navigation /> */}
      
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
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg"
            >
              📸 Upload Images
            </button>
          )}
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes('success') || message.includes('Successfully')
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message}
            <button 
              onClick={() => setMessage('')}
              className="float-right text-lg font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <div className="text-center">
            <span className="text-2xl font-bold text-gray-800">{images.length}</span>
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
                    src={`http://localhost:5000/${image.file_path}`}
                    alt={image.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE5MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlmYTZiNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                  
                  {/* Admin Controls */}
                  {isAdmin && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDelete(image.id, image.file_path)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        title="Delete Image"
                      >
                        🗑️
                      </button>
                    </div>
                  )}

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 truncate" title={image.title}>
                    {image.title}
                  </h3>
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center mb-1">
                      <span className="mr-2">📅</span>
                      <span>{formatDate(image.uploaded_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">👤</span>
                      <span>{image.uploaded_by_name || 'Admin'}</span>
                    </div>
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
                  Supports: JPG, PNG, GIF. You can select multiple images at once.
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
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    uploading || selectedFiles.length === 0
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
                      Uploading...
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