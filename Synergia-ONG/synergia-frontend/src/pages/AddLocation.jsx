import React, { useState, useEffect } from 'react';
import { Calendar, X, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { localService } from '../services/localService';
import { ferramentaService } from '../services/ferramentaService';

export default function AddLocation() {
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    imagemUrl: '', // apenas URL
    rua: '',
    numero: '',
    cep: '',
    dataInicio: '',
    dataFinal: '',
    ferramentas: [] // array de { ferramentaId, quantidade }
  });

  const [ferramentasDisponiveis, setFerramentasDisponiveis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [carregandoFerramentas, setCarregandoFerramentas] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { usuario } = useAuth();

  useEffect(() => {
    carregarFerramentas();
    // eslint-disable-next-line
  }, []);

  const carregarFerramentas = async () => {
    try {
      setCarregandoFerramentas(true);
      const ferramentas = await ferramentaService.listarDisponiveis();
      setFerramentasDisponiveis(ferramentas || []);
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

  // toggle seleciona/deseleciona: se selecionar adiciona com quantidade 1
  const handleFerramentaToggle = (fId) => {
    setForm((prev) => {
      const exists = prev.ferramentas.find(f => f.ferramentaId === fId);
      if (exists) {
        return { ...prev, ferramentas: prev.ferramentas.filter(f => f.ferramentaId !== fId) };
      } else {
        return { ...prev, ferramentas: [...prev.ferramentas, { ferramentaId: fId, quantidade: 1 }] };
      }
    });
  };

  const handleQuantidadeChange = (fId, value) => {
    const q = Number(value);
    if (isNaN(q) || q < 1) return;
    setForm(prev => ({
      ...prev,
      ferramentas: prev.ferramentas.map(f => f.ferramentaId === fId ? { ...f, quantidade: q } : f)
    }));
  };

  const handleRemoveFerramenta = (id) => {
    setForm((prev) => ({
      ...prev,
      ferramentas: prev.ferramentas.filter((x) => x.ferramentaId !== id)
    }));
  };

  const validateForm = () => {
    if (!form.nome.trim()) { setError('Nome do local é obrigatório'); return false; }
    if (!form.descricao.trim()) { setError('Descrição é obrigatória'); return false; }
    if (!form.rua.trim()) { setError('Rua é obrigatória'); return false; }
    if (!form.numero.trim()) { setError('Número é obrigatório'); return false; }
    if (!form.cep.trim()) { setError('CEP é obrigatório'); return false; }
    if (!form.dataInicio) { setError('Data de início é obrigatória'); return false; }
    if (!form.dataFinal) { setError('Data final é obrigatória'); return false; }
    if (new Date(form.dataInicio) >= new Date(form.dataFinal)) { setError('Data final deve ser posterior à data de início'); return false; }
    if (!form.imagemUrl || !form.imagemUrl.trim()) { setError('Informe a URL da imagem'); return false; }
    // validar quantidades
    for (const f of form.ferramentas) {
      if (!f.quantidade || Number(f.quantidade) < 1) { setError('Quantidade de ferramentas deve ser >= 1'); return false; }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      // montar payload: já está no formato esperado: lista de { ferramentaId, quantidade }
      const payload = {
        nome: form.nome,
        descricao: form.descricao,
        imagemUrl: form.imagemUrl,
        rua: form.rua,
        numero: form.numero,
        cep: form.cep,
        dataInicio: form.dataInicio,
        dataFinal: form.dataFinal,
        ferramentas: form.ferramentas.map(f => ({ ferramentaId: f.ferramentaId, quantidade: Number(f.quantidade) }))
      };

      const created = await localService.criar(payload);
      setSuccess('Local cadastrado com sucesso!');
      if (created?.id) setTimeout(() => navigate(`/locais/detalhe/${created.id}`), 600);
      else setTimeout(() => navigate('/locais'), 600);

    } catch (err) {
      console.error('Erro ao criar local:', err);
      const message = err?.response?.data?.message
        || (err?.response?.data ? JSON.stringify(err.response.data) : null)
        || err.message
        || 'Erro ao cadastrar local';
      setError(message);
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
      <header className="flex justify-between items-center p-6 bg-gray-100">
        <h3 className="text-lg font-bold" style={{ color: '#00715D' }}>Adicionar novo Local (URL de imagem)</h3>
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-800">{usuario?.nomeCompleto}</p>
            <p className="text-xs text-gray-400">{usuario?.isAdmin ? "Administrador" : "Voluntário"}</p>
          </div>
          <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
            {usuario?.nomeCompleto?.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </header>

      <main className="p-8 bg-gray-100 flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Nome do Local *</span>
              <input name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Parque Central" className="mt-2 w-full p-3 border border-gray-300 rounded-lg" />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Descrição *</span>
              <textarea name="descricao" value={form.descricao} onChange={handleChange} placeholder="Breve descrição do local" className="mt-2 w-full h-28 p-3 border border-gray-300 rounded-lg" />
            </label>

            <label>
              <span className="text-sm font-medium text-gray-700">URL da Imagem *</span>
              <input name="imagemUrl" value={form.imagemUrl} onChange={handleChange} placeholder="https://..." className="mt-2 w-full p-2 border border-gray-300 rounded-lg" />
            </label>

            <div className="grid grid-cols-12 gap-4">
              <label className="col-span-8">
                <span className="text-sm font-medium text-gray-700">Rua *</span>
                <input name="rua" value={form.rua} onChange={handleChange} placeholder="Rua Exemplo" className="mt-2 w-full p-2 border border-gray-300 rounded-lg" />
              </label>

              <label className="col-span-2">
                <span className="text-sm font-medium text-gray-700">Número *</span>
                <input name="numero" value={form.numero} onChange={handleChange} placeholder="108" className="mt-2 w-full p-2 border border-gray-300 rounded-lg" />
              </label>

              <label className="col-span-2">
                <span className="text-sm font-medium text-gray-700">CEP *</span>
                <input name="cep" value={form.cep} onChange={handleChange} placeholder="00000000" className="mt-2 w-full p-2 border border-gray-300 rounded-lg" />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label>
                <span className="text-sm font-medium text-gray-700">Data início *</span>
                <div className="mt-2 relative">
                  <input type="date" name="dataInicio" value={form.dataInicio} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
                  <Calendar className="absolute right-3 top-2 w-4 h-4" style={{ color: '#00715D' }} />
                </div>
              </label>

              <label>
                <span className="text-sm font-medium text-gray-700">Data final *</span>
                <div className="mt-2 relative">
                  <input type="date" name="dataFinal" value={form.dataFinal} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
                  <Calendar className="absolute right-3 top-2 w-4 h-4" style={{ color: '#00715D' }} />
                </div>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Ferramentas (selecione e informe quantidade)</span>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div className="border border-gray-300 rounded-lg p-3 h-48 overflow-y-auto bg-white">
                  {carregandoFerramentas ? (
                    <p className="text-gray-400 text-sm">Carregando...</p>
                  ) : (
                    ferramentasDisponiveis.map((f) => {
                      const selected = form.ferramentas.find(x => x.ferramentaId === f.id);
                      return (
                        <label key={f.id} className="flex items-center justify-between py-1 cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input type="checkbox" checked={!!selected} onChange={() => handleFerramentaToggle(f.id)} />
                            <span className="text-sm text-gray-700">{f.nome}</span>
                          </div>
                          {selected && (
                            <input
                              type="number"
                              min={1}
                              value={selected.quantidade}
                              onChange={(e) => handleQuantidadeChange(f.id, e.target.value)}
                              style={{ width: 64, padding: '4px 6px', borderRadius: 6, border: '1px solid #ddd' }}
                              title="Quantidade"
                            />
                          )}
                        </label>
                      );
                    })
                  )}
                </div>

                <div className="border border-gray-300 rounded-lg p-3 h-48 overflow-y-auto bg-white">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Selecionados ({form.ferramentas.length})</p>
                  {form.ferramentas.length === 0 ? (
                    <p className="text-xs text-gray-400">Nenhuma ferramenta selecionada</p>
                  ) : (
                    form.ferramentas.map((f) => {
                      const ferr = ferramentasDisponiveis.find((x) => x.id === f.ferramentaId);
                      return (
                        <div key={f.ferramentaId} className="flex items-center justify-between gap-2 py-1 px-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded mb-1">
                          <span>{ferr ? ferr.nome : `#${f.ferramentaId}`}</span>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span className="text-xs text-gray-600">x{f.quantidade}</span>
                            <button type="button" onClick={() => handleRemoveFerramenta(f.ferramentaId)} className="p-0 m-0 bg-transparent border-0">
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </label>

            <div className="flex items-center justify-center gap-6 pt-4">
              <button type="submit" disabled={loading} className="px-8 py-2 rounded-md text-white font-medium" style={{ backgroundColor: '#00715D' }}>
                {loading ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : "Adicionar"}
              </button>

              <button type="button" onClick={handleRemove} className="px-6 py-2 rounded-md text-white font-medium bg-red-600 hover:bg-red-700">Limpar</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
