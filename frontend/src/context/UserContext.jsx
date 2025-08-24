import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosinstance';
import { API_Path } from '../utils/apiPath';

// Create the context
export const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to update user
  const updateUser = (userData) => {
    console.log("🔄 Updating user context:", userData);
    setUser(userData);
  };

  // Function to clear user
  const clearUser = () => {
    console.log("🗑️ Clearing user context and token");
    setUser(null);
    localStorage.removeItem('token');
  };

  // Automatically fetch user on app load if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("📦 Token in localStorage:", token);
    console.log("🔍 Starting user authentication check...");

    if (token) {
      console.log("🚀 Token found, fetching user info...");
      
      axiosInstance
        .get(API_Path.AUTH.GET_USER_INFO)
        .then((res) => {
          console.log("✅ User fetch successful:", res.data);
          console.log("📊 Response status:", res.status);
          console.log("🏗️ Response structure:", Object.keys(res.data));
          
          // Check if response has user data
          if (res.data && (res.data.id || res.data._id || res.data.user)) {
            setUser(res.data);
          } else {
            console.warn("⚠️ User data structure unexpected:", res.data);
            // You might need to adjust this based on your API response structure
            setUser(res.data);
          }
        })
        .catch((err) => {
          console.error("❌ Error fetching user:");
          console.error("   Status:", err.response?.status);
          console.error("   Message:", err.message);
          console.error("   Response data:", err.response?.data);
          
          // If token is invalid/expired, clear it
          if (err.response?.status === 401 || err.response?.status === 403) {
            console.log("🔒 Token appears to be invalid, clearing...");
            clearUser();
          }
        })
        .finally(() => {
          console.log("🏁 User authentication check complete");
          setLoading(false);
        });
    } else {
      console.log("📭 No token found, user not authenticated");
      setLoading(false);
    }
  }, []);

  // Add effect to log user state changes
  useEffect(() => {
    console.log("👤 User state changed:", user ? "Authenticated" : "Not authenticated");
    if (user) {
      console.log("   User data:", user);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;