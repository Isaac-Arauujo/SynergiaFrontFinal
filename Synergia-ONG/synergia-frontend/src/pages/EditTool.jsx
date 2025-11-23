// src/pages/EditTool.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ferramentaService } from "../services/ferramentaService";
import { Loader } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function EditTool() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    imagemUrl: "",
    quantidade: 0,
    quantidadeDisponivel: 0
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const data = await ferramentaService.buscarPorId(id);
      setForm({
        nome: data.nome || "",
        descricao: data.descricao || "",
        imagemUrl: data.imagemUrl || "",
        quantidade: data.quantidade || 0,
        quantidadeDisponivel: data.quantidadeDisponivel || 0
      });
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar ferramenta");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        nome: form.nome,
        descricao: form.descricao,
        imagemUrl: form.imagemUrl,
        quantidade: Number(form.quantidade),
        quantidadeDisponivel: Number(form.quantidadeDisponivel)
      };

      await ferramentaService.atualizar(id, payload);

      setSuccess("Ferramenta atualizada com sucesso!");
      setTimeout(() => navigate(`/ferramentas/detalhe/${id}`), 800);
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar ferramenta");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <Loader className="animate-spin mx-auto mb-3" />
        Carregando ferramenta...
      </div>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="bg-white shadow rounded p-6">
        <h1 className="text-xl font-bold mb-4">Editar Ferramenta</h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium">Nome *</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Descrição *</label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">URL da Imagem</label>
            <input
              name="imagemUrl"
              value={form.imagemUrl}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Quantidade total *</label>
            <input
              name="quantidade"
              type="number"
              min="0"
              value={form.quantidade}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Quantidade disponível *</label>
            <input
              name="quantidadeDisponivel"
              type="number"
              min="0"
              value={form.quantidadeDisponivel}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="bg-yellow-500 text-white px-6 py-2 rounded hover:opacity-90"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>

            <button
              type="button"
              onClick={() => navigate(`/ferramentas/detalhe/${id}`)}
              className="px-6 py-2 border rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
