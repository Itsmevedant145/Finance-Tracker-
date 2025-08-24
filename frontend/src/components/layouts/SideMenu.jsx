import React, { useContext, useState } from 'react';
import { SIDE_MENU_DATA } from '../../utils/data';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { CharAvatar } from '../cards/CharAvatar';
import { useUserAuth } from '../../hooks/useUserAuth';
import { HiRefresh } from 'react-icons/hi'; // fixed import


const SideMenu = ({ activeMenu }) => {
  useUserAuth(); 
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  const handleClick = (route) => {
    if (route === "/logout") {
      setShowLogoutConfirm(true);
    } else {
      navigate(route);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg w-64 space-y-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-green-600 shadow-md">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <CharAvatar fullname={user?.fullname || "Guest"} />
          )}
        </div>

        {/* Username */}
        <div className="text-xl font-semibold text-gray-800">{user?.fullname || "Guest"}</div>

        {/* Menu Items */}
        <nav className="flex flex-col w-full space-y-2">
          {SIDE_MENU_DATA.map((item, index) => (
            <button
              key={`menu_${index}`}
              onClick={() => handleClick(item.path)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${
                  activeMenu === item.label 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-green-100 hover:text-green-700'
                }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-md font-medium">{item.label}</span>
            </button>
          ))}

        </nav>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-green-100/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border border-green-300 rounded-xl shadow-xl p-6 w-80 text-center">
            <h2 className="text-xl font-semibold text-green-700 mb-2">Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-white text-red-600 border border-red-500 hover:bg-red-600 hover:text-white rounded-lg transition"
                onClick={() => {
                  handleLogout();
                  setShowLogoutConfirm(false);
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideMenu;
