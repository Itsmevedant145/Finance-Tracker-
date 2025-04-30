import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import './Inputs.css';

function Inputs({ value, placeholder, label, type, onChange }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  const handleBlur = () => {
    setIsFocused(false);
  };
  
  return (
    <div className="input-container">
      <label>{label}</label>
      <div className={`inputbox ${isFocused ? 'focused' : ''}`}>
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'off'}
        />
        {type === 'password' && (
          <div className="eye-icon" onClick={toggleShowPassword}>
            {showPassword ? (
              <FaRegEye
                size={20}
                className="eye"
                aria-label="Hide password"
              />
            ) : (
              <FaRegEyeSlash
                size={20}
                className="eye"
                aria-label="Show password"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Inputs;