import React, { useState } from 'react';
import { Image, Calendar, X, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { localService } from '../services/localService';
import { ferramentaService } from '../services/ferramentaService';

export default function AddLocation() {
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    imagemUrl: '',
    rua: '',
    numero: '',
    cep: '',
    dataInicio: '',
    dataFinal: '',
    ferramentas: []
  });

  const [ferramentasDisponiveis, setFerramentasDisponiveis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [carregandoFerramentas, setCarregandoFerramentas] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { usuario } = useAuth();

  React.useEffect(() => {
    carregarFerramentas();
  }, []);

  const carregarFerramentas = async () => {
    try {
      setCarregandoFerramentas(true);
      const ferramentas = await ferramentaService.listarDisponiveis();
      setFerramentasDisponiveis(ferramentas);
    } catch (err) {
      console.error('Erro ao carregar ferramentas:', err);
    } finally {
      setCarregandoFerramentas(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleFerramentaToggle = (id) => {
    setForm((prev) => ({
      ...prev,
      ferramentas: prev.ferramentas.includes(id)
        ? prev.ferramentas.filter((x) => x !== id)
        : [...prev.ferramentas, id]
    }));
  };

  const handleRemoveFerramenta = (id) => {
    setForm((prev) => ({
      ...prev,
      ferramentas: prev.ferramentas.filter((x) => x !== id)
    }));
  };

  const validateForm = () => {
    if (!form.nome.trim()) return setError('Nome do local é obrigatório');
    if (!form.descricao.trim()) return setError('Descrição é obrigatória');
    if (!form.rua.trim()) return setError('Rua é obrigatória');
    if (!form.numero.trim()) return setError('Número é obrigatório');
    if (!form.cep.trim()) return setError('CEP é obrigatório');
    if (!form.dataInicio) return setError('Data de início é obrigatória');
    if (!form.dataFinal) return setError('Data final é obrigatória');
    if (new Date(form.dataInicio) >= new Date(form.dataFinal))
      return setError('Data final deve ser posterior à data de início');

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const localData = {
        ...form,
        ferramentas: form.ferramentas.map((f) => ({
          ferramentaId: f,
          quantidade: 1,
        })),
      };

      await localService.criar(localData);
      setSuccess('Local cadastrado com sucesso!');

      setTimeout(() => navigate('/locais'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cadastrar local');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setForm({
      nome: '',
      descricao: '',
      imagemUrl: '',
      rua: '',
      numero: '',
      cep: '',
      dataInicio: '',
      dataFinal: '',
      ferramentas: []
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="flex-1 flex flex-col">

      {/* HEADER IGUAL AO PRIMEIRO */}
      <header className="flex justify-between items-center p-6 bg-gray-100">
        <h3 className="text-lg font-bold" style={{ color: '#00715D' }}>
          Adicionar novo Local
        </h3>

        <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-800">{usuario?.nomeCompleto}</p>
            <p className="text-xs text-gray-400">
              {usuario?.isAdmin ? "Administrador" : "Voluntário"}
            </p>
          </div>

          <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
            {usuario?.nomeCompleto?.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="p-8 bg-gray-100 flex-1 overflow-y-auto">

        {/* SCROLLBAR IGUAL DO PRIMEIRO */}
        <style>{`
          .custom-scroll { scrollbar-width: thin; scrollbar-color: #cbd5db transparent; }
          .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
          .custom-scroll::-webkit-scrollbar-track { background: transparent; border-radius: 9999px; }
          .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5db; border-radius: 9999px; }
          .custom-scroll::-webkit-scrollbar-thumb:hover { background: #aab7bf; }
        `}</style>

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">

          {/* ERRO / SUCESSO */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* NOME */}
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Nome do Local *</span>
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex: Parque Central"
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400"
              />
            </label>

            {/* DESCRIÇÃO */}
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Descrição *</span>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Breve descrição do local"
                className="mt-2 w-full h-28 p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400"
              />
            </label>

            {/* ENDEREÇO */}
            <div className="grid grid-cols-12 gap-4">
              <label className="col-span-8">
                <span className="text-sm font-medium text-gray-700">Rua *</span>
                <input
                  name="rua"
                  value={form.rua}
                  onChange={handleChange}
                  placeholder="Rua Exemplo"
                  className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
                />
              </label>

              <label className="col-span-2">
                <span className="text-sm font-medium text-gray-700">Número *</span>
                <input
                  name="numero"
                  value={form.numero}
                  onChange={handleChange}
                  placeholder="108"
                  className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
                />
              </label>

              <label className="col-span-2">
                <span className="text-sm font-medium text-gray-700">CEP *</span>
                <input
                  name="cep"
                  value={form.cep}
                  onChange={handleChange}
                  placeholder="00000-000"
                  className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
                />
              </label>
            </div>

            {/* DATAS */}
            <div className="grid grid-cols-2 gap-4">
              <label>
                <span className="text-sm font-medium text-gray-700">Data início *</span>
                <div className="mt-2 relative">
                  <input
                    type="date"
                    name="dataInicio"
                    value={form.dataInicio}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  <Calendar className="absolute right-3 top-2 w-4 h-4" style={{ color: '#00715D' }} />
                </div>
              </label>

              <label>
                <span className="text-sm font-medium text-gray-700">Data final *</span>
                <div className="mt-2 relative">
                  <input
                    type="date"
                    name="dataFinal"
                    value={form.dataFinal}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  <Calendar className="absolute right-3 top-2 w-4 h-4" style={{ color: '#00715D' }} />
                </div>
              </label>
            </div>

            {/* FERRAMENTAS — usando o mesmo layout do Equipamentos */}
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Ferramentas</span>

              <div className="mt-2 grid grid-cols-2 gap-4">

                {/* LISTA */}
                <div className="border border-gray-300 rounded-lg p-3 h-48 overflow-y-auto bg-white custom-scroll">
                  {carregandoFerramentas ? (
                    <p className="text-gray-400 text-sm">Carregando...</p>
                  ) : (
                    ferramentasDisponiveis.map((f) => (
                      <label
                        key={f.id}
                        className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 p-1 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={form.ferramentas.includes(f.id)}
                          onChange={() => handleFerramentaToggle(f.id)}
                          className="w-3 h-3"
                          style={{ accentColor: '#00715D' }}
                        />
                        <span className="text-sm text-gray-700">{f.nome}</span>
                      </label>
                    ))
                  )}
                </div>

                {/* SELECIONADOS */}
                <div className="border border-gray-300 rounded-lg p-3 h-48 overflow-y-auto bg-white custom-scroll">
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    Selecionados ({form.ferramentas.length})
                  </p>

                  {form.ferramentas.length === 0 ? (
                    <p className="text-xs text-gray-400">Nenhuma ferramenta selecionada</p>
                  ) : (
                    form.ferramentas.map((id) => {
                      const ferr = ferramentasDisponiveis.find((x) => x.id === id);
                      if (!ferr) return null;

                      return (
                        <div
                          key={id}
                          className="flex items-center justify-between gap-2 py-1 px-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded mb-1"
                        >
                          <span>{ferr.nome}</span>

                          <button
                            type="button"
                            onClick={() => handleRemoveFerramenta(id)}
                            className="p-0 m-0 bg-transparent border-0"
                          >
                            <X size={16} strokeWidth={2} color="#00715D" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </label>

            {/* BOTÕES */}
            <div className="flex items-center justify-center gap-6 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 rounded-md text-white font-medium"
                style={{ backgroundColor: '#00715D' }}
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  "Adicionar"
                )}
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="px-6 py-2 rounded-md text-white font-medium bg-red-600 hover:bg-red-700"
              >
                Limpar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
