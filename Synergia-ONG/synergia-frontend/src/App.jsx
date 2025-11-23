// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages (mantenha os imports que você já tinha)
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import EsqueciSenha from './pages/EsqueciSenha';
import Locais from './pages/Locais';
import Ferramentas from './pages/Ferramentas';
import Inscricoes from './pages/Inscricoes';
import InscricaoDetalhe from './pages/InscricaoDetalhe';
import AddLocation from './pages/AddLocation';
import AddTool from './pages/AddTool';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import Perfil from './pages/Perfil';
import Contato from './pages/Contato';
import MeuPerfil from './pages/MeuPerfil';
import Guaruja from './pages/descricaolocal/Guaruja';
import Cipo from './pages/descricaolocal/Cipo';
import Tiete from './pages/descricaolocal/Tiete';
import MainLayout from './layouts/MainLayout';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  if (requireAdmin && !usuario?.isAdmin) return <Navigate to="/locais" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { usuario } = useAuth();
  // query ?force=true força público
  let forcePublic = false;
  try { forcePublic = new URLSearchParams(window.location.search).get('force') === 'true'; } catch(e){}
  if (forcePublic) return children;
  if (!usuario) return children;
  return usuario?.isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/locais" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/cadastro" element={<PublicRoute><Cadastro /></PublicRoute>} />
          <Route path="/esqueci-senha" element={<PublicRoute><EsqueciSenha /></PublicRoute>} />
          <Route path="/meuperfil" element={<MeuPerfil />} />
          <Route path="/guaruja" element={<Guaruja />} />
          <Route path="/cipo" element={<Cipo />} />
          <Route path="/tiete" element={<Tiete />} />

          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><MainLayout><SuperAdminDashboard /></MainLayout></ProtectedRoute>} />
          <Route path="/locais" element={<ProtectedRoute><MainLayout><Locais /></MainLayout></ProtectedRoute>} />
          <Route path="/locais/novo" element={<ProtectedRoute requireAdmin={true}><MainLayout><AddLocation /></MainLayout></ProtectedRoute>} />
          <Route path="/ferramentas" element={<ProtectedRoute requireAdmin={true}><MainLayout><Ferramentas /></MainLayout></ProtectedRoute>} />
          <Route path="/ferramentas/novo" element={<ProtectedRoute requireAdmin={true}><MainLayout><AddTool /></MainLayout></ProtectedRoute>} />
          <Route path="/inscricoes" element={<ProtectedRoute requireAdmin={true}><MainLayout><Inscricoes /></MainLayout></ProtectedRoute>} />
          <Route path="/inscricoes/detalhe/:id" element={<ProtectedRoute requireAdmin={true}><MainLayout><InscricaoDetalhe /></MainLayout></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><MainLayout showSearch={false}><Perfil /></MainLayout></ProtectedRoute>} />

          <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/home" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<div style={{padding:40}}>404 - Página não encontrada</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
