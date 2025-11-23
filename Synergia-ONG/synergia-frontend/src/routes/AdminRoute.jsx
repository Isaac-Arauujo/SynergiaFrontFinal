// src/routes/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  if (!usuario.isAdmin && !usuario.admin && !usuario.role) {
    // se seu backend usa outro campo para admin, ajuste a verificação acima
    return <Navigate to="/" replace />;
  }
  return children;
}
