// src/pages/ToolDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ferramentaService } from '../services/ferramentaService';
import { useAuth } from '../contexts/AuthContext';

export default function ToolDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingDelete, setProcessingDelete] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await ferramentaService.buscarPorId(id);
        setTool(data);
      } catch (err) {
        console.error('Erro ao buscar ferramenta:', err);
        setError('Erro ao carregar ferramenta.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleEdit = () => {
    navigate(`/ferramentas/editar/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir esta ferramenta?')) return;
    try {
      setProcessingDelete(true);
      await ferramentaService.excluir(id);
      alert('Ferramenta excluída com sucesso!');
      navigate('/ferramentas');
    } catch (err) {
      console.error('Erro ao excluir ferramenta:', err);
      const message = err?.response?.data?.message || 'Erro ao excluir ferramenta';
      alert(message);
      setProcessingDelete(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Carregando ferramenta...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="p-6 text-center">
        <p>Ferramenta não encontrada.</p>
      </div>
    );
  }

  const imagemUrl = tool.imagemUrl || null;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="bg-white shadow rounded overflow-hidden">
        {imagemUrl ? (
          <img src={imagemUrl} alt={tool.nome} className="w-full h-48 object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        ) : (
          <div className="w-full h-48 flex items-center justify-center border-b">
            <p>Sem imagem disponível</p>
          </div>
        )}

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{tool.nome}</h1>
          <p className="mb-4">{tool.descricao || 'Sem descrição.'}</p>

          <div className="mb-4 text-sm text-gray-700">
            <div><strong>Quantidade:</strong> {tool.quantidade ?? '-'}</div>
            <div><strong>Status:</strong> {tool.disponivel ? 'Disponível' : 'Indisponível'}</div>
          </div>

          {tool.dataInicio || tool.dataFinal ? (
            <div className="mb-4 text-sm text-gray-700">
              <div><strong>Período:</strong></div>
              <div>{tool.dataInicio ?? '—'} {tool.dataFinal ? `até ${tool.dataFinal}` : ''}</div>
            </div>
          ) : null}

          <div className="flex gap-3 mt-6">
            {usuario?.isAdmin && (
              <>
                <button onClick={handleEdit} className="px-4 py-2 rounded bg-yellow-500 text-white hover:opacity-90">Editar</button>
                <button onClick={handleDelete} disabled={processingDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:opacity-90">
                  {processingDelete ? 'Excluindo...' : 'Excluir'}
                </button>
              </>
            )}

            <button onClick={() => navigate('/ferramentas')} className="px-4 py-2 rounded border hover:bg-gray-100">Voltar</button>
          </div>
        </div>
      </div>
    </main>
  );
}
