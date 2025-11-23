import api from './api';

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
    const response = await api.get(`/locais/disponiveis?data=${data}`);
    return response.data;
  },

  // Verificar disponibilidade
  verificarDisponibilidade: async (id, data) => {
    const response = await api.get(`/locais/${id}/disponibilidade?data=${data}`);
    return response.data;
  },

  // Criar novo local
  criar: async (localData) => {
    const response = await api.post('/locais', localData);
    return response.data;
  },

  // Atualizar local
  atualizar: async (id, localData) => {
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