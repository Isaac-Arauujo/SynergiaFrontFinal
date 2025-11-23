// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { usuarioService } from '../services/usuarioService';
import api from '../services/api';

const AuthContext = createContext();
export const useAuth = () => {
  const c = useContext(AuthContext);
  if (!c) throw new Error('useAuth must be used inside AuthProvider');
  return c;
};

const STORAGE_KEY = 'synergia_usuario';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [carregando, setCarregando] = useState(false);
  const [error, setError] = useState(null);

  // se houver token no usuario, seta no axios (se backend usar token)
  useEffect(() => {
    if (usuario && usuario.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${usuario.token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [usuario]);

  // login: chama service, normaliza e salva no contexto + localStorage
  const login = async (email, senha) => {
    setCarregando(true);
    setError(null);
    try {
      const data = await usuarioService.login(email, senha);
      // backend pode retornar { usuario: {...}, token: '...' } ou apenas usuario.
      const userObj = data?.usuario ? data.usuario : data;
      if (!userObj) throw new Error('Resposta inválida do servidor');
      setUsuario(userObj);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
      return userObj;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setCarregando(false);
    }
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem(STORAGE_KEY);
    delete api.defaults.headers.common['Authorization'];
  };

  const cadastrar = async (payload) => {
    setCarregando(true);
    try {
      const res = await usuarioService.cadastrar(payload);
      return res;
    } finally {
      setCarregando(false);
    }
  };

  const atualizarUsuario = (novosDados) => {
    setUsuario((prev) => {
      const merged = { ...(prev || {}), ...(novosDados || {}) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      carregando,
      error,
      login,
      logout,
      cadastrar,
      atualizarUsuario,
      isAuthenticated: !!usuario
    }}>
      {children}
    </AuthContext.Provider>
  );
}
