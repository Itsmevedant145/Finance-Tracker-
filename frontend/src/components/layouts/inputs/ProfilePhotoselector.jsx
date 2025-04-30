import React from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';
import './ProfilePhotoselector.css'; // Assuming you have a CSS file for styling
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
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  
  return (
    <div className="profilephotoselector">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!imagePreview ? (
        <div className="profilephotoselector__container" onClick={onChooseFile}>
          <LuUser size={40} className="profilephotoselector__icon" />
          <span className="profilephotoselector__text">Choose a profile picture</span>
          <LuUpload size={20} className="profilephotoselector__upload" />
        </div>
      ) : (
        <div className="profilephotoselector__preview">
          <img
            src={imagePreview}
            alt="Preview"
            className="profilephotoselector__image"
            onClick={onChooseFile}
          />
          <LuTrash
            size={20}
            className="profilephotoselector__remove"
            onClick={handleRemoveImage}
          />
        </div>
      )}
    </div>
  );
}

export default ProfilePhotoselector;
