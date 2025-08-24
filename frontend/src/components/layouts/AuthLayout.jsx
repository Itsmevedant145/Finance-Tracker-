import React from 'react';
import image1 from '../../assets/images/image1.jpg';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Left side - Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md lg:max-w-lg backdrop-blur-sm bg-white/95 rounded-2xl shadow-2xl border border-white/20 p-6 lg:p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">$</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Expense Tracker
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Take control of your financial future
              </p>
            </div>
            
            {/* Children content (login/signup forms) */}
            <div className="w-full">{children}</div>
          </div>
        </div>
        
        {/* Right side - Image with decorative elements (hidden on mobile) */}
        <div className="hidden lg:flex w-1/2 items-center justify-center p-8 relative">
          {/* Floating stats cards */}
          <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-md text-white py-4 px-6 rounded-2xl shadow-xl border border-white/20 z-20 animate-float">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">📊</span>
              </div>
              <div>
                <p className="text-sm opacity-80">Monthly Savings</p>
                <p className="text-xl font-bold">$2,450</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-md text-white py-4 px-6 rounded-2xl shadow-xl border border-white/20 z-20 animate-float animation-delay-1000">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">💰</span>
              </div>
              <div>
                <p className="text-sm opacity-80">Total Budget</p>
                <p className="text-xl font-bold">$8,750</p>
              </div>
            </div>
          </div>
          
          {/* Main image container */}
          <div className="relative">
            <div className="w-80 h-96 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src={image1} 
                alt="Expense Tracker Dashboard" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-400 rounded-full animate-pulse animation-delay-500"></div>
            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-blue-400 rounded-full animate-pulse animation-delay-1000"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;