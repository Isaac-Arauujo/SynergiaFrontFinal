import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, Calendar, Loader, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { inscricaoService } from '../services/inscricaoService';
import LocationCard from '../components/LocationCard';

export default function InscricaoDetalhe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { usuario } = useAuth();
    
    const [inscricao, setInscricao] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processando, setProcessando] = useState(false);

    useEffect(() => {
        carregarInscricao();
    }, [id]);

    const carregarInscricao = async () => {
        try {
            setLoading(true);
            const dados = await inscricaoService.buscarPorId(id);
            setInscricao(dados);
        } catch (err) {
            setError('Erro ao carregar inscrição');
            console.error('Erro:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAprovar = async () => {
        if (!window.confirm(`Deseja aprovar a inscrição de ${inscricao.usuarioNome}?`)) {
            return;
        }

        try {
            setProcessando(true);
            await inscricaoService.confirmar(id);
            alert(`Inscrição de ${inscricao.usuarioNome} aprovada com sucesso!`);
            navigate('/inscricoes?tab=pendentes');
        } catch (err) {
            alert('Erro ao aprovar inscrição');
            console.error('Erro:', err);
        } finally {
            setProcessando(false);
        }
    };

    const handleRecusar = async () => {
        if (!window.confirm(`Deseja recusar a inscrição de ${inscricao.usuarioNome}?`)) {
            return;
        }

        try {
            setProcessando(true);
            await inscricaoService.recusar(id);
            alert(`Inscrição de ${inscricao.usuarioNome} recusada.`);
            navigate('/inscricoes?tab=pendentes');
        } catch (err) {
            alert('Erro ao recusar inscrição');
            console.error('Erro:', err);
        } finally {
            setProcessando(false);
        }
    };

    const handleLocationCardClick = () => {
        // Navegar para detalhes do local
        navigate(`/locais/detalhe/${inscricao.localId}`);
    };

    if (loading) {
        return (
            <div className="p-8 w-full bg-gray-50 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader size={32} className="animate-spin mx-auto mb-4 text-synergia-green" />
                    <p className="text-gray-600">Carregando inscrição...</p>
                </div>
            </div>
        );
    }

    if (error || !inscricao) {
        return (
            <div className="p-8 w-full bg-gray-50 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
                        <h3 className="text-lg font-medium mb-2">Inscrição não encontrada</h3>
                        <p className="text-sm">{error || 'A inscrição solicitada não existe.'}</p>
                        <button
                            onClick={() => navigate('/inscricoes')}
                            className="mt-4 bg-synergia-green text-white px-4 py-2 rounded-lg hover:bg-synergia-dark transition-colors"
                        >
                            Voltar para Inscrições
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 w-full bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Detalhes da Inscrição</h2>
                    <p className="text-sm text-gray-500">ID: {inscricao.id}</p>
                </div>
                <button
                    onClick={() => navigate('/inscricoes')}
                    className="text-synergia-green hover:text-synergia-dark font-medium"
                >
                    ← Voltar para Inscrições
                </button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md max-w-6xl mx-auto">
                
                {/* SEÇÃO DE DETALHES PESSOAIS */}
                <div className="flex items-start mb-10">
                    
                    {/* Imagem de Perfil */}
                    <div className="w-48 h-48 bg-gray-200 rounded-full overflow-hidden mr-10 flex-shrink-0 border-4 border-gray-100 shadow-md">
                        {inscricao.usuarioFoto ? (
                            <img 
                                src={inscricao.usuarioFoto} 
                                alt={`Perfil de ${inscricao.usuarioNome}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                <User className="w-16 h-16 text-gray-400" />
                            </div>
                        )}
                    </div>
                    
                    {/* Dados de Contato */}
                    <div className="flex-grow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-bold text-synergia-green">
                                {inscricao.usuarioNome}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                inscricao.status === 'CONFIRMADA' ? 'bg-green-100 text-green-800' :
                                inscricao.status === 'RECUSADA' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                                {inscricao.status === 'PENDENTE' ? 'Pendente' :
                                 inscricao.status === 'CONFIRMADA' ? 'Aprovada' : 'Recusada'}
                            </span>
                        </div>
                        
                        <div className="space-y-3 text-gray-700">
                            <div className="flex items-center text-md">
                                <Calendar className="w-5 h-5 mr-3 text-gray-500" />
                                <span>{inscricao.usuarioIdade} anos</span>
                            </div>
                            <div className="flex items-center text-md">
                                <Phone className="w-5 h-5 mr-3 text-gray-500" />
                                <span>{inscricao.usuarioTelefone || 'Não informado'}</span>
                            </div>
                            <div className="flex items-center text-md">
                                <Mail className="w-5 h-5 mr-3 text-gray-500" />
                                <span>{inscricao.usuarioEmail}</span>
                            </div>
                            <div className="flex items-center text-md">
                                <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                                <span className="font-medium">Data desejada: {new Date(inscricao.dataDesejada).toLocaleDateString('pt-BR')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEÇÃO DO LOCAL */}
                <h3 className="text-xl font-bold mb-4 border-t pt-6 text-synergia-green">
                    Inscrição para o Local:
                </h3>
                
                <div className="flex justify-center md:justify-start mb-8 cursor-pointer" onClick={handleLocationCardClick}>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-sm">
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
                            <h4 className="font-bold text-lg text-gray-800 mb-2">{inscricao.localNome}</h4>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {inscricao.localDescricao}
                            </p>
                            <button className="w-full bg-synergia-green text-white py-2 rounded-lg font-medium hover:bg-synergia-dark transition-colors">
                                Ver Detalhes do Local
                            </button>
                        </div>
                    </div>
                </div>

                {/* BOTÕES DE AÇÃO (apenas para inscrições pendentes) */}
                {inscricao.status === 'PENDENTE' && (
                    <div className="mt-10 flex space-x-4">
                        <button
                            onClick={handleAprovar}
                            disabled={processando}
                            className="px-6 py-3 rounded-lg font-medium text-white transition-colors shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            style={{ backgroundColor: '#00715D' }}
                        >
                            {processando ? (
                                <>
                                    <Loader size={20} className="animate-spin mr-2" />
                                    Processando...
                                </>
                            ) : (
                                'Aceitar Inscrição'
                            )}
                        </button>
                        <button
                            onClick={handleRecusar}
                            disabled={processando}
                            className="px-6 py-3 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {processando ? (
                                <>
                                    <Loader size={20} className="animate-spin mr-2" />
                                    Processando...
                                </>
                            ) : (
                                'Recusar Inscrição'
                            )}
                        </button>
                    </div>
                )}

                {/* Informações adicionais para inscrições já processadas */}
                {inscricao.status !== 'PENDENTE' && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">
                            Esta inscrição foi <strong>
                                {inscricao.status === 'CONFIRMADA' ? 'aprovada' : 'recusada'}
                            </strong> em {new Date(inscricao.updatedAt || inscricao.createdAt).toLocaleDateString('pt-BR')}.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}