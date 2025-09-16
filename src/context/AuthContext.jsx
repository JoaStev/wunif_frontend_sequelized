import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const data = localStorage.getItem('auth');
    return data ? JSON.parse(data) : null;
  });

  function login(token, role) {
    setUser({ token, role });
    localStorage.setItem('auth', JSON.stringify({ token, role }));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('auth');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
