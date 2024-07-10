"use client";

import React, { createContext, useState, useEffect } from "react";

// Create User Context
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user ID and name from local storage
    const userId = localStorage.getItem("user_id");
    const userName = localStorage.getItem("user_name");
    const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
    if (userId && userName && isAdmin !== null) {
      setUser({ id: userId, name: userName, isAdmin: isAdmin });
    }
  }, []);

  const login = (userData) => {
    // Save user data to local storage
    localStorage.setItem("user_id", userData.id);
    localStorage.setItem("user_name", userData.name);
    localStorage.setItem("isAdmin", JSON.stringify(userData.isAdmin)); // Stringify the boolean value
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("isAdmin");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
