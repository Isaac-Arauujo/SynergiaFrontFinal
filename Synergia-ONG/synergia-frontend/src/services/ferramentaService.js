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

  // Verificar disponibilidade
  verificarDisponibilidade: async (id, quantidade) => {
    const response = await api.get(`/ferramentas/${id}/disponibilidade?quantidade=${quantidade}`);
    return response.data;
  },

  // Criar nova ferramenta
  criar: async (ferramentaData) => {
    const response = await api.post('/ferramentas', ferramentaData);
    return response.data;
  },

  // Atualizar ferramenta
  atualizar: async (id, ferramentaData) => {
    const response = await api.put(`/ferramentas/${id}`, ferramentaData);
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