import React, { useState, useEffect } from 'react';
import { Search, Phone, Mail, ChevronRight, Loader, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { inscricaoService } from '../services/inscricaoService';

// Componente Card de Inscrição
const InscricaoCard = ({ item, onClick }) => {
    const imgUrl = item.usuarioFoto || 'https://via.placeholder.com/150?text=User';

    return (
        <div 
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-300"
            style={{ cursor: item.status === 'PENDENTE' ? 'pointer' : 'default' }}
            onClick={() => item.status === 'PENDENTE' && onClick(item.id)}
        >
            <div className="relative mb-3">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-2 bg-gray-200">
                    {imgUrl ? (
                        <img src={imgUrl} alt={item.usuarioNome} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-full h-full p-4 text-gray-400" />
                    )}
                </div>

                <span className={`absolute bottom-0 right-0 text-white text-xs font-semibold px-2 py-0.5 rounded-md transform translate-y-1/2 ${
                    item.status === 'CONFIRMADA' ? 'bg-green-600' : 
                    item.status === 'RECUSADA' ? 'bg-red-600' : 'bg-yellow-600'
                }`}>
                    {item.status === 'PENDENTE' ? 'Pendente' : 
                     item.status === 'CONFIRMADA' ? 'Aprovada' : 'Recusada'}
                </span>
            </div>

            <h4 className="text-sm font-bold text-gray-800 mt-2 text-center">{item.usuarioNome}</h4>
            <p className="text-xs text-gray-500 mb-4">{item.usuarioIdade} anos</p>

            <div className="w-full space-y-2">
                <div className="flex items-center text-xs text-gray-600">
                    <Phone className="w-3 h-3 mr-2 text-synergia-green" />
                    {item.usuarioTelefone || 'Não informado'}
                </div>
                <div className="flex items-center text-xs text-gray-600">
                    <Mail className="w-3 h-3 mr-2 text-synergia-green" />
                    {item.usuarioEmail}
                </div>
                <div className="flex items-center text-xs text-gray-600">
                    <ChevronRight className="w-3 h-3 mr-2 text-synergia-green" />
                    {item.localNome}
                </div>
            </div>

            {item.status === 'PENDENTE' && (
                <button className="mt-4 flex items-center text-xs font-medium bg-synergia-green text-white px-4 py-2 rounded-lg hover:bg-synergia-dark transition-colors">
                    Verificar <ChevronRight className="w-3 h-3 ml-1" />
                </button>
            )}
        </div>
    );
};

export default function Inscricoes() {
    const [inscricoes, setInscricoes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('todas');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const itemsPerPage = 10;

    useEffect(() => {
        carregarInscricoes();
    }, []);

    const carregarInscricoes = async () => {
        try {
            setLoading(true);
            const dados = await inscricaoService.listarTodas();
            setInscricoes(dados);
        } catch (err) {
            setError('Erro ao carregar inscrições');
            console.error('Erro:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileClick = () => {
        navigate('/admin');
    };

    const handleInscricaoClick = (id) => navigate(`/inscricoes/detalhe/${id}`);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    // Filtrar dados baseado na tab ativa
    let baseData = inscricoes;
    if (activeTab === 'pendentes') {
        baseData = inscricoes.filter(i => i.status === 'PENDENTE');
    } else if (activeTab === 'confirmadas') {
        baseData = inscricoes.filter(i => i.status === 'CONFIRMADA');
    } else if (activeTab === 'recusadas') {
        baseData = inscricoes.filter(i => i.status === 'RECUSADA');
    }

    // Aplicar busca
    const filteredData = baseData.filter(item =>
        item.usuarioNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.usuarioEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.localNome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPending = inscricoes.filter(i => i.status === 'PENDENTE').length;
    const totalConfirmadas = inscricoes.filter(i => i.status === 'CONFIRMADA').length;
    const totalRecusadas = inscricoes.filter(i => i.status === 'RECUSADA').length;

    if (loading) {
        return (
            <div className="p-8 w-full bg-white flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader size={32} className="animate-spin mx-auto mb-4 text-synergia-green" />
                    <p className="text-gray-600">Carregando inscrições...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 w-full bg-white min-h-screen">
            {/* HEADER */}
            <header className="flex justify-between items-center pb-6 border-b border-gray-200">
                <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-synergia-green">Inscrições</h3>
                    <p className="text-sm text-gray-500">Lista de Inscrições</p>
                </div>

                <div className="flex items-center space-x-6">
                    {/* TABS */}
                    <div className="flex space-x-3">
                        <button
                            onClick={() => { setActiveTab('todas'); setSearchTerm(''); setCurrentPage(1); }}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                                activeTab === 'todas'
                                    ? 'bg-synergia-green text-white hover:bg-synergia-dark'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                        >
                            Todas ({inscricoes.length})
                        </button>

                        <button
                            onClick={() => { setActiveTab('pendentes'); setSearchTerm(''); setCurrentPage(1); }}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                                activeTab === 'pendentes'
                                    ? 'bg-synergia-green text-white hover:bg-synergia-dark'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                        >
                            Pendentes ({totalPending})
                        </button>

                        <button
                            onClick={() => { setActiveTab('confirmadas'); setSearchTerm(''); setCurrentPage(1); }}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                                activeTab === 'confirmadas'
                                    ? 'bg-synergia-green text-white hover:bg-synergia-dark'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                        >
                            Confirmadas ({totalConfirmadas})
                        </button>

                        <button
                            onClick={() => { setActiveTab('recusadas'); setSearchTerm(''); setCurrentPage(1); }}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                                activeTab === 'recusadas'
                                    ? 'bg-synergia-green text-white hover:bg-synergia-dark'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                        >
                            Recusadas ({totalRecusadas})
                        </button>
                    </div>

                    {/* BUSCA */}
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Buscar inscrições"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:ring-synergia-green focus:border-synergia-green w-full"
                        />
                        <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                </div>

            </header>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-6">
                    {error}
                </div>
            )}

            {/* GRID */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {paginatedData.map(item => (
                    <InscricaoCard key={item.id} item={item} onClick={handleInscricaoClick} />
                ))}
            </div>

            {paginatedData.length === 0 && (
                <div className="text-center py-12">
                    <User size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm ? 'Nenhuma inscrição encontrada' : 'Nenhuma inscrição'}
                    </h3>
                    <p className="text-gray-600">
                        {searchTerm ? 'Tente ajustar os termos da busca.' : 'Não há inscrições no momento.'}
                    </p>
                </div>
            )}

            {/* PAGINAÇÃO */}
            {filteredData.length > itemsPerPage && (
                <div className="flex justify-end items-center mt-8 space-x-2">
                    <span className="text-sm text-gray-500 mr-4">
                        Mostrando {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} inscrições
                    </span>

                    {/* ANTERIOR */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg ${
                            currentPage === 1
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-synergia-green text-white hover:bg-synergia-dark'
                        }`}
                    >
                        &lt;
                    </button>

                    {/* NUMERAÇÃO */}
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                                currentPage === i + 1
                                    ? 'bg-synergia-green text-white'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    {/* PRÓXIMO */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg ${
                            currentPage === totalPages
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-synergia-green text-white hover:bg-synergia-dark'
                        }`}
                    >
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
}