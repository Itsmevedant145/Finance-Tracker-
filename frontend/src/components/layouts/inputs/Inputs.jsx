import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

function Inputs({ value, placeholder, label, type, onChange }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className="flex flex-col text-sm w-full mb-5">
      <label className="mb-2 text-zinc-700 font-medium tracking-wide">{label}</label>
      <div
        className={`relative flex items-center rounded-md border transition-all duration-200 bg-white ${
          isFocused
            ? 'border-blue-600 ring-1 ring-blue-500 shadow-sm'
            : 'border-zinc-300'
        }`}
      >
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full px-4 py-2 bg-transparent text-zinc-900 placeholder-zinc-500 outline-none"
          autoComplete={
            type === 'password'
              ? 'current-password'
              : type === 'email'
              ? 'email'
              : 'off'
          }
        />
        {type === 'password' && (
          <div
            className="absolute right-3 cursor-pointer text-zinc-500 hover:text-blue-600 transition-colors duration-150"
            onClick={toggleShowPassword}
          >
            {showPassword ? (
              <FaRegEye size={20} aria-label="Hide password" />
            ) : (
              <FaRegEyeSlash size={20} aria-label="Show password" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Inputs;
