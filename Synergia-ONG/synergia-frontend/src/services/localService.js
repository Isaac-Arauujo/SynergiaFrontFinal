// src/services/localService.js
import api from './api';

/**
 * localService atualizado:
 * - NÃO define manualmente 'Content-Type' ao enviar FormData (deixa o browser setar boundary)
 * - aceita options em criar/atualizar para forçar isFormData
 */
export const localService = {
  // Listar todos os locais
  listarTodos: async () => {
    const response = await api.get('/locais');
    return response.data;
  },

  // Buscar local por ID
  buscarPorId: async (id) => {
    const response = await api.get(`/locais/${id}`);
    return response.data;
  },

  // Locais disponíveis na data
  listarDisponiveisNaData: async (data) => {
    const response = await api.get(`/locais/disponiveis?data=${encodeURIComponent(data)}`);
    return response.data;
  },

  // Verificar disponibilidade
  verificarDisponibilidade: async (id, data) => {
    const response = await api.get(`/locais/${id}/disponibilidade?data=${encodeURIComponent(data)}`);
    return response.data;
  },

  // Criar novo local
  // localData pode ser objeto plain JS ou FormData
  // options: { isFormData: boolean }
  criar: async (localData, options = {}) => {
    if (localData instanceof FormData || options.isFormData) {
      // NÃO setar headers aqui. axios/browser vai setar Content-Type com boundary.
      const response = await api.post('/locais', localData);
      return response.data;
    }
    const response = await api.post('/locais', localData);
    return response.data;
  },

  // Atualizar local (aceita FormData ou JSON)
  atualizar: async (id, localData, options = {}) => {
    if (localData instanceof FormData || options.isFormData) {
      const response = await api.put(`/locais/${id}`, localData);
      return response.data;
    }
    const response = await api.put(`/locais/${id}`, localData);
    return response.data;
  },

  // Excluir local
  excluir: async (id) => {
    const response = await api.delete(`/locais/${id}`);
    return response.data;
  },

  // Buscar locais por usuário
  listarPorUsuario: async (usuarioId) => {
    const response = await api.get(`/locais/usuario/${usuarioId}`);
    return response.data;
  }
};

export default localService;
