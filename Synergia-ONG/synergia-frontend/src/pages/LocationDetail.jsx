// src/pages/LocationDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { localService } from "../services/localService";
import { inscricaoService } from "../services/inscricaoService";
import { useAuth } from "../contexts/AuthContext";

export default function LocationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [local, setLocal] = useState(null);
  const [loading, setLoading] = useState(true);

  const [volModalOpen, setVolModalOpen] = useState(false);
  const [dataDesejada, setDataDesejada] = useState("");
  const [inscricaoMsg, setInscricaoMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await localService.buscarPorId(id);
        setLocal(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p style={{ padding: 30 }}>Carregando...</p>;
  if (!local) return <p style={{ padding: 30 }}>Local não encontrado</p>;

  const openVoluntariar = () => {
    if (!usuario) return navigate("/login");
    setVolModalOpen(true);
  };

  const enviarInscricao = async () => {
    if (!dataDesejada) {
      setInscricaoMsg("Selecione uma data!");
      return;
    }
    try {
      setSubmitting(true);
      const userId =
        usuario?.id ||
        usuario?.userId ||
        usuario?.usuarioId ||
        usuario?._id;

      await inscricaoService.criar(
        { localId: Number(id), dataDesejada },
        userId
      );

      setInscricaoMsg("Solicitação enviada! Aguarde confirmação.");
      setTimeout(() => setVolModalOpen(false), 1200);
    } catch (err) {
      setInscricaoMsg("Erro ao enviar inscrição.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este local?")) return;
    try {
      setProcessingDelete(true);
      await localService.excluir(id);
      alert("Local excluído com sucesso!");
      navigate("/locais");
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir local");
      setProcessingDelete(false);
    }
  };

  const handleEdit = () => navigate(`/locais/editar/${id}`);

  return (
    <main style={{ maxWidth: 900, margin: "20px auto", padding: 20 }}>
      <img
        src={local.imagemUrl}
        alt={local.nome}
        style={{
          width: "100%",
          maxHeight: 350,
          objectFit: "cover",
          borderRadius: 8
        }}
      />

      <h1 style={{ marginTop: 20, fontSize: 30 }}>{local.nome}</h1>

      <p style={{ marginTop: 10, fontSize: 18 }}>
        {local.descricao || "Sem descrição."}
      </p>

      <div style={{ marginTop: 15, fontSize: 18 }}>
        <strong>Endereço:</strong><br />
        {local.rua}, {local.numero} — CEP {local.cep}
      </div>

      <div style={{ marginTop: 15, fontSize: 18 }}>
        <strong>Período do Projeto:</strong><br />
        {local.dataInicio} até {local.dataFinal}
      </div>

      {/* Ferramentas */}
      <div style={{ marginTop: 20, fontSize: 18 }}>
        <strong>Ferramentas Disponíveis:</strong><br /><br />
        {local.ferramentas && local.ferramentas.length > 0 ? (
          <ul style={{ marginLeft: 20 }}>
            {local.ferramentas.map((f) => (
              <li key={f.id || f.ferramentaId || JSON.stringify(f)} style={{ marginBottom: 6 }}>
                {f.nome || f.title || f.descricao || JSON.stringify(f)}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma ferramenta cadastrada.</p>
        )}
      </div>

      <div style={{ marginTop: 25, display: "flex", gap: 10 }}>
        {/* Mostrar Edit / Delete apenas para admin */}
        {usuario?.isAdmin && (
          <>
            <button
              onClick={handleEdit}
              style={{
                padding: "10px 16px",
                background: "#f59e0b",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer"
              }}
            >
              Editar
            </button>

            <button
              onClick={handleDelete}
              disabled={processingDelete}
              style={{
                padding: "10px 16px",
                background: "#e11d48",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer"
              }}
            >
              {processingDelete ? "Excluindo..." : "Excluir"}
            </button>
          </>
        )}

        <button
          onClick={openVoluntariar}
          style={{
            padding: "10px 20px",
            background: "#1fa447",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 16,
            cursor: "pointer"
          }}
        >
          Voluntariar-se
        </button>

        <button
          onClick={() => navigate("/locais")}
          style={{
            padding: "10px 20px",
            background: "#ccc",
            border: "none",
            borderRadius: 6,
            fontSize: 16,
            cursor: "pointer"
          }}
        >
          Voltar
        </button>
      </div>

      {/* Modal */}
      {volModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            background: "#fff",
            padding: 20,
            borderRadius: 8,
            width: "90%",
            maxWidth: 400
          }}>
            <h2>Selecionar Data</h2>

            <input
              type="date"
              value={dataDesejada}
              onChange={(e) => setDataDesejada(e.target.value)}
              style={{ width: "100%", marginTop: 10, padding: 10 }}
            />

            {inscricaoMsg && (
              <p style={{ marginTop: 10, color: "green" }}>{inscricaoMsg}</p>
            )}

            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
              <button
                onClick={enviarInscricao}
                disabled={submitting}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  background: "#1fa447",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6
                }}
              >
                {submitting ? "Enviando..." : "Enviar"}
              </button>

              <button
                onClick={() => setVolModalOpen(false)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  background: "#ccc",
                  border: "none",
                  borderRadius: 6
                }}
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
