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

function detectIsAdmin(u) {
  if (!u) return false;
  // 1) campos booleanos diretos
  if (u.isAdmin === true) return true;
  if (u.admin === true) return true;
  if (u.superAdmin === true) return true;
  // 2) role singular (string)
  const role = u.role || u.tipo || u.perfil || u.roleName;
  if (typeof role === 'string' && /admin/i.test(role)) return true;
  // 3) roles array
  const roles = u.roles || u.perfis || u.grupos || u.authorities;
  if (Array.isArray(roles) && roles.some(r => {
    if (!r) return false;
    if (typeof r === 'string') return /admin/i.test(r);
    if (typeof r === 'object') {
      const n = r.name || r.nome || r.role || r.authority;
      return typeof n === 'string' && /admin/i.test(n);
    }
    return false;
  })) return true;
  // 4) nested wrappers
  if (u.usuario) return detectIsAdmin(u.usuario);
  if (u.data && typeof u.data === 'object') return detectIsAdmin(u.data);
  return false;
}

function resolveUserObj(data) {
  // normaliza várias formas de resposta do backend
  if (!data) return null;

  // Caso: { usuario: {...}, token: '...' }
  if (data.usuario) {
    const u = { ...data.usuario };
    if (data.token) u.token = data.token;
    // marca isAdmin
    u.isAdmin = detectIsAdmin(u);
    return u;
  }

  // se veio wrapper { data: UsuarioDTO } ou UsuarioDTO direto
  if (data.data && data.data.usuario) {
    const u = { ...data.data.usuario };
    u.isAdmin = detectIsAdmin(u);
    return u;
  }
  if (data.data && data.data.id) {
    const u = { ...data.data };
    u.isAdmin = detectIsAdmin(u);
    return u;
  }
  if (data.id || data.nomeCompleto) {
    const u = { ...data };
    u.isAdmin = detectIsAdmin(u);
    return u;
  }

  // Se chegou aqui e é um objeto com propriedades de usuário em nível superior
  if (typeof data === 'object') {
    const u = { ...data };
    u.isAdmin = detectIsAdmin(u);
    return u;
  }

  return null;
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      const normalized = resolveUserObj(parsed) || parsed;
      return normalized;
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
      // normaliza e marca isAdmin antes de persistir
      const normalized = resolveUserObj(u) || u || null;
      setUsuario(normalized);
      if (normalized) localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
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
