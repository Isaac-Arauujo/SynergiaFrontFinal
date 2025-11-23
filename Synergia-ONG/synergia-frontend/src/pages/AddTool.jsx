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
    imagemUrl: '', // agora obrigatório
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // mensagem simples
  const [validationErrors, setValidationErrors] = useState([]); // lista de erros vindos do backend
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { usuario } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'quantidade' ? (value === '' ? '' : parseInt(value, 10)) : value
    }));
    setError('');
    setValidationErrors([]);
    setSuccess('');
  };

  const validateForm = () => {
    const errs = [];
    const nome = (form.nome || '').toString().trim();
    if (nome.length < 3 || nome.length > 100) {
      errs.push('Nome deve ter entre 3 e 100 caracteres.');
    }
    if (!form.descricao || form.descricao.toString().trim().length === 0) {
      errs.push('Descrição é obrigatória.');
    }
    if (form.quantidade === '' || Number.isNaN(form.quantidade) || form.quantidade < 1) {
      errs.push('Quantidade deve ser um número inteiro positivo (>= 1).');
    }
    const url = (form.imagemUrl || '').toString().trim();
    if (!url) {
      errs.push('URL da imagem é obrigatória.');
    }
    // opcional: checar se imagemUrl parece uma URL
    try {
      // basic URL validation
      new URL(url);
    } catch (e) {
      errs.push('URL da imagem inválida.');
    }

    if (errs.length > 0) {
      setValidationErrors(errs);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors([]);
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        nome: form.nome.trim(),
        descricao: form.descricao.trim(),
        imagemUrl: form.imagemUrl.trim(),
        quantidade: Number(form.quantidade),
        quantidadeDisponivel: Number(form.quantidade)
      };

      await ferramentaService.criar(payload);

      setSuccess('Ferramenta cadastrada com sucesso!');
      setTimeout(() => navigate('/ferramentas'), 900);

    } catch (err) {
      console.error('Erro ao cadastrar ferramenta:', err);

      // tenta extrair a estrutura de erro do Spring (veja seu JSON de exemplo)
      const resp = err?.response?.data;
      if (resp) {
        if (Array.isArray(resp.errors) && resp.errors.length > 0) {
          // extrai mensagens individuais
          const messages = resp.errors.map(e => e.defaultMessage || JSON.stringify(e));
          setValidationErrors(messages);
        } else if (resp.message) {
          setError(resp.message);
        } else {
          setError(JSON.stringify(resp));
        }
      } else {
        setError(err?.message || 'Erro ao cadastrar ferramenta');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setForm({
      nome: '',
      descricao: '',
      quantidade: '',
      imagemUrl: '',
    });
    setError('');
    setValidationErrors([]);
    setSuccess('');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-6 bg-gray-100">
        <h3 className="text-lg font-bold" style={{ color: '#00715D' }}>Cadastrar Ferramenta</h3>
        <div className="flex items-center space-x-2">
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
        {error && (
          <div className="max-w-xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="max-w-xl mx-auto bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4">
            <ul className="list-disc pl-5">
              {validationErrors.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </div>
        )}

        {success && (
          <div className="max-w-xl mx-auto bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-8 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Cadastrar Ferramenta</h2>

            <label className="block text-left flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 w-1/3">Nome do equipamento *</span>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex: Martelo"
                className="w-2/3 p-2 border border-gray-300 rounded-lg"
                required
              />
            </label>

            <label className="block text-left flex items-start justify-between">
              <span className="text-sm font-medium text-gray-700 w-1/3 pt-2">Descrição *</span>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Breve descrição"
                className="w-2/3 h-28 p-3 border border-gray-300 rounded-lg"
                required
              />
            </label>

            <label className="block text-left flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 w-1/3">Quantidade *</span>
              <input
                type="number"
                name="quantidade"
                value={form.quantidade}
                onChange={handleChange}
                className="w-2/3 p-2 border border-gray-300 rounded-lg"
                min={1}
                required
              />
            </label>

            <label className="block text-left flex items-center justify-between pt-4">
              <span className="text-sm font-medium text-gray-700 w-1/3">URL da Imagem *</span>
              <div className="flex items-center gap-3 w-2/3">
                <input
                  type="text"
                  name="imagemUrl"
                  value={form.imagemUrl}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/imagem.png"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </label>

            <div className="flex items-center justify-center gap-6 pt-8">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center bg-[#00715D] text-white px-8 py-2 rounded-lg"
              >
                {loading ? (<><Loader size={18} className="animate-spin mr-2" />Cadastrando...</>) : (<><Plus className="h-5 w-5 mr-2" />Adicionar</>)}
              </button>

              <button type="button" onClick={handleRemove} className="px-6 py-2 rounded-lg bg-red-600 text-white">
                Remover
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
