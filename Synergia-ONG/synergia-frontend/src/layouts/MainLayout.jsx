import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const MainLayout = ({ children, showSearch = true }) => {
  const { usuario } = useAuth();
  const location = useLocation();

  // Páginas que não devem mostrar o layout completo
  const noLayoutPages = ['/login', '/cadastro', '/esqueci-senha', '/'];
  const shouldShowLayout = !noLayoutPages.includes(location.pathname) && usuario;

  if (!shouldShowLayout) {
    return children;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar showSearch={showSearch} />
        
        {/* Conteúdo da página */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;