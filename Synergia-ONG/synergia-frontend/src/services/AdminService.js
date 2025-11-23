import api from './api';

export const adminService = {
  // Estatísticas do dashboard
  getEstatisticas: async () => {
    const response = await api.get('/admin/dashboard/estatisticas');
    return response.data;
  },

  // Gerenciamento de usuários
  listarUsuarios: async () => {
    const response = await api.get('/admin/usuarios');
    return response.data;
  },

  // Aprovar/recusar locais pendentes
  aprovarLocal: async (localId) => {
    const response = await api.put(`/admin/locais/${localId}/aprovar`);
    return response.data;
  },

  recusarLocal: async (localId) => {
    const response = await api.put(`/admin/locais/${localId}/recusar`);
    return response.data;
  },

  // Gerenciar locais pendentes
  getLocaisPendentes: async () => {
    const response = await api.get('/admin/locais/pendentes');
    return response.data;
  },

  // Relatórios
  getRelatorioInscricoes: async (dataInicio, dataFim) => {
    const response = await api.get(`/admin/relatorios/inscricoes?dataInicio=${dataInicio}&dataFim=${dataFim}`);
    return response.data;
  },

  getRelatorioLocais: async () => {
    const response = await api.get('/admin/relatorios/locais');
    return response.data;
  }
};