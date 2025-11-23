import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { usuarioService } from "../services/usuarioService";
import "../style/meuperfil.css";

export default function MeuPerfil() {
  const { usuario, atualizarUsuario } = useAuth();
  const [perfil, setPerfil] = useState(null); // espera { usuario: UsuarioDTO, inscricoes: [] }
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

  // Helper: pega id do objeto usuario (tenta várias chaves)
  const resolveUserId = (u) => {
    if (!u) return null;
    return u.id || u.userId || u.usuarioId || u._id || null;
  };

  useEffect(() => {
    const fetchPerfil = async () => {
      const id = resolveUserId(usuario);
      console.log("MeuPerfil: usuario raw from context:", usuario, "resolvedId:", id);

      if (!id) {
        console.warn("MeuPerfil: usuario.id ausente — não fará GET automático.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const data = await usuarioService.obterPerfil(id);
        console.log("MeuPerfil: obterPerfil response:", data);

        if (data && data.usuario) {
          setPerfil(data);
          const u = data.usuario;
          setForm({
            nomeCompleto: u.nomeCompleto || u.nome || "",
            dataNascimento: formatDateForInput(u.dataNascimento),
            cpf: u.cpf || "",
            email: u.email || "",
            fotoPerfil: u.fotoPerfil || ""
          });
        } else if (data && data.nomeCompleto) {
          setPerfil({ usuario: data, inscricoes: [] });
          setForm({
            nomeCompleto: data.nomeCompleto || "",
            dataNascimento: formatDateForInput(data.dataNascimento),
            cpf: data.cpf || "",
            email: data.email || "",
            fotoPerfil: data.fotoPerfil || ""
          });
        } else {
          setPerfil(null);
          setError("Resposta inesperada ao obter perfil.");
        }
      } catch (err) {
        console.error("MeuPerfil: erro obterPerfil", err);
        const msg = extractServerMessage(err) || "Erro ao carregar perfil";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

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
      } else {
        return JSON.stringify(raw);
      }
    } catch (e) {
      return JSON.stringify(raw);
    }
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // função que fará a requisição — separada para chamada manual de debug
  const doSaveRequest = async (forcedId = null) => {
    setError("");
    const id = forcedId || resolveUserId(usuario);
    console.log("MeuPerfil.doSaveRequest -> id usado:", id, "usuario context:", usuario);

    if (!id) {
      throw new Error("Usuário não autenticado: id ausente. Cheque localStorage 'synergia_usuario' e o objeto 'usuario' no AuthContext.");
    }

    const payload = {
      nomeCompleto: form.nomeCompleto || undefined,
      dataNascimento: form.dataNascimento || undefined,
      email: form.email || undefined,
      fotoPerfil: form.fotoPerfil || undefined
    };
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    console.log("MeuPerfil.doSaveRequest -> payload:", payload);

    // faz a chamada via service (service já tenta /meu-perfil e fallback para /usuarios)
    const res = await usuarioService.atualizarPerfil(id, payload);
    console.log("MeuPerfil.doSaveRequest -> resposta:", res);
    return res;
  };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await doSaveRequest();
      if (res && res.usuario) {
        setPerfil(res);
        atualizarUsuario(res.usuario);
        alert("Perfil atualizado com sucesso");
      } else if (res && res.nomeCompleto) {
        setPerfil((prev) => ({ usuario: res, inscricoes: prev?.inscricoes || [] }));
        atualizarUsuario(res);
        alert("Perfil atualizado com sucesso");
      } else {
        setError("Resposta inesperada do servidor ao atualizar perfil.");
        console.warn("MeuPerfil.handleSave resposta inesperada:", res);
      }
    } catch (err) {
      console.error("MeuPerfil.handleSave erro:", err);
      const msg = extractServerMessage(err) || err?.message || "Erro ao atualizar perfil";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  // botão debug para forçar requisição mesmo sem usuario.id — pede que você cole o id manualmente
  const handleDebugForce = async () => {
    const manualId = window.prompt("Forçar PUT — cole o ID do usuário (ex: 1):");
    if (!manualId) return;
    try {
      setSaving(true);
      const res = await doSaveRequest(manualId);
      console.log("MeuPerfil.handleDebugForce resposta:", res);
      alert("Requisição forçada enviada. Veja console e Network.");
      // atualiza estado se possível
      if (res && res.usuario) {
        setPerfil(res);
        atualizarUsuario(res.usuario);
      } else if (res && res.nomeCompleto) {
        setPerfil((prev) => ({ usuario: res, inscricoes: prev?.inscricoes || [] }));
        atualizarUsuario(res);
      }
    } catch (err) {
      console.error("MeuPerfil.handleDebugForce erro:", err);
      alert("Erro ao forçar requisição — veja console");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    window.__debugAtualizarPerfil = async () => {
      try {
        await handleSave();
      } catch (e) {
        console.error(e);
      }
    };
    return () => {
      try { delete window.__debugAtualizarPerfil; } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, usuario]);

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
            <button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </button>

            <button
              type="button"
              onClick={() => handleDebugForce()}
              disabled={saving}
              style={{ background: "#f6a", padding: "6px 10px" }}
            >
              Debug: Forçar PUT manual
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
