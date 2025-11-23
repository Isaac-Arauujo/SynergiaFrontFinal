import React, { useState } from 'react';
import { Image, Loader, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ferramentaService } from '../services/ferramentaService';

export default function AddTool() {
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    quantidade: '',
    image: null,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { usuario } = useAuth();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: name === 'quantidade' ? (value === '' ? '' : parseInt(value)) : value
      }));
    }

    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!form.nome.trim()) {
      setError('Nome da ferramenta é obrigatório');
      return false;
    }
    if (!form.descricao.trim()) {
      setError('Descrição é obrigatória');
      return false;
    }
    if (!form.quantidade || form.quantidade < 0) {
      setError('Quantidade deve ser um número positivo');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Caso você futuramente adicione upload real:
      await ferramentaService.criar({
        ...form,
        quantidade: parseInt(form.quantidade),
      });

      setSuccess('Ferramenta cadastrada com sucesso!');
      
      setTimeout(() => {
        navigate('/ferramentas');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cadastrar ferramenta');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setForm({
      nome: '',
      descricao: '',
      quantidade: '',
      image: null,
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">

      {/* Header igual ao modelo Synergia */}
      <header className="flex justify-between items-center p-6 bg-gray-100">
        <h3 className="text-lg font-bold" style={{ color: '#00715D' }}>Cadastrar Ferramenta</h3>

        <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
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
      </header>

      <main className="p-8 bg-gray-100 flex-1 overflow-y-auto">

        {/* Feedback */}
        {error && (
          <div className="max-w-xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="max-w-xl mx-auto bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Card central */}
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm p-8">

          <form onSubmit={handleSubmit} className="space-y-8 text-center">

            <h2 className="text-xl font-bold text-gray-800 mb-6">Cadastrar Ferramenta</h2>

            {/* Nome */}
            <label className="block text-left flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 w-1/3">Nome do equipamento *</span>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Saco de Lixo"
                className="w-2/3 p-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400"
                required
              />
            </label>

            {/* Descrição */}
            <label className="block text-left flex items-start justify-between">
              <span className="text-sm font-medium text-gray-700 w-1/3 pt-2">Descrição *</span>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Breve descrição do equipamento"
                className="w-2/3 h-28 p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400"
                required
              />
            </label>

            {/* Quantidade */}
            <label className="block text-left flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 w-1/3">Quantidade *</span>
              <input
                type="number"
                name="quantidade"
                value={form.quantidade}
                onChange={handleChange}
                placeholder="10 Unidades"
                className="w-2/3 p-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400"
                required
              />
            </label>

            {/* Imagem (arquivo) */}
            <label className="block text-left flex items-center justify-between pt-4">
              <span className="text-sm font-medium text-gray-700 w-1/3">Imagem</span>
              <div className="flex items-center gap-3 w-2/3">
                <label className="flex items-center px-3 py-2 border border-gray-300 rounded-lg cursor-pointer text-sm text-gray-600 bg-white hover:bg-gray-50">
                  <Image className="w-4 h-4 mr-2" style={{ color: '#00715D' }} />
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                  Upload da imagem
                </label>

                {form.image && (
                  <span className="text-sm text-gray-600 truncate">
                    {form.image.name}
                  </span>
                )}
              </div>
            </label>

            {/* Ações */}
            <div className="flex items-center justify-center gap-6 pt-8">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center bg-[#00715D] text-white px-8 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin mr-2" />
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Adicionar
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="px-6 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition"
              >
                Remover
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
