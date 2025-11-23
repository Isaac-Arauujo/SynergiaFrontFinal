import React from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function LocationCard({ location }) {
  const { id, nome, descricao, imagemUrl, dataInicio, dataFinal, vagasDisponiveis } = location;
  const navigate = useNavigate();

  const handleVerDetalhes = () => {
    navigate(`/locais/detalhe/${id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isActive = new Date(dataFinal) >= new Date();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      
      {/* Imagem */}
      <div className="h-48 bg-gray-200 overflow-hidden relative">
        {imagemUrl ? (
          <img 
            src={imagemUrl} 
            alt={nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${
          isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {isActive ? 'Ativo' : 'Encerrado'}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">{nome}</h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {descricao}
        </p>

        {/* Informações */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-synergia-green" />
            <span>
              {formatDate(dataInicio)} - {formatDate(dataFinal)}
            </span>
          </div>
          
          {vagasDisponiveis !== undefined && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2 text-synergia-green" />
              <span>{vagasDisponiveis} vagas disponíveis</span>
            </div>
          )}
        </div>

        {/* Botão de ação */}
        <button 
          onClick={handleVerDetalhes}
          className="w-full bg-synergia-green text-white py-2 rounded-lg font-medium hover:bg-synergia-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isActive}
        >
          {isActive ? 'Ver Detalhes' : 'Evento Encerrado'}
        </button>
      </div>
    </div>
  );
}

export default LocationCard;