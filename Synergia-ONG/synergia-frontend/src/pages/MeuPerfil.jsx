// src/pages/MeuPerfil.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { usuarioService } from "../services/usuarioService";
import "../style/meuperfil.css";

export default function MeuPerfil() {
  const { usuario, atualizarUsuario } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState({ nomeCompleto: '', dataNascimento: '', cpf: '', email: '', fotoPerfil: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      if (!usuario?.id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await usuarioService.obterPerfil(usuario.id);
        setPerfil(data);
        if (data?.usuario) {
          const u = data.usuario;
          setForm({
            nomeCompleto: u.nomeCompleto || u.nome || '',
            dataNascimento: u.dataNascimento ? u.dataNascimento.substring(0,10) : '',
            cpf: u.cpf || '',
            email: u.email || '',
            fotoPerfil: u.fotoPerfil || ''
          });
        }
      } catch (err) {
        console.error('Erro ao carregar perfil', err);
        setError('Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [usuario]);

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!usuario?.id) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        nomeCompleto: form.nomeCompleto,
        dataNascimento: form.dataNascimento,
        cpf: form.cpf,
        email: form.email,
        fotoPerfil: form.fotoPerfil
      };
      const res = await usuarioService.atualizarPerfil(usuario.id, payload);
      if (res?.usuario) {
        setPerfil(res);
        atualizarUsuario(res.usuario);
        alert('Perfil atualizado com sucesso');
      } else {
        setError('Resposta inesperada do servidor');
      }
    } catch (err) {
      console.error('Erro atualizar perfil', err);
      setError('Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Carregando perfil...</div>;

  if (!perfil) return <div>Nenhum perfil encontrado.</div>;

  return (
    <main className="meuperfil-page">
      <h1>Meu Perfil</h1>
      <section className="perfil-grid">
        <form onSubmit={handleSave} className="perfil-form">
          <label>Nome completo
            <input name="nomeCompleto" value={form.nomeCompleto} onChange={onChange} required />
          </label>

          <label>Data de nascimento
            <input name="dataNascimento" type="date" value={form.dataNascimento} onChange={onChange} />
          </label>

          <label>CPF
            <input name="cpf" value={form.cpf} onChange={onChange} />
          </label>

          <label>Email
            <input name="email" type="email" value={form.email} onChange={onChange} required />
          </label>

          <label>Foto (URL)
            <input name="fotoPerfil" value={form.fotoPerfil} onChange={onChange} />
          </label>

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
        </form>

        <aside className="perfil-inscricoes">
          <h3>Minhas inscrições</h3>
          {perfil.inscricoes && perfil.inscricoes.length > 0 ? (
            perfil.inscricoes.map((ins) => (
              <div key={ins.id || ins.inscricaoId} className="ins-item">
                <strong>{ins.localNome || ins.local?.nome || ins.localName}</strong>
                <div>Data: {ins.dataDesejada || ins.data}</div>
                <div>Status: {ins.status}</div>
              </div>
            ))
          ) : <p>Sem inscrições</p>}
        </aside>
      </section>
    </main>
  );
}
