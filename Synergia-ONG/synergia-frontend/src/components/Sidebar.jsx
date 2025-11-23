import React from 'react';
import { MapPin, Settings, FileText, Home, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/admin' },
  { name: 'Locais', icon: MapPin, path: '/locais' },
  { name: 'Ferramentas', icon: Settings, path: '/ferramentas' },
  { name: 'Inscrições', icon: FileText, path: '/inscricoes' },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white shadow-xl flex flex-col p-4 border-r border-gray-200 h-screen sticky top-0">
      
      {/* Logo */}
      <Link to="/admin" className="flex items-center py-2 mb-8 cursor-pointer">
        <div className="h-8 w-8 bg-synergia-green rounded-lg flex items-center justify-center mr-2">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <span className="text-xl font-bold text-synergia-green">Synergia</span>
      </Link>

      <p className="text-xs font-semibold uppercase text-gray-400 mb-4 tracking-wider">
        MENU PRINCIPAL
      </p>

      {/* Itens de Navegação */}
      <nav className="space-y-1 flex-grow">
        {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
                <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center p-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-green-50 text-synergia-green rounded-lg border-l-4 border-synergia-green -ml-4 pl-4'
                        : 'text-gray-600 hover:bg-gray-100 rounded-lg'
                    }`}
                >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                </Link>
            );
        })}
      </nav>

      {/* Perfil e Logout */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <Link
          to="/perfil"
          className="flex items-center p-3 text-sm text-gray-600 hover:bg-gray-100 rounded-lg mb-2"
        >
          <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 mr-3">
            {usuario?.nomeCompleto?.substring(0, 2).toUpperCase() || 'US'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {usuario?.nomeCompleto || 'Usuário'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {usuario?.isAdmin ? 'Administrador' : 'Voluntário'}
            </p>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </button>
      </div>
    </div>
  );
}

export default Sidebar;