// src/components/ToolCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * ToolCard - card simples para exibir ferramenta na grid/lista.
 * Props:
 *  - tool: { id, nome, descricao, imagemUrl, quantidade, disponivel }
 *  - onClick (opcional) - callback(id)
 */
export default function ToolCard({ tool, onClick }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e?.stopPropagation();
    if (onClick) return onClick(tool.id);
    navigate(`/ferramentas/detalhe/${tool.id}`);
  };

  const imagem = tool?.imagemUrl || null;

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded shadow hover:shadow-lg cursor-pointer overflow-hidden"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
    >
      <div className="w-full h-36 bg-gray-100">
        {imagem ? (
          <img src={imagem} alt={tool.nome} className="w-full h-36 object-cover" />
        ) : (
          <div className="w-full h-36 flex items-center justify-center text-gray-500">
            Sem imagem
          </div>
        )}
      </div>

      <div className="p-3">
        <h4 className="text-md font-semibold text-gray-800">{tool.nome}</h4>
        <p className="text-sm text-gray-600 mt-1 line-clamp-3">{tool.descricao || 'Sem descrição'}</p>

        <div className="mt-3 text-xs text-gray-500">
          <div>Quantidade: {tool.quantidade ?? '-'}</div>
          <div>Status: {tool.disponivel ? 'Disponível' : 'Indisponível'}</div>
        </div>
      </div>
    </div>
  );
}
