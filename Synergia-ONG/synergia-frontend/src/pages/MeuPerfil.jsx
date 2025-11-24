// src/pages/MeuPerfil.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { usuarioService } from "../services/usuarioService";
import "../style/meuperfil.css";

/*
  Versão reforçada e autossuficiente:
  - lê id do contexto, e como fallback lê do localStorage no momento do save
  - expõe funções de debug em window: __MeuPerfil_handleSave, __MeuPerfil_lastPayload, __MeuPerfil_lastResponse
  - faz fallback para fetch caso usuarioService falhe
  - logs detalhados para debug no console
*/

export default function MeuPerfil() {
  const { usuario, atualizarUsuario } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState({
    nomeCompleto: "",
    dataNascimento: "",
    cpf: "",
    email: "",
    fotoPerfil: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // utils
  const resolveUserId = (u) => u?.id || u?.userId || u?.usuarioId || u?._id || null;

  useEffect(() => {
    console.log("[MeuPerfil] mount - usuario from context:", usuario);
    const id = resolveUserId(usuario);
    if (!id) {
      setLoading(false);
      setError("Usuário não autenticado ou id ausente.");
      return;
    }

    (async () => {
      setLoading(true);
      setError("");
      try {
        console.log(`[MeuPerfil] GET profile for id=${id}`);
        const data = await usuarioService.obterPerfil(id);
        console.log("[MeuPerfil] obterPerfil response:", data);
        if (data?.usuario) {
          setPerfil(data);
          fillFormFrom(data.usuario);
        } else if (data?.nomeCompleto) {
          setPerfil({ usuario: data, inscricoes: [] });
          fillFormFrom(data);
        } else {
          setError("Resposta inesperada ao obter perfil");
          console.warn("[MeuPerfil] obterPerfil resposta inesperada:", data);
        }
      } catch (err) {
        console.error("[MeuPerfil] erro obterPerfil:", err);
        const msg = extractServerMessage(err) || "Erro ao carregar perfil";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  function fillFormFrom(u) {
    setForm({
      nomeCompleto: u.nomeCompleto || u.nome || "",
      dataNascimento: formatDateForInput(u.dataNascimento),
      cpf: u.cpf || "",
      email: u.email || "",
      fotoPerfil: u.fotoPerfil || ""
    });
  }

  function formatDateForInput(value) {
    if (!value) return "";
    if (typeof value === "string") return value.length >= 10 ? value.substring(0, 10) : value;
    if (value instanceof Date) {
      const yyyy = value.getFullYear();
      const mm = String(value.getMonth() + 1).padStart(2, "0");
      const dd = String(value.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
    return String(value);
  }

  function extractServerMessage(err) {
    const raw = err?.response?.data;
    if (!raw) return err?.message;
    if (typeof raw === "string") return raw;
    if (raw?.message) return raw.message;
    try {
      if (Array.isArray(raw.errors)) {
        return raw.errors.map(r => r.defaultMessage || JSON.stringify(r)).join("; ");
      } else if (raw.errors && typeof raw.errors === "object") {
        const vals = Object.values(raw.errors).flat();
        return vals.map(v => v.defaultMessage || JSON.stringify(v)).join("; ");
      } else return JSON.stringify(raw);
    } catch (e) {
      return JSON.stringify(raw);
    }
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(s => ({ ...s, [name]: value }));
  };

  // doSave: tenta usuarioService, se falhar faz fetch PUT direto
  const doSave = async (id, payload) => {
    window.__MeuPerfil_lastPayload = payload;
    console.log("[MeuPerfil] doSave -> id, payload:", id, payload);

    try {
      const res = await usuarioService.atualizarPerfil(id, payload);
      console.log("[MeuPerfil] usuarioService.atualizarPerfil respondeu:", res);
      window.__MeuPerfil_lastResponse = res;
      return { ok: true, res };
    } catch (err) {
      console.warn("[MeuPerfil] usuarioService.atualizarPerfil erro (vai tentar fetch):", err);
      try {
        const url = `http://localhost:8080/api/usuarios/${encodeURIComponent(id)}`;
        console.log("[MeuPerfil] fallback fetch PUT ->", url, "payload:", payload);
        const r = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const text = await r.text();
        let parsed = null;
        try { parsed = JSON.parse(text); } catch(e) { parsed = text; }
        console.log("[MeuPerfil] fallback fetch response status:", r.status, "body:", parsed);
        window.__MeuPerfil_lastResponse = { status: r.status, body: parsed };
        if (r.ok) return { ok: true, res: parsed };
        return { ok: false, err: parsed, status: r.status };
      } catch (fetchErr) {
        console.error("[MeuPerfil] fallback fetch error:", fetchErr);
        window.__MeuPerfil_lastResponse = { error: String(fetchErr) };
        return { ok: false, err: fetchErr };
      }
    }
  };

  // handleSave: lê id do contexto ou localStorage (fallback) e chama doSave
  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    console.log("[MeuPerfil] handleSave called (form submit or button click)", { form, usuario });
    setSaving(true);
    setError("");

    // tenta id do contexto; se não houver, pega do localStorage
    let id = resolveUserId(usuario);
    if (!id) {
      try {
        const raw = localStorage.getItem('synergia_usuario');
        if (raw) {
          const parsed = JSON.parse(raw);
          id = parsed?.id || parsed?.userId || parsed?._id || null;
          console.log("[MeuPerfil] id lido do localStorage como fallback:", id);
        }
      } catch (e) {
        console.warn("[MeuPerfil] erro lendo localStorage para obter id:", e);
      }
    } else {
      console.log("[MeuPerfil] id vindo do contexto:", id);
    }

    if (!id) {
      setError("Usuário não autenticado (id ausente).");
      console.warn("[MeuPerfil] handleSave aborted - no id:", usuario);
      setSaving(false);
      return;
    }

    const payload = {
      nomeCompleto: form.nomeCompleto || undefined,
      dataNascimento: form.dataNascimento || undefined,
      email: form.email || undefined,
      fotoPerfil: form.fotoPerfil || undefined
    };
    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

    window.__MeuPerfil_lastPayload = payload;
    try {
      const result = await doSave(id, payload);
      if (result.ok) {
        console.log("[MeuPerfil] save success:", result.res);
        if (result.res?.usuario) {
          setPerfil(result.res);
          atualizarUsuario(result.res.usuario);
        } else if (result.res?.id || result.res?.nomeCompleto) {
          setPerfil(prev => ({ usuario: result.res, inscricoes: prev?.inscricoes || [] }));
          atualizarUsuario(result.res);
        }
        setError("");
        alert("Perfil atualizado com sucesso");
      } else {
        console.warn("[MeuPerfil] save returned ok:false", result);
        setError(result.err?.message || JSON.stringify(result.err) || `Erro status ${result.status}`);
      }
    } catch (err) {
      console.error("[MeuPerfil] erro in handleSave:", err);
      setError(extractServerMessage(err) || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  // expor debug helpers
  useEffect(() => {
    window.__MeuPerfil_handleSave = handleSave;
    window.__MeuPerfil_lastPayload = window.__MeuPerfil_lastPayload || null;
    window.__MeuPerfil_lastResponse = window.__MeuPerfil_lastResponse || null;
    console.log("[MeuPerfil] debug functions exported on window: __MeuPerfil_handleSave, __MeuPerfil_lastPayload, __MeuPerfil_lastResponse");
    return () => {
      try { delete window.__MeuPerfil_handleSave; } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, perfil, usuario]);

  if (loading) return <div>Carregando perfil...</div>;
  if (!perfil) return <div>{error ? error : "Nenhum perfil encontrado."}</div>;

  return (
    <main className="meuperfil-page">
      <h1>Meu Perfil</h1>
      <section className="perfil-grid">
        <form onSubmit={handleSave} className="perfil-form" noValidate>
          <label>
            Nome completo
            <input name="nomeCompleto" value={form.nomeCompleto} onChange={onChange} required />
          </label>

          <label>
            Data de nascimento
            <input name="dataNascimento" type="date" value={form.dataNascimento} onChange={onChange} />
          </label>

          <label>
            CPF
            <input name="cpf" value={form.cpf} onChange={onChange} disabled />
            <small className="muted">CPF não pode ser alterado por aqui</small>
          </label>

          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={onChange} required />
          </label>

          <label>
            Foto (URL)
            <input name="fotoPerfil" value={form.fotoPerfil} onChange={onChange} />
          </label>

          {error && <div className="error" role="alert">{String(error)}</div>}

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button id="btn-meuperfil-save" type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </button>

            <button id="btn-meuperfil-save-manual" type="button" onClick={handleSave} disabled={saving} style={{ background: "#ddd", padding: "6px 10px" }}>
              Salvar (manual)
            </button>
          </div>
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
          ) : (
            <p>Sem inscrições</p>
          )}
        </aside>
      </section>
    </main>
  );
}
