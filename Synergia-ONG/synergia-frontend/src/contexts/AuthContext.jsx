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

  // garante que axios tenha header Authorization se o token existir no objeto salvo
  useEffect(() => {
    if (usuario && (usuario.token || usuario.authToken || usuario.accessToken)) {
      const token = usuario.token || usuario.authToken || usuario.accessToken;
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [usuario]);

  const login = async (email, senha) => {
    setCarregando(true);
    setError(null);
    try {
      const data = await usuarioService.login(email, senha);
      // backend pode retornar apenas um UsuarioDTO (sem token) ou um objeto com token
      // normalize the possible shapes:
      let userObj = data;
      // if backend wraps in { usuario: ..., token: '...' }
      if (data && data.usuario) {
        userObj = data.usuario;
        if (data.token) userObj.token = data.token;
      }
      // persist
      setUsuario(userObj);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
      // also persist authToken separately if exists for compatibility
      if (userObj.token) localStorage.setItem('authToken', userObj.token);
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
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('authToken');
    } catch {}
    delete api.defaults.headers.common['Authorization'];
  };

  const cadastrar = async (payload) => {
    setCarregando(true);
    try {
      const res = await usuarioService.cadastrar(payload);
      // backend retorna o UsuarioDTO criado — normaliza para { success: true, data }
      return { success: true, data: res };
    } catch (err) {
      // tenta extrair mensagem legível do erro do backend
      const raw = err?.response?.data;
      let msg = err?.message || "Erro ao cadastrar";

      if (raw) {
        // Se receber string simples
        if (typeof raw === "string") {
          msg = raw;
        } else if (raw?.message) {
          msg = raw.message;
        } else {
          // Tenta extrair validações do Spring (object com fields)
          try {
            // spring padrão retorna { timestamp, status, error, trace, message, errors, path }
            // Se existir 'errors' e for array, pegue defaultMessage de cada item
            if (Array.isArray(raw.errors)) {
              msg = raw.errors.map(r => r.defaultMessage || JSON.stringify(r)).join("; ");
            } else if (raw.errors && typeof raw.errors === "object") {
              // raw.errors pode ser map de listas
              const vals = Object.values(raw.errors).flat();
              msg = vals.map(v => v.defaultMessage || JSON.stringify(v)).join("; ");
            } else if (raw?.message) {
              msg = raw.message;
            } else {
              // fallback genérico
              msg = JSON.stringify(raw);
            }
          } catch (e) {
            msg = JSON.stringify(raw);
          }
        }
      }

      return { success: false, error: String(msg) };
    } finally {
      setCarregando(false);
    }
  };

  // atualizarUsuario atualiza o objeto salvo (merge)
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
