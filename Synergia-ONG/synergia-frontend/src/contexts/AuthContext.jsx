// caminho: src/contexts/AuthContext.jsx
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

function resolveUserObj(data) {
  // normaliza várias formas de resposta do backend
  if (!data) return null;
  if (data.usuario) {
    const u = data.usuario;
    if (data.token) u.token = data.token;
    return u;
  }
  // se veio wrapper { data: UsuarioDTO } ou UsuarioDTO direto
  if (data.data && data.data.usuario) return data.data.usuario;
  if (data.data && data.data.id) return data.data;
  if (data.id || data.nomeCompleto) return data;
  return null;
}

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

  // garante header Authorization global se existir token
  useEffect(() => {
    if (usuario && (usuario.token || usuario.authToken || usuario.accessToken)) {
      const token = usuario.token || usuario.authToken || usuario.accessToken;
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [usuario]);

  const persistUsuario = (u) => {
    try {
      setUsuario(u);
      if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Erro ao persistir usuario', e);
    }
  };

  // ---- sincroniza mudanças no localStorage vindas de outras abas/janelas
  useEffect(() => {
    const onStorage = (ev) => {
      if (ev.key === STORAGE_KEY) {
        try {
          const newVal = ev.newValue;
          const parsed = newVal ? JSON.parse(newVal) : null;
          // normalize if necessary
          const normalized = resolveUserObj(parsed) || parsed;
          setUsuario(normalized);
          console.log('[AuthContext] storage event - usuario reloaded from storage', normalized);
        } catch (e) {
          console.warn('[AuthContext] storage event parse error', e);
          setUsuario(null);
        }
      }
    };
    window.addEventListener('storage', onStorage);

    // função exposta para forçar reload a partir do mesmo tab (útil após alterações por console)
    window.__auth_reloadFromStorage = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : null;
        const normalized = resolveUserObj(parsed) || parsed;
        setUsuario(normalized);
        console.log('[AuthContext] __auth_reloadFromStorage executed, usuario:', normalized);
      } catch (e) {
        console.warn('[AuthContext] __auth_reloadFromStorage error', e);
        setUsuario(null);
      }
    };

    return () => {
      window.removeEventListener('storage', onStorage);
      try { delete window.__auth_reloadFromStorage; } catch {}
    };
  }, []);

  const login = async (email, senha) => {
    setCarregando(true);
    setError(null);
    try {
      const data = await usuarioService.login(email, senha);
      const userObj = resolveUserObj(data) || {};
      // Se backend não enviou id por qualquer motivo, tenta extrair de data.usuario etc já feito
      persistUsuario(userObj);
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
    persistUsuario(null);
    try { localStorage.removeItem('authToken'); } catch {}
    delete api.defaults.headers.common['Authorization'];
  };

  const cadastrar = async (payload) => {
    setCarregando(true);
    try {
      const res = await usuarioService.cadastrar(payload);
      // normaliza retorno e não loga automaticamente (deixe fluxo de registro decidir)
      const userObj = resolveUserObj(res) || res;
      return { success: true, data: userObj };
    } catch (err) {
      const raw = err?.response?.data;
      let msg = err?.message || 'Erro ao cadastrar';
      if (raw) {
        if (typeof raw === 'string') msg = raw;
        else if (raw.message) msg = raw.message;
        else msg = JSON.stringify(raw);
      }
      return { success: false, error: String(msg) };
    } finally {
      setCarregando(false);
    }
  };

  // permite setar id manualmente (debug/integração)
  const setUsuarioIdManual = (id) => {
    try {
      const cur = usuario ? { ...usuario } : {};
      cur.id = id;
      persistUsuario(cur);
      return cur;
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  // util para forçar objeto (debug)
  const setUsuarioObject = (obj) => {
    persistUsuario(obj);
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      carregando,
      error,
      login,
      logout,
      cadastrar,
      atualizarUsuario: setUsuarioObject,
      setUsuarioIdManual,
      isAuthenticated: !!usuario
    }}>
      {children}
    </AuthContext.Provider>
  );
}
