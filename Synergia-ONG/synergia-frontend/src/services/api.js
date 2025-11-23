import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Key usada no AuthContext
const STORAGE_KEY = 'synergia_usuario';

const api = axios.create({
  baseURL: API_BASE_URL,
  // não forçar Content-Type aqui (evita problemas com FormData)
  timeout: 10000,
});

// Interceptor de request: procura token dentro do objeto salvo (synergia_usuario)
api.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const usuario = JSON.parse(raw);
        const token = usuario?.token || usuario?.authToken || usuario?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      // se parsing falhar, não impede a request
      console.warn('Erro ao ler token do localStorage', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response: redireciona em 401 limpando storage
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove chave de usuário e opcional authToken
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('authToken');
      } catch (e) {}
      // redireciona para login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
