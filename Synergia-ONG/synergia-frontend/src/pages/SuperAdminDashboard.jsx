import React, { useState, useEffect } from 'react';
import { MapPin, Users, Settings, FileText, Loader, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { localService } from '../services/localService';
import { inscricaoService } from '../services/inscricaoService';
import { ferramentaService } from '../services/ferramentaService';
import { usuarioService } from '../services/usuarioService';
import LocationCard from '../components/LocationCard';
import LocalPendenteCard from '../components/LocalPendenteCard';

export default function SuperAdminDashboard() {
    const [estatisticas, setEstatisticas] = useState({
        totalUsuarios: 0,
        totalLocais: 0,
        totalFerramentas: 0,
        totalInscricoes: 0,
        inscricoesPendentes: 0,
        inscricoesConfirmadas: 0,
        inscricoesRecusadas: 0
    });
    
    const [locais, setLocais] = useState([]);
    const [locaisPendentes, setLocaisPendentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const { usuario } = useAuth();

    useEffect(() => {
        carregarDashboard();
    }, []);

    const carregarDashboard = async () => {
        try {
            setLoading(true);
            
            // Carregar dados em paralelo
            const [
                usuarios,
                locaisData,
                ferramentas,
                inscricoes,
                inscricoesPendentes
            ] = await Promise.all([
                usuarioService.listarTodos?.(),
                localService.listarTodos(),
                ferramentaService.listarTodas(),
                inscricaoService.listarTodas(),
                inscricaoService.listarPorStatus?.('PENDENTE') || []
            ]);

            // Calcular estatísticas
            setEstatisticas({
                totalUsuarios: usuarios?.length || 0,
                totalLocais: locaisData.length,
                totalFerramentas: ferramentas.length,
                totalInscricoes: inscricoes.length,
                inscricoesPendentes: inscricoesPendentes.length,
                inscricoesConfirmadas: inscricoes.filter(i => i.status === 'CONFIRMADA').length,
                inscricoesRecusadas: inscricoes.filter(i => i.status === 'RECUSADA').length
            });

            setLocais(locaisData.slice(0, 8)); // Mostrar apenas os primeiros 8 locais
            // Simular locais pendentes (em um sistema real viria da API)
            setLocaisPendentes([]);

        } catch (err) {
            setError('Erro ao carregar dashboard');
            console.error('Erro:', err);
        } finally {
            setLoading(false);
        }
    };

    // Funções de Ação para Locais Pendentes
    const handleAprovar = async (localId) => {
        try {
            // Em um sistema real, chamaria a API para aprovar o local
            alert(`Local ID: ${localId} APROVADO!`);
            setLocaisPendentes(prev => prev.filter(local => local.id !== localId));
        } catch (err) {
            alert('Erro ao aprovar local');
        }
    };

    const handleRecusar = async (localId) => {
        try {
            // Em um sistema real, chamaria a API para recusar o local
            alert(`Local ID: ${localId} RECUSADO!`);
            setLocaisPendentes(prev => prev.filter(local => local.id !== localId));
        } catch (err) {
            alert('Erro ao recusar local');
        }
    };

    const handleVerDetalhes = (localId) => {
        // Navegar para detalhes do local
        console.log('Navegar para detalhes do local:', localId);
    };

    if (loading) {
        return (
            <div className="p-8 w-full bg-gray-50 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader size={32} className="animate-spin mx-auto mb-4 text-synergia-green" />
                    <p className="text-gray-600">Carregando dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 w-full bg-gray-50 min-h-screen">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* --- Cabeçalho do Painel --- */}
            <div className="flex items-center mb-10">
                <div className="w-20 h-20 bg-gray-300 rounded-full overflow-hidden mr-6 flex items-center justify-center">
                    {usuario?.fotoPerfil ? (
                        <img 
                            src={usuario.fotoPerfil} 
                            alt="Admin Avatar" 
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                        <Users className="w-10 h-10 text-gray-400" />
                    )}
                </div>
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Olá, {usuario?.nomeCompleto?.split(' ')[0] || 'Admin'}!
                    </h1>
                    <p className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        Painel de Administração
                    </p>
                </div>
            </div>

            <h2 className="text-3xl font-bold mb-10 text-synergia-green">
                Dashboard Administrativo
            </h2>
            
            {/* --- CARDS DE ESTATÍSTICAS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {/* Total de Usuários */}
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                            <p className="text-2xl font-bold text-gray-900">{estatisticas.totalUsuarios}</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-500" />
                    </div>
                </div>

                {/* Total de Locais */}
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Locais Ativos</p>
                            <p className="text-2xl font-bold text-gray-900">{estatisticas.totalLocais}</p>
                        </div>
                        <MapPin className="h-8 w-8 text-green-500" />
                    </div>
                </div>

                {/* Total de Ferramentas */}
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Ferramentas</p>
                            <p className="text-2xl font-bold text-gray-900">{estatisticas.totalFerramentas}</p>
                        </div>
                        <Settings className="h-8 w-8 text-purple-500" />
                    </div>
                </div>

                {/* Inscrições Pendentes */}
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Inscrições Pendentes</p>
                            <p className="text-2xl font-bold text-gray-900">{estatisticas.inscricoesPendentes}</p>
                        </div>
                        <FileText className="h-8 w-8 text-yellow-500" />
                    </div>
                </div>
            </div>

            {/* --- ESTATÍSTICAS DETALHADAS DE INSCRIÇÕES --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <BarChart3 className="h-6 w-6 text-green-500 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Inscrições Confirmadas</p>
                            <p className="text-xl font-bold text-gray-900">{estatisticas.inscricoesConfirmadas}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <BarChart3 className="h-6 w-6 text-yellow-500 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Inscrições Pendentes</p>
                            <p className="text-xl font-bold text-gray-900">{estatisticas.inscricoesPendentes}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <BarChart3 className="h-6 w-6 text-red-500 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Inscrições Recusadas</p>
                            <p className="text-xl font-bold text-gray-900">{estatisticas.inscricoesRecusadas}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ======================================================= */}
            {/* --- LOCAIS PENDENTES DE APROVAÇÃO --- */}
            {/* ======================================================= */}
            {locaisPendentes.length > 0 && (
                <div className="max-w-4xl mb-12">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-yellow-600" />
                        Locais Pendentes de Aprovação ({locaisPendentes.length})
                    </h3>
                    
                    <div className="space-y-4">
                        {locaisPendentes.map(local => (
                            <LocalPendenteCard 
                                key={local.id} 
                                local={local} 
                                onDetalhes={handleVerDetalhes}
                                onAprovar={handleAprovar}
                                onRecusar={handleRecusar}
                            />
                        ))}
                    </div>
                </div>
            )}

            <hr className="border-t border-gray-300 my-10" />

            {/* ======================================================= */}
            {/* --- LOCAIS EXISTENTES (CATÁLOGO) --- */}
            {/* ======================================================= */}
            <div className="max-w-7xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                        Locais Existentes ({locais.length})
                    </h3>
                    <button 
                        onClick={() => window.location.href = '/locais'}
                        className="text-synergia-green hover:text-synergia-dark font-medium"
                    >
                        Ver todos →
                    </button>
                </div>
                
                {locais.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {locais.map(local => (
                            <div key={local.id} onClick={() => handleVerDetalhes(local.id)}>
                                <LocationCard location={local} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum local cadastrado</h3>
                        <p className="text-gray-600 mb-6">Comece adicionando o primeiro local.</p>
                        <button
                            onClick={() => window.location.href = '/locais/novo'}
                            className="bg-synergia-green text-white px-6 py-2 rounded-lg font-medium hover:bg-synergia-dark transition-colors"
                        >
                            Adicionar Primeiro Local
                        </button>
                    </div>
                )}
            </div>
            
            {/* --- Rodapé --- */}
            <p className="text-center text-xs text-gray-400 mt-12">
                Synergia ONG © 2024 - Todos os direitos reservados
            </p>
        </div>
    );
}