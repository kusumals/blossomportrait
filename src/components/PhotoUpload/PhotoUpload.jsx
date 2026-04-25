import React, { useState } from 'react';

const PhotoUpload = ({ onImageUpload }) => {
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onImageUpload(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            dragging ? 'border-pink-400 bg-pink-50 scale-[1.01]' : 'border-pink-200 hover:border-pink-400 hover:bg-pink-50'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload" className="cursor-pointer block">
            <div className="text-6xl mb-4">{dragging ? '🌸' : '📸'}</div>
            <p className="text-gray-600 font-semibold text-lg">
              {dragging ? 'Drop it here!' : 'Choose your favourite photo'}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Drag & drop or <span className="text-pink-500 font-semibold">click to browse</span>
            </p>
            <p className="text-gray-300 text-xs mt-3">JPG, PNG, WEBP supported</p>
          </label>
        </div>
      ) : (
        <div className="text-center">
          <img
            src={preview}
            alt="Your photo"
            className="max-h-72 rounded-2xl shadow-md mx-auto object-cover"
          />
          <p className="text-green-500 font-semibold mt-4">✓ Looking great!</p>
          <label
            htmlFor="photo-upload"
            className="text-sm text-pink-500 hover:underline cursor-pointer mt-1 block"
          >
            Choose a different photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="photo-upload"
          />
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
