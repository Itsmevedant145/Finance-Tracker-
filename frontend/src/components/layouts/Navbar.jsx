import React, { useState, useContext, useEffect } from 'react';
import { HiOutlineMenu, HiOutlineX, HiOutlineMicrophone } from 'react-icons/hi';
import './Navbar.css';
import AIAssistButton from '../AIAssistButton';
import handleSubmitAIText from './handleSubmitAIText';
import { UserContext } from '../../context/UserContext'; // adjust path if needed

const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  const [showModal, setShowModal] = useState(false);
  const [inputText, setInputText] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log('🔍 Navbar mounted or user updated:');
    console.log('user:', user);
    console.log('user?.id:', user?.id);
  }, [user]);

  const onProcessClick = () => {
    if (!user?._id) {
      alert('User not logged in.');
      return;
    }
    handleSubmitAIText(inputText, setInputText, setShowModal, user._id);
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <button className="navbar-menu-btn" onClick={toggleSidebar}>
            {sidebarOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>

          <div className="navbar-brand flex items-center gap-3" style={{ userSelect: 'none' }}>
            {/* Icon with refined gradients and highlight */}
            <svg
  viewBox="0 0 100 100"
  xmlns="http://www.w3.org/2000/svg"
  width="100"
  height="80"
  style={{ display: 'block' }}
>
  <defs>
    <linearGradient id="pieGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#ff8a65" />
      <stop offset="100%" stopColor="#f4511e" />
    </linearGradient>
    <linearGradient id="pieGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#4db6ac" />
      <stop offset="100%" stopColor="#00796b" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#2e7d32" floodOpacity="0.7" />
    </filter>
  </defs>

  {/* Left half (red) */}
  <path
    d="M 50 15
       A 35 35 0 0 1 50 85
       L 50 50 Z"
    fill="url(#pieGrad1)"
    stroke="#fff"
    strokeWidth="2"
  />

  {/* Right half (blue) */}
  <path
    d="M 50 85
       A 35 35 0 0 1 50 15
       L 50 50 Z"
    fill="url(#pieGrad2)"
    stroke="#fff"
    strokeWidth="2"
  />

  {/* Center circle */}
  <circle
    cx="50"
    cy="50"
    r="15"
    fill="#fff"
    stroke="#ccc"
    strokeWidth="1.5"
  />

  {/* Perfectly centered ₹ */}
  <text
    x="50"
    y="50"
    textAnchor="middle"
    dominantBaseline="central"
    fill="#2e7d32"
    fontFamily="Arial, sans-serif"
    fontSize="26"
    fontWeight="bold"
    filter="url(#glow)"
  >
    $
  </text>
</svg>


            {/* Title with gradient text */}
            <h1 className="bg-gradient-to-r from-green-700 to-blue-500 bg-clip-text text-transparent font-extrabold text-2xl select-none tracking-wide drop-shadow-sm">
  BudgetNest
</h1>

          </div>
        </div>

        <div className="navbar-right flex items-center gap-4">
          <AIAssistButton onClick={() => setShowModal(true)} />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => setShowModal(false)}
            >
              <HiOutlineX size={20} />
            </button>

            <h3 className="text-xl font-semibold mb-4 text-gray-800">AI Assist</h3>

            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="E.g., Paid ₹1200 to Swiggy on 8th Aug"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
              <button
                onClick={() => alert('Mic input will be supported soon.')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                title="Use microphone"
              >
                <HiOutlineMicrophone size={20} />
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Use AI to automate adding income or expenses.
            </p>

            <button
              onClick={onProcessClick}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition"
            >
              Process & Add Transaction
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
