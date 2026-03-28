// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { Navigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Just a small tick so the app doesn't flash
    const t = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(t);
  }, []);

  const logout = () => {
    sessionStorage.removeItem('chess_admin');
    window.location.href = '/admin/login';
  };

  return (
    <AuthContext.Provider value={{ logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// AdminRoute: checks sessionStorage flag set by dummy login
export function AdminRoute({ children }) {
  const isAdmin = sessionStorage.getItem('chess_admin') === 'true';
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}
