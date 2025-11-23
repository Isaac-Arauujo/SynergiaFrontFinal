import api from './api';

export const inscricaoService = {
  // Listar todas as inscrições
  listarTodas: async () => {
    const response = await api.get('/inscricoes');
    return response.data;
  },

  // Listar por status
  listarPorStatus: async (status) => {
    const response = await api.get(`/inscricoes/status/${status}`);
    return response.data;
  },

  // Listar por usuário
  listarPorUsuario: async (usuarioId) => {
    const response = await api.get(`/inscricoes/usuario/${usuarioId}`);
    return response.data;
  },

  // Listar por local
  listarPorLocal: async (localId) => {
    const response = await api.get(`/inscricoes/local/${localId}`);
    return response.data;
  },

  // Buscar inscrição por ID
  buscarPorId: async (id) => {
    const response = await api.get(`/inscricoes/${id}`);
    return response.data;
  },

  // Criar nova inscrição
  criar: async (usuarioId, inscricaoData) => {
    const response = await api.post(`/inscricoes/usuario/${usuarioId}`, inscricaoData);
    return response.data;
  },

  // Confirmar inscrição
  confirmar: async (id) => {
    const response = await api.put(`/inscricoes/${id}/confirmar`);
    return response.data;
  },

  // Recusar inscrição
  recusar: async (id) => {
    const response = await api.put(`/inscricoes/${id}/recusar`);
    return response.data;
  },

  // Atualizar status
  atualizarStatus: async (id, status) => {
    const response = await api.put(`/inscricoes/${id}/status?status=${status}`);
    return response.data;
  },

  // Cancelar inscrição
  cancelar: async (id) => {
    const response = await api.delete(`/inscricoes/${id}`);
    return response.data;
  },

  // Verificar se usuário já está inscrito
  verificarInscricaoExistente: async (usuarioId, localId) => {
    const response = await api.get(`/inscricoes/verificar/${usuarioId}/${localId}`);
    return response.data;
  }
};