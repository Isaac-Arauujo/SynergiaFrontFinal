// src/components/LocationForm.jsx
import React, { useState } from "react";


/**
 * LocationForm com suporte ao campo dataInicio (obrigatório se o backend validar).
 *
 * - Garante que dataInicio esteja no futuro antes de enviar (validação client-side).
 * - Suporta envio JSON ou FormData (quando há arquivo de imagem).
 * - Converte data do input (datetime-local) para ISO string ao enviar.
 *
 * Props:
 * - initialValues: objeto com os campos iniciais (nome, descricao, endereco, imagemUrl, cep, rua, numero, dataInicio, ...)
 * - onSubmit: função async(payload, options) -> responsável por chamar localService.criar/atualizar
 *      payload: objeto JSON ou FormData
 *      options: { isFormData: boolean }
 * - submitLabel: texto do botão
 */
export default function LocationForm({
  initialValues = {},
  onSubmit,
  submitLabel = "Salvar",
}) {
  // Helper: converter ISO -> value para input datetime-local (YYYY-MM-DDTHH:MM)
  const isoToDateTimeLocal = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    // get local components
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  // Helper: converter datetime-local value -> ISO string (UTC)
  const dateTimeLocalToISO = (value) => {
    if (!value) return null;
    // value is like "2025-11-23T19:55"
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString();
  };

  const [form, setForm] = useState({
    nome: initialValues.nome || "",
    descricao: initialValues.descricao || "",
    endereco: initialValues.endereco || "",
    imagemUrl: initialValues.imagemUrl || initialValues.imagem || "",
    cep: initialValues.cep || "",
    rua: initialValues.rua || "",
    numero: initialValues.numero || "",
    // armazenamos o valor no formato do input (datetime-local)
    dataInicioInput: initialValues.dataInicio ? isoToDateTimeLocal(initialValues.dataInicio) : "",
  });

  const [imagemFile, setImagemFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setImagemFile(file || null);
    if (file) setForm((prev) => ({ ...prev, imagemUrl: "" }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerErrors(null);

    // converter campo de input para ISO
    const dataInicioISO = dateTimeLocalToISO(form.dataInicioInput);

    // validação client-side: dataInicio deve ser no futuro (se preenchido)
    if (!dataInicioISO) {
      alert("Preencha a Data de Início (campo obrigatório).");
      return;
    }
    const now = new Date();
    const dt = new Date(dataInicioISO);
    if (dt.getTime() <= now.getTime()) {
      alert("Data de início deve ser no futuro. Escolha uma data/hora posterior à atual.");
      return;
    }

    const payload = {
      nome: (form.nome || "").trim(),
      descricao: form.descricao || "",
      endereco: form.endereco || "",
      cep: form.cep || "",
      rua: form.rua || "",
      numero: form.numero || "",
      // envia dataInicio como ISO (string)
      dataInicio: dataInicioISO,
      ...(imagemFile ? {} : { imagemUrl: form.imagemUrl || "" }),
    };

    console.log("[LocationForm] Payload antes do envio:", payload, "imagemFile:", imagemFile);

    try {
      setLoading(true);

      if (!onSubmit) throw new Error("onSubmit não foi fornecido ao LocationForm.");

      if (imagemFile) {
        const fd = new FormData();
        // anexar campos textuais
        Object.keys(payload).forEach((k) => {
          fd.append(k, payload[k] !== undefined && payload[k] !== null ? payload[k] : "");
        });
        // nome do campo do arquivo: 'imagem' (ajuste se seu backend espera outro nome)
        fd.append("imagem", imagemFile);

        await onSubmit(fd, { isFormData: true });
      } else {
        await onSubmit(payload, { isFormData: false });
      }
    } catch (err) {
      console.error("[LocationForm] Erro ao enviar formulário:", err);

      if (err?.response) {
        const status = err.response.status;
        const data = err.response.data;
        let message = `Erro ${status}`;
        if (data?.message) message = data.message;
        else if (data?.errors) message = JSON.stringify(data.errors);
        else if (typeof data === "string") message = data;

        alert(`Erro do servidor: ${message}`);
        setServerErrors({ status, data });
      } else if (err?.request) {
        alert("Nenhuma resposta do servidor. Verifique backend/conexão.");
        setServerErrors({ request: true });
      } else {
        alert(`Erro: ${err.message || "Erro desconhecido"}`);
        setServerErrors({ message: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={submit} className="bg-white shadow p-6 rounded max-w-2xl mx-auto">

        {/* NOME */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Nome</label>
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* DESCRIÇÃO */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Descrição</label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows="4"
          />
        </div>

        {/* ENDEREÇO (campo geral) */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Endereço</label>
          <input
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* CEP (obrigatório) */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">CEP</label>
          <input
            name="cep"
            value={form.cep}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
            placeholder="ex: 12345-678"
          />
        </div>

        {/* RUA (obrigatório) */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Rua</label>
          <input
            name="rua"
            value={form.rua}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* NUMERO (obrigatório) */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Número</label>
          <input
            name="numero"
            value={form.numero}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
            placeholder="ex: 123 ou S/N"
          />
        </div>

        {/* DATA DE INÍCIO (obrigatório e deve ser no futuro) */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Data de Início</label>
          <input
            name="dataInicioInput"
            type="datetime-local"
            value={form.dataInicioInput}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <p className="text-sm text-gray-600 mt-1">Escolha data e hora de início (deve ser no futuro).</p>
        </div>

        {/* IMAGEM: URL ou arquivo */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">URL da Imagem (ou escolha um arquivo abaixo)</label>
          <input
            name="imagemUrl"
            value={form.imagemUrl}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="https://..."
            disabled={!!imagemFile}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Arquivo de imagem (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          {imagemFile && <p className="text-sm mt-1">Arquivo selecionado: {imagemFile.name}</p>}
        </div>

        {/* Exibição de erros retornados pelo backend (se existirem) */}
        {serverErrors && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            <strong>Erro do servidor:</strong>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{JSON.stringify(serverErrors, null, 2)}</pre>
          </div>
        )}

        {/* BOTÃO */}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          {loading ? "Salvando..." : submitLabel}
        </button>
      </form>

      <div className="max-w-2xl mx-auto mt-3 text-sm text-gray-600">
        <p>Observação: preencha CEP, Rua, Número e Data de Início (campos obrigatórios). Se o backend exigir mais campos, cole aqui a resposta do servidor e eu ajusto.</p>
      </div>
    </div>
  );
}
