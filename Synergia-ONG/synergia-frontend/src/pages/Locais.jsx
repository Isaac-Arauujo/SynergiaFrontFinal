import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { localService } from '../services/localService';
import Topbar from '../components/Topbar';
import LocationCard from '../components/LocationCard';
import Pagination from '../components/Pagination';
import { Loader, MapPin } from 'lucide-react';

function Locais() {
  const [locais, setLocais] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { usuario } = useAuth();
  const itemsPerPage = 6;

  useEffect(() => {
    carregarLocais();
  }, []);

  const carregarLocais = async () => {
    try {
      setLoading(true);
      const dados = await localService.listarTodos();
      setLocais(dados);
    } catch (err) {
      setError('Erro ao carregar locais');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtro
  const filteredData = locais.filter(local =>
    local.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    local.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginação
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleLocationClick = (localId) => {
    // Navegar para detalhes do local
    console.log('Ver detalhes do local:', localId);
  };

  if (loading) {
    return (
      <div className="p-8 w-full bg-white flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader size={32} className="animate-spin mx-auto mb-4 text-synergia-green" />
          <p className="text-gray-600">Carregando locais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full bg-white min-h-screen">
  
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="mt-8 mb-6">
        <h3 className="text-lg font-medium text-gray-600 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-synergia-green" />
          Locais disponíveis ({filteredData.length})
        </h3>
      </div>

      {/* Cards de Localização */}
      {currentItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((local) => (
            <div key={local.id} onClick={() => handleLocationClick(local.id)}>
              <LocationCard location={local} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum local encontrado</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Tente ajustar os termos da busca.' : 'Não há locais cadastrados no momento.'}
          </p>
        </div>
      )}

      {/* Paginação */}
      {filteredData.length > itemsPerPage && (
        <Pagination
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default Locais;