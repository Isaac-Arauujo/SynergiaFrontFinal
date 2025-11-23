// src/services/inscricaoService.js
import api from './api';

export const inscricaoService = {
  // GET /api/inscricoes
  listarTodas: async () => {
    const res = await api.get('/inscricoes');
    return res.data;
  },

  // GET /api/inscricoes/{id}
  buscarPorId: async (id) => {
    const res = await api.get(`/inscricoes/${id}`);
    return res.data;
  },

  // GET /api/inscricoes/{id}/debug (se precisar)
  debug: async (id) => {
    const res = await api.get(`/inscricoes/${id}/debug`);
    return res.data;
  },

  // POST /api/inscricoes
  criar: async (payload) => {
    const res = await api.post('/inscricoes', payload);
    return res.data;
  },

  // PUT /api/inscricoes/{id}/confirmar (aprovacao)
  confirmar: async (id) => {
    const res = await api.put(`/inscricoes/${id}/confirmar`);
    return res.data;
  },

  // PUT /api/inscricoes/{id}/recusar (recusa) - pode enviar motivo
  recusar: async (id, payload = {}) => {
    // backend espera PUT com body opcional { motivo: "..." }
    const res = await api.put(`/inscricoes/${id}/recusar`, payload);
    return res.data;
  },

  // DELETE /api/inscricoes/{id}
  excluir: async (id) => {
    const res = await api.delete(`/inscricoes/${id}`);
    return res.data;
  },

  // Listar por usuário, status, local (opcional)
  listarPorUsuario: async (usuarioId) => {
    const res = await api.get(`/inscricoes/usuario/${usuarioId}`);
    return res.data;
  },

  listarPorStatus: async (status) => {
    const res = await api.get(`/inscricoes/status/${status}`);
    return res.data;
  },

  listarPorLocal: async (localId) => {
    const res = await api.get(`/inscricoes/local/${localId}`);
    return res.data;
  }
};
