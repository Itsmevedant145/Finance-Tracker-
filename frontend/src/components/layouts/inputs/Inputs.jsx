import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function Inputs({ value, placeholder, label, type, onChange, icon, error, hint }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;
  const hasError = error && error.length > 0;

  return (
    <div className="flex flex-col w-full">
      {/* Label */}
      <label className="mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* Input Wrapper */}
      <div
        className={`relative flex items-center rounded-xl border transition-all duration-200 bg-white ${
          hasError
            ? 'border-red-300 ring-1 ring-red-100'
            : isFocused
            ? 'border-indigo-500 ring-1 ring-indigo-100'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {/* Leading Icon */}
        {icon && (
          <div 
            className={`flex items-center justify-center w-10 h-11 transition-colors duration-200 ${
              hasError
                ? 'text-red-400'
                : isFocused
                ? 'text-indigo-600'
                : 'text-gray-400'
            }`}
          >
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`flex-1 h-11 bg-transparent text-gray-900 placeholder-gray-500 outline-none ${
            icon ? 'pl-0 pr-4' : 'px-4'
          } ${type === 'password' ? 'pr-12' : ''}`}
          autoComplete={
            type === 'password'
              ? 'current-password'
              : type === 'email'
              ? 'email'
              : 'off'
          }
          style={{
            // Hide browser's built-in password reveal button
            WebkitTextSecurity: type === 'password' && !showPassword ? 'disc' : 'none',
          }}
        />

        {/* Password Toggle */}
        {type === 'password' && value && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 p-1 text-gray-500 hover:text-indigo-600 transition-colors duration-200"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Helper Text / Error Message */}
      {(hasError || hint) && (
        <div className="mt-2">
          {hasError ? (
            <p className="text-red-600 text-sm">{error}</p>
          ) : (
            <p className="text-gray-500 text-sm">{hint}</p>
          )}
        </div>
      )}

      {/* CSS to hide browser's password reveal button */}
      <style jsx>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
        
        input[type="password"]::-webkit-credentials-auto-fill-button,
        input[type="password"]::-webkit-strong-password-auto-fill-button {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

export default Inputs;