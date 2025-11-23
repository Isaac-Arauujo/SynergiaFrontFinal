import React, { useState } from 'react';
import { MapPin, Calendar, Users, Check, X, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LocalPendenteCard = ({ local, onAprovar, onRecusar, onDetalhes }) => {
  const { id, nome, descricao, imagemUrl, dataRegistro, dataInicio, dataFinal, usuarioSolicitante } = local;
  const [processando, setProcessando] = useState(false);
  const navigate = useNavigate();

  const handleAprovar = async () => {
    setProcessando(true);
    try {
      await onAprovar(id);
    } finally {
      setProcessando(false);
    }
  };

  const handleRecusar = async () => {
    setProcessando(true);
    try {
      await onRecusar(id);
    } finally {
      setProcessando(false);
    }
  };

  const handleDetalhes = () => {
    if (onDetalhes) {
      onDetalhes(id);
    } else {
      navigate(`/locais/pendentes/${id}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white border border-yellow-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Imagem e Informações Básicas */}
          <div className="flex-shrink-0 lg:w-48">
            <div className="h-32 bg-gray-200 rounded-lg overflow-hidden mb-3">
              {imagemUrl ? (
                <img 
                  src={imagemUrl} 
                  alt={nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-yellow-600">
                <Clock className="h-4 w-4 mr-2" />
                <span className="font-semibold">Pendente</span>
              </div>
              <div className="text-gray-500">
                Solicitado em: {formatDate(dataRegistro)}
              </div>
              {usuarioSolicitante && (
                <div className="text-gray-500 truncate">
                  Por: {usuarioSolicitante}
                </div>
              )}
            </div>
          </div>

          {/* Detalhes do Local */}
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-yellow-600" />
                {nome}
              </h3>
              
              <button
                onClick={handleDetalhes}
                className="flex items-center text-synergia-green hover:text-synergia-dark font-medium text-sm"
              >
                <Eye className="h-4 w-4 mr-1" />
                Ver Detalhes
              </button>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">
              {descricao}
            </p>

            {/* Informações do Evento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-synergia-green" />
                <div>
                  <div className="font-medium">Período do Evento</div>
                  <div>{formatDate(dataInicio)} - {formatDate(dataFinal)}</div>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2 text-synergia-green" />
                <div>
                  <div className="font-medium">Status</div>
                  <div className="text-yellow-600 font-semibold">Aguardando Aprovação</div>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleAprovar}
                disabled={processando}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="h-4 w-4 mr-2" />
                {processando ? 'Aprovando...' : 'Aprovar'}
              </button>
              
              <button
                onClick={handleRecusar}
                disabled={processando}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="h-4 w-4 mr-2" />
                {processando ? 'Recusando...' : 'Recusar'}
              </button>

              <button
                onClick={handleDetalhes}
                className="flex items-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Completo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalPendenteCard;