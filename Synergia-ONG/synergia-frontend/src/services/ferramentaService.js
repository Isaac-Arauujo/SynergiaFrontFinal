// src/services/ferramentaService.js
import api from './api';

export const ferramentaService = {
  // Listar todas as ferramentas
  listarTodas: async () => {
    const response = await api.get('/ferramentas');
    return response.data;
  },

  // Listar ferramentas disponíveis
  listarDisponiveis: async () => {
    const response = await api.get('/ferramentas/disponiveis');
    return response.data;
  },

  // Buscar ferramenta por ID
  buscarPorId: async (id) => {
    const response = await api.get(`/ferramentas/${id}`);
    return response.data;
  },

  // Criar nova ferramenta (payload deve corresponder ao FerramentaDTO do backend)
  criar: async (payload) => {
    // payload esperado (exemplos): { nome, descricao, imagemUrl, quantidade, quantidadeDisponivel }
    const response = await api.post('/ferramentas', payload);
    return response.data;
  },

  // Atualizar
  atualizar: async (id, payload) => {
    const response = await api.put(`/ferramentas/${id}`, payload);
    return response.data;
  },

  // Excluir ferramenta
  excluir: async (id) => {
    const response = await api.delete(`/ferramentas/${id}`);
    return response.data;
  },

  // Buscar ferramentas por local
  listarPorLocal: async (localId) => {
    const response = await api.get(`/ferramentas/local/${localId}`);
    return response.data;
  }
};
