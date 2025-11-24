// src/pages/Perfil.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usuarioService } from '../services/usuarioService';
import api from '../services/api';
import { inscricaoService } from '../services/inscricaoService';
import { useNavigate } from 'react-router-dom';
import { Loader, User, Mail, MapPin, Calendar, Edit, Save, X } from 'lucide-react';

/**
 * Perfil.jsx
 * - mantém listagem de inscrições e botão "Ver Detalhes" navegando para /locais/detalhe/:id
 * - edição do perfil atualizada: usa usuarioService.atualizarPerfil quando disponível,
 *   faz fallback para PUT /api/usuarios/{id} via api (axios) quando necessário
 * - atualiza o objeto no contexto usando atualizarUsuario (do AuthContext)
 */

export default function Perfil() {
    const { usuario, logout, atualizarUsuario } = useAuth();
    const navigate = useNavigate();

    const [dadosUsuario, setDadosUsuario] = useState(null);
    const [inscricoes, setInscricoes] = useState([]);
    const [editando, setEditando] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        nomeCompleto: '',
        email: '',
        dataNascimento: '',
        telefone: '',
        fotoPerfil: ''
    });

    useEffect(() => {
        if (usuario) {
            carregarDadosUsuario();
            carregarInscricoes();
        } else {
            setCarregando(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usuario]);

    const carregarDadosUsuario = async () => {
        try {
            setCarregando(true);
            // usar buscarPorId (já existe no seu usuarioService)
            const dados = await usuarioService.buscarPorId(usuario.id);
            setDadosUsuario(dados);
            setFormData({
                nomeCompleto: dados.nomeCompleto || '',
                email: dados.email || '',
                dataNascimento: dados.dataNascimento ? formatDateForInput(dados.dataNascimento) : '',
                telefone: dados.telefone || '',
                fotoPerfil: dados.fotoPerfil || ''
            });
        } catch (err) {
            console.error('Erro ao carregar dados do usuário', err);
            setError('Erro ao carregar dados do usuário');
        } finally {
            setCarregando(false);
        }
    };

    const carregarInscricoes = async () => {
        try {
            const inscricoesData = await inscricaoService.listarPorUsuario(usuario.id);
            setInscricoes(inscricoesData || []);
        } catch (err) {
            console.error('Erro ao carregar inscrições:', err);
            // não interrompe a experiência
        }
    };

    function formatDateForInput(d) {
        if (!d) return '';
        // aceita string ISO ou Date
        try {
            const s = typeof d === 'string' ? d : d.toISOString();
            return s.substring(0, 10);
        } catch {
            return '';
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Normaliza retorno de atualização para objeto usuario
    function normalizeUpdatedUser(res) {
        if (!res) return null;
        if (res.usuario) return res.usuario;
        if (res.data && res.data.usuario) return res.data.usuario;
        if (res.id || res.nomeCompleto) return res;
        // some backends return wrapper like { usuario: {...}, inscricoes: [...] }
        return res;
    }

    const handleSalvar = async () => {
        setSalvando(true);
        setError('');
        setSuccess('');
        try {
            const payload = {
                nomeCompleto: formData.nomeCompleto || undefined,
                dataNascimento: formData.dataNascimento || undefined,
                email: formData.email || undefined,
                telefone: formData.telefone || undefined,
                fotoPerfil: formData.fotoPerfil || undefined
            };
            // remove undefined
            Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

            let updatedRes = null;

            // Tenta usar usuarioService.atualizarPerfil (mais provável)
            if (usuarioService.atualizarPerfil) {
                try {
                    updatedRes = await usuarioService.atualizarPerfil(usuario.id, payload);
                } catch (err) {
                    console.warn('usuarioService.atualizarPerfil falhou, fallback para PUT /usuarios:', err);
                    updatedRes = null; // deixamos cair para fallback
                }
            }

            // Fallback: PUT direto para /api/usuarios/{id}
            if (!updatedRes) {
                const resp = await api.put(`/usuarios/${encodeURIComponent(usuario.id)}`, payload);
                updatedRes = resp.data;
            }

            // Normaliza e atualiza estado/contexto
            const updatedUserObj = normalizeUpdatedUser(updatedRes);
            if (updatedUserObj) {
                // Atualiza dados mostrados na página
                setDadosUsuario(updatedUserObj);
                // Atualiza o formulário com os novos dados (formato input date tratado)
                setFormData({
                    nomeCompleto: updatedUserObj.nomeCompleto || updatedUserObj.nome || '',
                    email: updatedUserObj.email || '',
                    dataNascimento: formatDateForInput(updatedUserObj.dataNascimento),
                    telefone: updatedUserObj.telefone || '',
                    fotoPerfil: updatedUserObj.fotoPerfil || ''
                });

                // Atualiza contexto (AuthContext) para refletir mudança imediatamente
                try {
                    if (typeof atualizarUsuario === 'function') {
                        // pode ser que o backend tenha retornado wrapper, então passamos objeto usuário
                        atualizarUsuario(updatedUserObj);
                        // também atualizar localStorage (AuthContext normalmente faz)
                        try {
                            localStorage.setItem('synergia_usuario', JSON.stringify(updatedUserObj));
                        } catch (e) {
                            console.warn('Falha ao gravar localStorage após update', e);
                        }
                    }
                } catch (e) {
                    console.warn('Falha ao atualizar contexto do usuário', e);
                }

                setSuccess('Dados atualizados com sucesso!');
                setEditando(false);
            } else {
                setError('Atualização realizada, mas resposta inesperada do servidor.');
            }
        } catch (err) {
            console.error('Erro ao salvar perfil:', err);
            // tenta extrair mensagem do backend
            const msg = err?.response?.data?.message || err?.message || 'Erro ao atualizar dados';
            setError(String(msg));
        } finally {
            setSalvando(false);
        }
    };

    const handleCancelar = () => {
        if (dadosUsuario) {
            setFormData({
                nomeCompleto: dadosUsuario.nomeCompleto || '',
                email: dadosUsuario.email || '',
                dataNascimento: formatDateForInput(dadosUsuario.dataNascimento),
                telefone: dadosUsuario.telefone || '',
                fotoPerfil: dadosUsuario.fotoPerfil || ''
            });
        }
        setEditando(false);
        setError('');
        setSuccess('');
    };

    const calcularIdade = (dataNascimento) => {
        if (!dataNascimento) return '';
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return idade;
    };

    if (carregando) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader size={32} className="animate-spin mx-auto mb-4 text-synergia-green" />
                    <p className="text-gray-600">Carregando perfil...</p>
                </div>
            </div>
        );
    }

    if (!dadosUsuario) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
                        <h3 className="text-lg font-medium mb-2">Erro ao carregar perfil</h3>
                        <p className="text-sm">{error || 'Não foi possível carregar os dados do usuário.'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* HEADER */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-synergia-green">Meu Perfil</h1>

                        <button
                            onClick={logout}
                            className="text-red-600 hover:text-red-700 font-medium"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                {/* ERROS E SUCESSO */}
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

                {/* INFO PESSOAIS */}
                <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Informações Pessoais</h2>

                        {!editando ? (
                            <button
                                onClick={() => setEditando(true)}
                                className="flex items-center text-synergia-green hover:text-synergia-dark font-medium"
                            >
                                <Edit size={16} className="mr-1" /> Editar
                            </button>
                        ) : (
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleSalvar}
                                    disabled={salvando}
                                    className="flex items-center bg-synergia-green text-white px-4 py-2 rounded-lg"
                                >
                                    <Save size={16} className="mr-1" /> {salvando ? 'Salvando...' : 'Salvar'}
                                </button>

                                <button
                                    onClick={handleCancelar}
                                    className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg"
                                >
                                    <X size={16} className="mr-1" /> Cancelar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* GRID */}
                    <div className="flex flex-col md:flex-row gap-8">

                        {/* FOTO */}
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden mx-auto md:mx-0">
                                {dadosUsuario.fotoPerfil ? (
                                    <img 
                                        src={dadosUsuario.fotoPerfil}
                                        alt="Foto de perfil"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-full h-full p-8 text-gray-400" />
                                )}
                            </div>

                            {editando && (
                                <div className="mt-4 text-center">
                                    <input
                                        type="url"
                                        name="fotoPerfil"
                                        value={formData.fotoPerfil}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded text-sm"
                                        placeholder="URL da foto"
                                    />
                                </div>
                            )}
                        </div>

                        {/* CAMPOS */}
                        <div className="flex-grow space-y-4">

                            {/* NOME */}
                            <div>
                                <label className="block mb-1 font-medium">Nome Completo</label>
                                {editando ? (
                                    <input
                                        type="text"
                                        name="nomeCompleto"
                                        value={formData.nomeCompleto}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                ) : (
                                    <p>{dadosUsuario.nomeCompleto}</p>
                                )}
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label className="block mb-1 font-medium">E-mail</label>
                                {editando ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                ) : (
                                    <div className="flex items-center">
                                        <Mail size={16} className="mr-2 text-gray-400" />
                                        {dadosUsuario.email}
                                    </div>
                                )}
                            </div>

                            {/* DATA NASCIMENTO */}
                            <div>
                                <label className="block mb-1 font-medium">Data de Nascimento</label>

                                {editando ? (
                                    <input
                                        type="date"
                                        name="dataNascimento"
                                        value={formData.dataNascimento}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                ) : (
                                    <div className="flex items-center">
                                        <Calendar size={16} className="mr-2 text-gray-400" />
                                        {dadosUsuario.dataNascimento ? new Date(dadosUsuario.dataNascimento).toLocaleDateString('pt-BR') : '-'}
                                        <span className="ml-2 text-gray-500">
                                            ({calcularIdade(dadosUsuario.dataNascimento)} anos)
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* TELEFONE */}
                            <div>
                                <label className="block mb-1 font-medium">Telefone</label>
                                {editando ? (
                                    <input
                                        type="tel"
                                        name="telefone"
                                        value={formData.telefone}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                ) : (
                                    <p>{dadosUsuario.telefone || 'Não informado'}</p>
                                )}
                            </div>

                        </div>
                    </div>
                </section>

                {/* LOCAIS DO VOLUNTÁRIO */}
                <section className="bg-white rounded-lg shadow-sm p-6">

                    <h3 className="text-xl font-bold text-gray-800 mb-4">Meus Locais</h3>

                    {inscricoes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {inscricoes.map((inscricao) => {

                                // EXTRAÇÃO SEGURA DO ID DO LOCAL
                                const localId =
                                    inscricao.localId ||
                                    inscricao.local?.id ||
                                    inscricao.local?.localId ||
                                    inscricao.local?.idLocal ||
                                    null;

                                return (
                                    <div
                                        key={inscricao.id}
                                        className="border border-gray-200 rounded-lg overflow-hidden"
                                    >
                                        {/* IMAGEM */}
                                        <div className="h-48 bg-gray-200 overflow-hidden">
                                            {inscricao.localImagem ? (
                                                <img
                                                    src={inscricao.localImagem}
                                                    alt={inscricao.localNome}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                                    <MapPin size={48} className="text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4">

                                            {/* STATUS E DATA */}
                                            <div className="flex justify-between text-sm text-gray-500 mb-2">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-semibold ${
                                                        inscricao.status === 'CONFIRMADA'
                                                            ? 'bg-green-100 text-green-700'
                                                            : inscricao.status === 'PENDENTE'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}
                                                >
                                                    {inscricao.status}
                                                </span>

                                                <span>
                                                    {inscricao.dataDesejada
                                                        ? new Date(inscricao.dataDesejada).toLocaleDateString('pt-BR')
                                                        : '-'}
                                                </span>
                                            </div>

                                            {/* NOME */}
                                            <h4 className="font-bold text-lg">{inscricao.localNome}</h4>

                                            {/* DESCRIÇÃO */}
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {inscricao.localDescricao}
                                            </p>

                                            {/* BOTÃO DE DETALHES */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (!localId) {
                                                        alert('ID do local não disponível');
                                                        console.warn('Inscrição sem localId:', inscricao);
                                                        return;
                                                    }
                                                    navigate(`/locais/detalhe/${localId}`);
                                                }}
                                                className="w-full bg-synergia-green text-white py-2 rounded-lg font-medium hover:bg-synergia-dark transition"
                                            >
                                                Ver Detalhes
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                            <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhuma inscrição</h4>
                            <p className="text-gray-600 mb-6">
                                Você ainda não participou de nenhum local. Explore os projetos!
                            </p>

                            <button
                                onClick={() => navigate('/locais')}
                                className="bg-synergia-green text-white px-6 py-2 rounded-lg font-medium hover:bg-synergia-dark"
                            >
                                Explorar Locais
                            </button>
                        </div>
                    )}
                </section>

            </main>
        </div>
    );
}
