import React, { createContext, useState } from 'react';

// Create the context
export const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to update user
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Function to clear user
  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
