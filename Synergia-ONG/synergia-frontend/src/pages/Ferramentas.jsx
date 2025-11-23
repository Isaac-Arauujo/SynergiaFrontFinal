import React, { useState, useEffect } from 'react';
import { Search, Plus, Loader, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ferramentaService } from '../services/ferramentaService';
import ToolCard from '../components/ToolCard';
import Pagination from '../components/Pagination';
export default function Ferramentas() {
  const [ferramentas, setFerramentas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const itemsPerPage = 10;
 
  useEffect(() => {
    carregarFerramentas();
  }, []);
 
  const carregarFerramentas = async () => {
    try {
      setLoading(true);
      const dados = await ferramentaService.listarTodas();
      setFerramentas(dados);
    } catch (err) {
      setError('Erro ao carregar ferramentas');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };
 
  const filteredTools = ferramentas.filter(tool =>
    tool.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  const paginatedTools = filteredTools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
 
  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(filteredTools.length / itemsPerPage)) {
      setCurrentPage(page);
    }
  };
 
  const handleNewToolClick = () => {
    navigate('/ferramentas/novo');
  };
 
  const handleProfileClick = () => {
    navigate('/admin');
  };
 
  const handleToolClick = (toolId) => {
    console.log('Ver detalhes da ferramenta:', toolId);
  };
 
  if (loading) {
    return (
<div className="p-8 w-full bg-white flex items-center justify-center min-h-screen">
<div className="text-center">
<Loader size={32} className="animate-spin mx-auto mb-4 text-synergia-green" />
<p className="text-gray-600">Carregando ferramentas...</p>
</div>
</div>
    );
  }
 
  return (
<div className="p-8 w-full bg-white min-h-screen">
      {/* Topbar */}
<header className="flex justify-between items-center pb-6 border-b border-gray-200">
<div>
<h3 className="text-lg font-bold text-synergia-green">Lista de Ferramentas</h3>
<p className="text-sm text-gray-500">
            {filteredTools.length} ferramentas encontradas
</p>
</div>
 
        <div className="flex items-center space-x-6">
 
          {/* Busca */}
<div className="relative">
<input
              type="text"
              placeholder="Buscar Ferramentas"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:ring-synergia-green focus:border-synergia-green w-64"
            />
<Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
</div>
 
          {/* Nova Ferramenta */}
<button
            onClick={handleNewToolClick}
            className="flex items-center bg-synergia-green text-white px-4 py-2 rounded-lg font-medium hover:bg-synergia-dark transition-colors"
>
<Plus className="h-5 w-5 mr-2" />
            Nova Ferramenta
</button>
 
          {/* Perfil */}
<div
            onClick={handleProfileClick}
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
>
<div className="text-right">
<p className="text-sm font-bold text-gray-800">
                {usuario?.nomeCompleto || 'Usuário'}
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
</header>
 
      {/* Erro */}
      {error && (
<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-6">
          {error}
</div>
      )}
 
      {/* Grid */}
      {paginatedTools.length > 0 ? (
<>
<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {paginatedTools.map((tool) => (
<ToolCard
                key={tool.id}
                tool={tool}
                onClick={() => handleToolClick(tool.id)}
              />
            ))}
</div>
 
          <Pagination
            totalItems={filteredTools.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
</>
      ) : (
<div className="text-center py-12">
<Settings size={48} className="mx-auto text-gray-400 mb-4" />
<h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nenhuma ferramenta encontrada' : 'Nenhuma ferramenta cadastrada'}
</h3>
<p className="text-gray-600 mb-6">
            {searchTerm ? 'Tente alterar os termos da busca.' : 'Adicione sua primeira ferramenta.'}
</p>
 
          {!searchTerm && (
<button
              onClick={handleNewToolClick}
              className="bg-synergia-green text-white px-6 py-2 rounded-lg font-medium hover:bg-synergia-dark transition-colors"
>
<Plus className="h-4 w-4 mr-2 inline" />
              Adicionar Primeira Ferramenta
</button>
          )}
</div>
      )}
</div>
  );
}