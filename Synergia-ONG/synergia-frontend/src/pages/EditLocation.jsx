// src/pages/EditLocation.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LocationForm from "../components/LocationForm.jsx";
import { localService } from "../services/localService";

export default function EditLocation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await localService.buscarPorId(id);
        // Ex.: result pode ter: nome, descricao, endereco, imagemUrl, cep, rua, numero, ...
        setInitialValues(result);
      } catch (err) {
        console.error("Erro ao carregar local:", err);
        alert("Erro ao carregar informações do local");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  /**
   * onSubmit do LocationForm chama handleSubmit(dados, options)
   * - dados: objeto JSON ou FormData
   * - options: { isFormData: true } quando FormData
   */
  const handleSubmit = async (dados, options = {}) => {
    try {
      await localService.atualizar(id, dados, options);
      alert("Local atualizado com sucesso!");
      navigate(`/locais/detalhe/${id}`);
    } catch (err) {
      console.error("Erro ao atualizar local:", err);
      if (err?.response?.data) {
        const resp = err.response.data;
        const msg = resp.message || JSON.stringify(resp);
        alert(`Erro ao atualizar: ${msg}`);
      } else {
        alert("Erro ao atualizar local (veja console).");
      }
      // rethrow para que o LocationForm também possa capturar (já faz log)
      throw err;
    }
  };

  if (loading) return <div className="p-6 text-center">Carregando dados...</div>;
  if (!initialValues) return <div className="p-6 text-center">Local não encontrado.</div>;

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Editar Local</h1>

      <LocationForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel="Atualizar"
      />
    </main>
  );
}
