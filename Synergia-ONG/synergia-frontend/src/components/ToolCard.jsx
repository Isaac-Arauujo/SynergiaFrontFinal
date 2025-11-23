import React from 'react';
import { Settings, Package, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ToolCard = ({ tool, onClick }) => {
  const { id, nome, descricao, imagemUrl, quantidade, quantidadeDisponivel } = tool;
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    } else {
      navigate(`/ferramentas/detalhe/${id}`);
    }
  };

  const disponivel = quantidadeDisponivel > 0;
  const baixoEstoque = quantidadeDisponivel > 0 && quantidadeDisponivel <= 5;

  return (
    <div 
      className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col items-center hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative mb-3 w-full">
        {/* Imagem/Ícone */}
        <div className="w-20 h-20 rounded-full overflow-hidden mb-2 bg-gray-100 flex items-center justify-center mx-auto border-2 border-gray-200">
          {imagemUrl ? (
            <img src={imagemUrl} alt={nome} className="w-full h-full object-cover" />
          ) : (
            <Settings className="w-8 h-8 text-gray-400" />
          )}
        </div>
        
        {/* Status Badge */}
        <div className={`absolute top-0 right-0 text-white text-xs font-semibold px-2 py-1 rounded-md ${
          !disponivel ? 'bg-red-500' :
          baixoEstoque ? 'bg-yellow-500' : 'bg-green-500'
        }`}>
          {!disponivel ? 'Indisponível' :
           baixoEstoque ? 'Baixo Estoque' : 'Disponível'}
        </div>
      </div>

      {/* Nome */}
      <h4 className="text-sm font-bold text-gray-800 mt-2 text-center line-clamp-2 h-10">
        {nome}
      </h4>
      
      {/* Descrição */}
      {descricao && (
        <p className="text-xs text-gray-500 text-center mt-1 line-clamp-2 h-8">
          {descricao}
        </p>
      )}

      {/* Informações de Estoque */}
      <div className="w-full mt-3 space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-600">Estoque Total:</span>
          <span className="font-semibold text-gray-800">{quantidade}</span>
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-600">Disponível:</span>
          <span className={`font-semibold ${
            !disponivel ? 'text-red-600' :
            baixoEstoque ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {quantidadeDisponivel || 0}
          </span>
        </div>

        {/* Barra de progresso visual */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
          <div 
            className={`h-1.5 rounded-full ${
              !disponivel ? 'bg-red-500' :
              baixoEstoque ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ 
              width: `${Math.max(5, (quantidadeDisponivel / quantidade) * 100)}%` 
            }}
          ></div>
        </div>
      </div>

      {/* Botão de ação */}
      <button 
        className="mt-4 flex items-center text-xs font-medium bg-synergia-green text-white px-4 py-2 rounded-lg hover:bg-synergia-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!disponivel}
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        {disponivel ? 'Ver Detalhes' : 'Indisponível'}
      </button>

      {/* Alerta de baixo estoque */}
      {baixoEstoque && (
        <div className="flex items-center mt-2 text-xs text-yellow-600">
          <AlertCircle className="h-3 w-3 mr-1" />
          Estoque baixo
        </div>
      )}
    </div>
  );
};

export default ToolCard;