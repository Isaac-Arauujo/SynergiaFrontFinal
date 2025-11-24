import api from './api';

export const usuarioService = {
  login: async (email, senha) => {
    const res = await api.post('/usuarios/login', { email, senha });
    return res.data;
  },

  cadastrar: async (data) => {
    const res = await api.post('/usuarios/cadastro', data);
    return res.data;
  },

  verificarEmail: async (email) => {
    const res = await api.get(`/usuarios/verificar-email/${encodeURIComponent(email)}`);
    return res.data;
  },

  verificarCpf: async (cpf) => {
    const res = await api.get(`/usuarios/verificar-cpf/${encodeURIComponent(cpf)}`);
    return res.data;
  },

  obterPerfil: async (usuarioId) => {
    try {
      const res = await api.get(`/meu-perfil/${usuarioId}`);
      return res.data;
    } catch (err) {
      if (err?.response && [404, 400].includes(err.response.status)) {
        const res2 = await api.get(`/usuarios/${usuarioId}`);
        return res2.data;
      }
      throw err;
    }
  },

  atualizarPerfil: async (usuarioId, payload) => {
    try {
      const res = await api.put(`/meu-perfil/${usuarioId}`, payload);
      return res.data;
    } catch (err) {
      if (err?.response && [404, 405, 400].includes(err.response.status)) {
        const res2 = await api.put(`/usuarios/${usuarioId}`, payload);
        return res2.data;
      }
      throw err;
    }
  },

  listarTodos: async () => {
    const res = await api.get('/usuarios');
    return res.data;
  },

  buscarPorId: async (id) => {
    const res = await api.get(`/usuarios/${id}`);
    return res.data;
  }
};

export default usuarioService;
