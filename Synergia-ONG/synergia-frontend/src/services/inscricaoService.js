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

  // debug
  debug: async (id) => {
    const res = await api.get(`/inscricoes/${id}/debug`);
    return res.data;
  },

  // POST /api/inscricoes
  // payload: { localId, dataDesejada }
  // usuarioId: opcional -> header 'Usuario-ID'
  criar: async (payload, usuarioId = null) => {
    const config = {
      // timeout aumentado especificamente para este endpoint (60s)
      timeout: 60000,
      headers: {}
    };
    if (usuarioId) {
      config.headers['Usuario-ID'] = String(usuarioId);
    }
    const res = await api.post('/inscricoes', payload, config);
    return res.data;
  },

  confirmar: async (id) => {
    const res = await api.put(`/inscricoes/${id}/confirmar`);
    return res.data;
  },

  recusar: async (id, payload = {}) => {
    const res = await api.put(`/inscricoes/${id}/recusar`, payload);
    return res.data;
  },

  excluir: async (id) => {
    const res = await api.delete(`/inscricoes/${id}`);
    return res.data;
  },

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

export default inscricaoService;
