// src/pages/LocationDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { localService } from "../services/localService";

export default function LocationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [local, setLocal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingDelete, setProcessingDelete] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await localService.buscarPorId(id);
        setLocal(result);
      } catch (err) {
        console.error("Erro ao buscar local:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este local?")) return;

    try {
      setProcessingDelete(true);
      await localService.excluir(id);
      alert("Local excluído com sucesso!");
      navigate("/locais");
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert("Erro ao excluir local");
      setProcessingDelete(false);
    }
  };

  const handleEdit = () => {
    navigate(`/locais/editar/${id}`);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Carregando local...</p>
      </div>
    );
  }

  if (!local) {
    return (
      <div className="p-6 text-center">
        <p>Local não encontrado.</p>
      </div>
    );
  }

  const imagemUrl =
    local.imagemUrl ||
    local.imagem ||
    (local.fotos && local.fotos[0]) ||
    null;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow rounded overflow-hidden">

        {/* IMAGEM */}
        {imagemUrl ? (
          <img
            src={imagemUrl}
            alt={local.nome}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center border-b">
            <p>Sem imagem disponível</p>
          </div>
        )}

        <div className="p-6">

          {/* TÍTULO */}
          <h1 className="text-2xl font-bold mb-2">{local.nome}</h1>

          {/* DESCRIÇÃO */}
          <p className="mb-4">{local.descricao || "Sem descrição."}</p>

          {/* ENDEREÇO */}
          {local.endereco && (
            <p className="mb-4">
              <strong>Endereço:</strong> {local.endereco}
            </p>
          )}

          <div className="flex gap-3 mt-6">

            {/* BOTÃO EDITAR */}
            <button
              onClick={handleEdit}
              className="px-4 py-2 rounded bg-yellow-500 text-white hover:opacity-90"
            >
              Editar
            </button>

            {/* BOTÃO EXCLUIR */}
            <button
              onClick={handleDelete}
              disabled={processingDelete}
              className="px-4 py-2 rounded bg-red-600 text-white hover:opacity-90"
            >
              {processingDelete ? "Excluindo..." : "Excluir"}
            </button>

            {/* BOTÃO VOLTAR */}
            <button
              onClick={() => navigate("/locais")}
              className="px-4 py-2 rounded border hover:bg-gray-100"
            >
              Voltar
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}
