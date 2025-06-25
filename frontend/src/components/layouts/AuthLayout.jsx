import React from 'react';
import image1 from '../../assets/images/image1.jpg';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-500">
      {/* Left side - Content */}
      <div className="w-1/2 flex items-center justify-center bg-white bg-opacity-90">
        <div className="w-11/12 max-w-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Expense Tracker</h2>
          
          {/* Children content (login/signup forms) */}
          <div className="w-full">{children}</div>
        </div>
      </div>
      
      {/* Right side - Image with decorative elements */}
      <div className="w-1/2 bg-gray-100 relative flex items-center justify-center">
        {/* Call-to-action box in top right corner */}
        <div className="absolute top-8 right-16 bg-black bg-opacity-80 text-white py-3 px-6 rounded-lg shadow-lg flex items-center z-10">
          <span className="text-2xl font-bold text-blue-400 mr-3">$</span>
          <span className="font-semibold text-lg">Track Your Expenses</span>
        </div>
        
        {/* Image container with your existing image */}
        <div className="w-3/4 h-3/5 rounded-lg overflow-hidden shadow-xl z-10">
          <img src={image1} alt="Expense Tracker" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
