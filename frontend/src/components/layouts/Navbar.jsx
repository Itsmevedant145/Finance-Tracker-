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
           <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style={{ stopColor: "#6366F1", stopOpacity: 1 }} />
      <stop offset="100%" style={{ stopColor: "#8B5CF6", stopOpacity: 1 }} />
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style={{ stopColor: "#10B981", stopOpacity: 1 }} />
      <stop offset="100%" style={{ stopColor: "#059669", stopOpacity: 1 }} />
    </linearGradient>
  </defs>

  {/* Rounded Square Background */}
  <rect x="20" y="20" width="160" height="160" rx="40" fill="url(#grad1)" />

  {/* Dollar Sign (Subtle, integrated) */}
  <g opacity="0.15">
    <rect x="97" y="40" width="6" height="45" rx="3" fill="#FFFFFF" />
    <path
      d="M 85 55 Q 82 55 82 58 Q 82 61 85 61 L 110 61 Q 115 61 115 66 Q 115 71 110 71 L 85 71"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="8"
      strokeLinecap="round"
    />
  </g>

  {/* Chart Bars */}
  <g opacity="0.9">
    {/* Bar 1 */}
    <rect x="45" y="110" width="20" height="50" rx="10" fill="#FFFFFF" opacity="0.3" />
    {/* Bar 2 */}
    <rect x="72" y="90" width="20" height="70" rx="10" fill="#FFFFFF" opacity="0.5" />
    {/* Bar 3 */}
    <rect x="99" y="70" width="20" height="90" rx="10" fill="#FFFFFF" opacity="0.7" />
    {/* Bar 4 (Highlighted) */}
    <rect x="126" y="50" width="20" height="110" rx="10" fill="url(#grad2)" />
  </g>

  {/* Money symbols on bars */}
  <text x="55" y="130" fontFamily="Arial, sans-serif" fontSize="14" fill="#6366F1" opacity="0.6" fontWeight="bold">$</text>
  <text x="82" y="110" fontFamily="Arial, sans-serif" fontSize="14" fill="#6366F1" opacity="0.7" fontWeight="bold">$</text>
  <text x="109" y="90" fontFamily="Arial, sans-serif" fontSize="14" fill="#6366F1" opacity="0.8" fontWeight="bold">$</text>
  <text x="136" y="70" fontFamily="Arial, sans-serif" fontSize="16" fill="#FFFFFF" fontWeight="bold">$</text>

  {/* Trend Line */}
  <path
    d="M 50 120 L 77 100 L 104 80 L 131 58"
    stroke="#FFFFFF"
    strokeWidth="3"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    opacity="0.8"
  />

  {/* Circle at end of trend */}
  <circle cx="131" cy="58" r="5" fill="#10B981" />
  <circle cx="131" cy="58" r="3" fill="#FFFFFF" />

  {/* Sparkle Effects */}
  <g opacity="0.6">
    <path d="M 155 45 L 157 47 L 159 45 L 157 43 Z" fill="#FFFFFF" />
    <path d="M 148 65 L 149 66 L 150 65 L 149 64 Z" fill="#FFFFFF" />
    <path d="M 40 50 L 42 52 L 44 50 L 42 48 Z" fill="#FFFFFF" />
  </g>
</svg>


            {/* Title with gradient text */}
            <h1 className="bg-gradient-to-r from-green-700 to-blue-500 bg-clip-text text-transparent font-extrabold text-2xl select-none tracking-wide drop-shadow-sm">
  BudgetNest
</h1>

          </div>
        </div>

        <div className="navbar-right flex items-center gap-4">
          {/* <AIAssistButton onClick={() => setShowModal(true)} /> */}
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
