// src/pages/MeuPerfilStandalone.jsx
import React, { useState } from 'react';
import usuarioService from '../services/usuarioService';
import '../style/meuperfil.css';

export default function MeuPerfilStandalone() {
  const [inputId, setInputId] = useState('');
  const [perfilRaw, setPerfilRaw] = useState(null);
  const [form, setForm] = useState({
    nomeCompleto: '',
    dataNascimento: '',
    cpf: '',
    email: '',
    fotoPerfil: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const formatDateForInput = (v) => {
    if (!v) return '';
    if (typeof v === 'string') return v.length >= 10 ? v.substring(0,10) : v;
    if (v instanceof Date) {
      const y = v.getFullYear();
      const m = String(v.getMonth()+1).padStart(2,'0');
      const d = String(v.getDate()).padStart(2,'0');
      return `${y}-${m}-${d}`;
    }
    return String(v);
  };

  const parseAndFill = (data) => {
    if (!data) return;
    const usuarioObj = data.usuario ? data.usuario : data;
    setPerfilRaw(data);
    setForm({
      nomeCompleto: usuarioObj.nomeCompleto || usuarioObj.nome || '',
      dataNascimento: formatDateForInput(usuarioObj.dataNascimento),
      cpf: usuarioObj.cpf || '',
      email: usuarioObj.email || '',
      fotoPerfil: usuarioObj.fotoPerfil || ''
    });
  };

  const handleFetchById = async () => {
    console.log('[DEBUG] handleFetchById start, inputId=', inputId);
    setMsg(''); setLoading(true);
    const id = inputId.trim();
    if (!id) { setMsg('Digite um ID válido'); setLoading(false); return; }
    try {
      console.log('[DEBUG] calling usuarioService.obterPerfil(', id, ')');
      const data = await usuarioService.obterPerfil(id);
      console.log('[DEBUG] obterPerfil response:', data);
      parseAndFill(data);
      setMsg('Perfil carregado com sucesso');
    } catch (err) {
      console.error('[DEBUG] erro obterPerfil', err);
      const body = err?.response?.data;
      setMsg(body ? (typeof body === 'string' ? body : JSON.stringify(body)) : (err.message || 'Erro ao obter perfil'));
    } finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(s => ({ ...s, [name]: value }));
  };

  // Função que atualiza localStorage.synergia_usuario com o usuario retornado
  const persistReturnedUser = (resData) => {
    try {
      if (!resData) return false;
      // resData pode ser { usuario, inscricoes } ou UsuarioDTO
      const usuarioObj = resData.usuario ? resData.usuario : resData;
      if (!usuarioObj || (!usuarioObj.id && !usuarioObj.nomeCompleto)) return false;
      // mantém token antigo, se houver
      let existingRaw = null;
      try { existingRaw = JSON.parse(localStorage.getItem('synergia_usuario') || 'null'); } catch(e){ existingRaw = null; }
      if (existingRaw && (existingRaw.token || existingRaw.authToken)) {
        usuarioObj.token = usuarioObj.token || existingRaw.token || existingRaw.authToken || existingRaw.accessToken || usuarioObj.token;
      }
      localStorage.setItem('synergia_usuario', JSON.stringify(usuarioObj));
      console.log('[DEBUG] localStorage.synergia_usuario atualizado com:', usuarioObj);
      return true;
    } catch (e) {
      console.warn('[DEBUG] falha ao persistir usuario retornado', e);
      return false;
    }
  };

  // Tenta salvar via usuarioService (que faz fallback interno). Atualiza localStorage se sucesso.
  const handleSaveViaService = async () => {
    console.log('[DEBUG] handleSaveViaService start', { inputId, form });
    setMsg(''); setSaving(true);
    const id = inputId.trim();
    if (!id) { setMsg('ID ausente. Forneça o ID do usuário antes de salvar.'); setSaving(false); return; }
    const payload = {
      nomeCompleto: form.nomeCompleto || undefined,
      dataNascimento: form.dataNascimento || undefined,
      email: form.email || undefined,
      fotoPerfil: form.fotoPerfil || undefined
    };
    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);
    try {
      console.log('[DEBUG] usuarioService.atualizarPerfil -> id, payload', id, payload);
      const res = await usuarioService.atualizarPerfil(id, payload);
      console.log('[DEBUG] usuarioService.atualizarPerfil response:', res);
      setPerfilRaw(res);
      // persistir no localStorage o usuário retornado (se houver)
      const persisted = persistReturnedUser(res);
      if (persisted) {
        console.log('[DEBUG] persistência no localStorage realizada após salvar via service.');
      } else {
        console.log('[DEBUG] nenhum objeto usuário encontrado na resposta para persistir.');
      }
      setMsg('Atualizado com sucesso via usuarioService. Veja Network e Response.');
    } catch (err) {
      console.error('[DEBUG] usuarioService.atualizarPerfil erro:', err);
      const body = err?.response?.data;
      setMsg(body ? (typeof body === 'string' ? body : JSON.stringify(body)) : (err.message || 'Erro ao atualizar via service'));
    } finally { setSaving(false); }
  };

  // Faz PUT direto com fetch para o endpoint /api/usuarios/{id} (fora do axios)
  const handleManualFetchPUT = async () => {
    console.log('[DEBUG] handleManualFetchPUT start', { inputId, form });
    setMsg(''); setSaving(true);
    const id = inputId.trim();
    if (!id) { setMsg('ID ausente. Forneça o ID antes de testar PUT manual.'); setSaving(false); return; }
    const payload = {
      nomeCompleto: form.nomeCompleto || undefined,
      dataNascimento: form.dataNascimento || undefined,
      email: form.email || undefined,
      fotoPerfil: form.fotoPerfil || undefined
    };
    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);
    const url = `http://localhost:8080/api/usuarios/${encodeURIComponent(id)}`;
    try {
      console.log('[DEBUG] manual fetch PUT to', url, 'payload', payload);
      const resp = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const text = await resp.text();
      console.log('[DEBUG] fetch PUT status:', resp.status, 'responseText:', text);
      // tenta parse JSON se for JSON
      let parsed = null;
      try { parsed = JSON.parse(text); } catch(e) { parsed = null; }
      if (parsed) {
        setPerfilRaw(parsed);
        const persisted = persistReturnedUser(parsed);
        if (persisted) {
          console.log('[DEBUG] persistência no localStorage realizada após fetch PUT.');
        }
      } else {
        setPerfilRaw({ text });
      }
      setMsg(`Fetch PUT status ${resp.status}: veja console/Network.`);
    } catch (err) {
      console.error('[DEBUG] fetch PUT erro:', err);
      setMsg(err.message || 'Erro no fetch PUT');
    } finally { setSaving(false); }
  };

  const handleShowLocalStorage = () => {
    try {
      const raw = localStorage.getItem('synergia_usuario');
      console.log('[DEBUG] localStorage.synergia_usuario =', raw);
      alert('Veja Console: localStorage.synergia_usuario (copie e cole aqui se precisar)');
    } catch (e) {
      console.error(e);
      alert('Erro lendo localStorage (veja console)');
    }
  };

  return (
    <main style={{padding:20}}>
      <h2>Meu Perfil — Standalone (debug)</h2>

      <section style={{marginBottom:12}}>
        <label>ID do usuário: <input value={inputId} onChange={e=>setInputId(e.target.value)} placeholder="ex: 1" /></label>
        <button onClick={handleFetchById} disabled={loading} style={{marginLeft:8}}>{loading ? 'Carregando...' : 'Buscar por ID'}</button>
        <button onClick={handleShowLocalStorage} style={{marginLeft:8}}>Mostrar localStorage</button>
      </section>

      <section style={{border:'1px solid #ddd', padding:12, marginBottom:12}}>
        <h4>Formulário</h4>
        <label style={{display:'block', marginBottom:6}}>
          Nome completo
          <input name="nomeCompleto" value={form.nomeCompleto} onChange={handleChange} style={{display:'block', width: '100%'}} />
        </label>

        <label style={{display:'block', marginBottom:6}}>
          Data de nascimento
          <input name="dataNascimento" type="date" value={form.dataNascimento} onChange={handleChange} />
        </label>

        <label style={{display:'block', marginBottom:6}}>
          CPF (somente leitura)
          <input name="cpf" value={form.cpf} disabled />
        </label>

        <label style={{display:'block', marginBottom:6}}>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </label>

        <label style={{display:'block', marginBottom:6}}>
          Foto (URL)
          <input name="fotoPerfil" value={form.fotoPerfil} onChange={handleChange} />
        </label>

        <div style={{marginTop:10, display:'flex', gap:8}}>
          <button onClick={handleSaveViaService} disabled={saving}>{saving ? 'Salvando (service)...' : 'Salvar (via service)'}</button>
          <button onClick={handleManualFetchPUT} disabled={saving}>{saving ? 'Salvando (fetch)...' : 'Salvar (fetch manual)'}</button>
        </div>
      </section>

      <section>
        <strong>Mensagem:</strong>
        <pre style={{whiteSpace:'pre-wrap', background:'#f8f8f8', padding:8}}>{msg || '—'}</pre>
      </section>

      <section style={{marginTop:12}}>
        <h4>Resposta bruta (última)</h4>
        <pre style={{whiteSpace:'pre-wrap', background:'#fff', padding:8, border:'1px solid #eee', maxHeight:300, overflow:'auto'}}>
          {perfilRaw ? JSON.stringify(perfilRaw, null, 2) : 'Nenhuma resposta ainda'}
        </pre>
      </section>
    </main>
  );
}
