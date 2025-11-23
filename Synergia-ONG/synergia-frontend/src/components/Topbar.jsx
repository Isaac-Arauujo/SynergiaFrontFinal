import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Topbar = ({ searchTerm, setSearchTerm, showSearch = true }) => {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const handleProfileClick = () => {
    navigate('/perfil');
  };

  const handleNotificationsClick = () => {
    // Implementar notificações futuramente
    console.log('Abrir notificações');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Título baseado na página atual */}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-synergia-green">
            {getPageTitle(window.location.pathname)}
          </h3>
          <p className="text-sm text-gray-500">
            {getPageSubtitle(window.location.pathname)}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Busca (condicional) */}
          {showSearch && (
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:ring-synergia-green focus:border-synergia-green w-64"
              />
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          )}

          {/* Notificações */}
          <button
            onClick={handleNotificationsClick}
            className="relative p-2 text-gray-600 hover:text-synergia-green transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Perfil */}
          <div 
            onClick={handleProfileClick}
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800">
                {usuario?.nomeCompleto?.split(' ')[0] || 'Usuário'}
              </p>
              <p className="text-xs text-gray-400">
                {usuario?.isAdmin ? 'Administrador' : 'Voluntário'}
              </p>
            </div>
            <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
              {usuario?.nomeCompleto?.substring(0, 2).toUpperCase() || 'US'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Funções auxiliares para títulos dinâmicos
const getPageTitle = (pathname) => {
  const titles = {
    '/admin': 'Dashboard Administrativo',
    '/locais': 'Gerenciar Locais',
    '/ferramentas': 'Gerenciar Ferramentas',
    '/inscricoes': 'Gerenciar Inscrições',
    '/perfil': 'Meu Perfil',
    '/locais/novo': 'Adicionar Local',
    '/ferramentas/novo': 'Adicionar Ferramenta'
  };
  return titles[pathname] || 'Synergia Admin';
};

const getPageSubtitle = (pathname) => {
  const subtitles = {
    '/admin': 'Visão geral do sistema',
    '/locais': 'Gerencie os locais de voluntariado',
    '/ferramentas': 'Controle de equipamentos',
    '/inscricoes': 'Aprove ou recuse inscrições',
    '/perfil': 'Gerencie suas informações',
    '/locais/novo': 'Cadastre um novo local',
    '/ferramentas/novo': 'Adicione uma nova ferramenta'
  };
  return subtitles[pathname] || 'Sistema de gerenciamento';
};

export default Topbar;