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
    const res = await api.get(`/meu-perfil/${usuarioId}`);
    return res.data; // espera PerfilResponse { usuario, inscricoes }
  },

  /**
   * atualizarPerfil: tenta primeiro /meu-perfil/{id}, se 404 tenta /usuarios/{id}
   * Retorna o res.data do endpoint bem-sucedido.
   */
  atualizarPerfil: async (usuarioId, payload) => {
    // tenta /meu-perfil primeiro
    try {
      const res = await api.put(`/meu-perfil/${usuarioId}`, payload);
      return res.data;
    } catch (err) {
      // se 404 ou 405 ou 400, tenta rota alternativa /usuarios/{id}
      if (err?.response && [404, 405, 400].includes(err.response.status)) {
        try {
          const res2 = await api.put(`/usuarios/${usuarioId}`, payload);
          return res2.data;
        } catch (err2) {
          // lança o erro original ou o segundo, para o caller tratar
          throw err2 || err;
        }
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
