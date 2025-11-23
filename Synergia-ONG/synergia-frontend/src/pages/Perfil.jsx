import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usuarioService } from '../services/usuarioService';
import { inscricaoService } from '../services/inscricaoService';
import { Loader, User, Mail, MapPin, Calendar, Edit, Save, X } from 'lucide-react';

export default function Perfil() {
    const { usuario, logout } = useAuth();
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
        }
    }, [usuario]);

    const carregarDadosUsuario = async () => {
        try {
            setCarregando(true);
            const dados = await usuarioService.buscarPorId(usuario.id);
            setDadosUsuario(dados);
            setFormData({
                nomeCompleto: dados.nomeCompleto || '',
                email: dados.email || '',
                dataNascimento: dados.dataNascimento || '',
                telefone: dados.telefone || '',
                fotoPerfil: dados.fotoPerfil || ''
            });
        } catch (err) {
            setError('Erro ao carregar dados do usuário');
        } finally {
            setCarregando(false);
        }
    };

    const carregarInscricoes = async () => {
        try {
            const inscricoesData = await inscricaoService.listarPorUsuario(usuario.id);
            setInscricoes(inscricoesData);
        } catch (err) {
            console.error('Erro ao carregar inscrições:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSalvar = async () => {
        try {
            setSalvando(true);
            setError('');
            setSuccess('');

            const dadosAtualizados = await usuarioService.atualizar(usuario.id, formData);
            setDadosUsuario(dadosAtualizados);
            setSuccess('Dados atualizados com sucesso!');
            setEditando(false);
        } catch (err) {
            setError('Erro ao atualizar dados');
        } finally {
            setSalvando(false);
        }
    };

    const handleCancelar = () => {
        setFormData({
            nomeCompleto: dadosUsuario.nomeCompleto || '',
            email: dadosUsuario.email || '',
            dataNascimento: dadosUsuario.dataNascimento || '',
            telefone: dadosUsuario.telefone || '',
            fotoPerfil: dadosUsuario.fotoPerfil || ''
        });
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
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-synergia-green">Meu Perfil</h1>
                        </div>
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

                {/* Seção de Informações Pessoais */}
                <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Informações Pessoais</h2>
                        {!editando ? (
                            <button
                                onClick={() => setEditando(true)}
                                className="flex items-center text-synergia-green hover:text-synergia-dark font-medium"
                            >
                                <Edit size={16} className="mr-1" />
                                Editar
                            </button>
                        ) : (
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleSalvar}
                                    disabled={salvando}
                                    className="flex items-center bg-synergia-green text-white px-4 py-2 rounded-lg hover:bg-synergia-dark transition-colors disabled:opacity-50"
                                >
                                    <Save size={16} className="mr-1" />
                                    {salvando ? 'Salvando...' : 'Salvar'}
                                </button>
                                <button
                                    onClick={handleCancelar}
                                    className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    <X size={16} className="mr-1" />
                                    Cancelar
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Foto de Perfil */}
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
                                        placeholder="URL da foto"
                                        className="w-full p-2 border border-gray-300 rounded text-sm"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Dados do Usuário */}
                        <div className="flex-grow space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome Completo
                                </label>
                                {editando ? (
                                    <input
                                        type="text"
                                        name="nomeCompleto"
                                        value={formData.nomeCompleto}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-synergia-green focus:border-synergia-green"
                                    />
                                ) : (
                                    <p className="text-gray-900">{dadosUsuario.nomeCompleto}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    E-mail
                                </label>
                                {editando ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-synergia-green focus:border-synergia-green"
                                    />
                                ) : (
                                    <div className="flex items-center text-gray-900">
                                        <Mail size={16} className="mr-2 text-gray-400" />
                                        {dadosUsuario.email}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Data de Nascimento
                                </label>
                                {editando ? (
                                    <input
                                        type="date"
                                        name="dataNascimento"
                                        value={formData.dataNascimento}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-synergia-green focus:border-synergia-green"
                                    />
                                ) : (
                                    <div className="flex items-center text-gray-900">
                                        <Calendar size={16} className="mr-2 text-gray-400" />
                                        {new Date(dadosUsuario.dataNascimento).toLocaleDateString('pt-BR')}
                                        <span className="ml-2 text-gray-500">
                                            ({calcularIdade(dadosUsuario.dataNascimento)} anos)
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Telefone
                                </label>
                                {editando ? (
                                    <input
                                        type="tel"
                                        name="telefone"
                                        value={formData.telefone}
                                        onChange={handleInputChange}
                                        placeholder="(11) 99999-9999"
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-synergia-green focus:border-synergia-green"
                                    />
                                ) : (
                                    <p className="text-gray-900">{dadosUsuario.telefone || 'Não informado'}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Localização
                                </label>
                                <div className="flex items-center text-gray-900">
                                    <MapPin size={16} className="mr-2 text-gray-400" />
                                    São Paulo, SP
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Seção de Meus Locais */}
                <section className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Meus Locais</h3>
                    
                    {inscricoes.length > 0 ? (
                        <>
                            <p className="text-gray-600 mb-6">
                                Estes são os locais onde você decidiu agir e colocar a mão na massa para transformar o mundo! 
                                Sua participação mostra que pequenas atitudes geram grandes mudanças.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {inscricoes.map(inscricao => (
                                    <div key={inscricao.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="h-48 bg-gray-200 overflow-hidden">
                                            {inscricao.localImagem ? (
                                                <img 
                                                    src={inscricao.localImagem} 
                                                    alt={inscricao.localNome}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                                    <MapPin className="w-12 h-12 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    inscricao.status === 'CONFIRMADA' ? 'bg-green-100 text-green-800' :
                                                    inscricao.status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {inscricao.status === 'PENDENTE' ? 'Pendente' :
                                                     inscricao.status === 'CONFIRMADA' ? 'Confirmada' : 'Recusada'}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(inscricao.dataDesejada).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                            <h5 className="font-bold text-lg text-gray-800 mb-2">
                                                {inscricao.localNome}
                                            </h5>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {inscricao.localDescricao}
                                            </p>
                                            <button className="w-full bg-synergia-green text-white py-2 rounded-lg font-medium hover:bg-synergia-dark transition-colors">
                                                Ver Detalhes
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                            <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhuma inscrição</h4>
                            <p className="text-gray-600 mb-6">
                                Você ainda não se inscreveu em nenhum local. Explore os locais disponíveis e faça a diferença!
                            </p>
                            <button
                                onClick={() => window.location.href = '/locais'}
                                className="bg-synergia-green text-white px-6 py-2 rounded-lg font-medium hover:bg-synergia-dark transition-colors"
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