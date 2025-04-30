import React, { useContext, useState } from 'react';
import { SIDE_MENU_DATA } from '../../utils/data';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './SideMenu.css';
import { CharAvatar } from '../cards/CharAvatar';
import { useUserAuth } from '../../hooks/useUserAuth';

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
      <div className="container">
        {/* Avatar */}
        <div className="user-section">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="Profile"
              className="user-image"
            />
          ) : (
            <CharAvatar fullname={user?.fullname || "Guest"} />
          )}
        </div>

        {/* Username */}
        <div className="username">{user?.fullname || "Guest"}</div>

        {/* Menu Items */}
        {SIDE_MENU_DATA.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`menu-btn ${activeMenu === item.label ? 'active' : ''}`}
            onClick={() => handleClick(item.path)}
          >
            <item.icon className="menu-icon" />
            <span className="menu-label">{item.label}</span>
          </button>
        ))}
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
