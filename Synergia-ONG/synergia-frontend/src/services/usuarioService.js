// src/services/usuarioService.js
import api from './api';
import { normalizeObjectKeys } from '../utils/normalize';

export const usuarioService = {
  // login que retorna dados normalizados
  login: async (email, senha) => {
    const res = await api.post('/usuarios/login', { email, senha });
    return normalizeObjectKeys(res.data);
  },

  cadastrar: async (data) => {
    const res = await api.post('/usuarios/cadastro', data);
    return normalizeObjectKeys(res.data);
  },

  obterPerfil: async (usuarioId) => {
    const res = await api.get(`/meu-perfil/${usuarioId}`);
    return normalizeObjectKeys(res.data);
  },

  atualizarPerfil: async (usuarioId, payload) => {
    const res = await api.put(`/meu-perfil/${usuarioId}`, payload);
    return normalizeObjectKeys(res.data);
  },

  // outros métodos que já existiam (se precisar ajuste)
  listarTodos: async () => {
    const res = await api.get('/usuarios');
    return Array.isArray(res.data) ? res.data.map(normalizeObjectKeys) : normalizeObjectKeys(res.data);
  },

  buscarPorId: async (id) => {
    const res = await api.get(`/usuarios/${id}`);
    return normalizeObjectKeys(res.data);
  }
};
