import React, { useContext, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = () => {
  const { user, loading } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    console.log("🛡️ ProtectedRoute check:");
    console.log("   Loading:", loading);
    console.log("   User:", user ? "Authenticated" : "Not authenticated");
    console.log("   Current path:", location.pathname);
    console.log("   Token in localStorage:", localStorage.getItem('token'));
  }, [loading, user, location.pathname]);

  // 🕓 Wait while user context is loading
  if (loading) {
    console.log("⏳ Showing loading state...");
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column' 
      }}>
        <div>Loading protected route...</div>
        <small style={{ marginTop: '10px', opacity: 0.7 }}>
          Verifying authentication...
        </small>
      </div>
    );
  }

  // 🔐 If user still null after loading, redirect to login
  if (!user) {
    console.log("🚫 User not authenticated, redirecting to login...");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ✅ Otherwise, show the protected content
  console.log("✅ User authenticated, rendering protected content");
  return <Outlet />;
};

export default ProtectedRoute;