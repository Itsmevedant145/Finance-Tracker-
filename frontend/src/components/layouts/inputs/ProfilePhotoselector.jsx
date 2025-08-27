import React from 'react';
import { User, Upload, X, Camera } from 'lucide-react';

function ProfilePhotoselector({ image, setImage }) {
  const inputRef = React.useRef(null);
  const [imagePreview, setImagePreview] = React.useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    // Clear the input value to allow re-selecting the same file
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!imagePreview ? (
        <button
          type="button"
          onClick={onChooseFile}
          className="group relative w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-2xl border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-all duration-300 flex flex-col items-center justify-center gap-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <User className="w-8 h-8 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-500 hover:bg-indigo-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-200">
            <Upload className="w-3 h-3 text-white" />
          </div>
          <span className="sr-only">Choose profile picture</span>
        </button>
      ) : (
        <div className="relative group">
          <button
            type="button"
            onClick={onChooseFile}
            className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-300 hover:border-indigo-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:scale-105"
          >
            <img
              src={imagePreview}
              alt="Profile preview"
              className="w-full h-full object-cover transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </button>
          
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Remove profile picture"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilePhotoselector;