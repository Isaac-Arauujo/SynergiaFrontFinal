import "../style/contato.css";
import React, { useState, useEffect } from "react";

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    mensagem: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    document.body.style.background = "#fff"; // garante fundo branco
    return () => document.body.style.background = "";
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setSuccess("Mensagem enviada com sucesso!");
      setFormData({ nome: "", email: "", mensagem: "" });
      setLoading(false);
    }, 1500);
  };

  return (
    <div>

      {/* NAVBAR */}
      <header className="navbar-contato">
        <div className="navbar">
          <div className="logo"></div>
          <nav>
            <a href="/">Início</a>
            <a href="#about">Sobre Nós</a>
            <a href="#how-it-works">Como funciona</a>
            <a href="/contato">Contato</a>
            <a href="#projects">Projetos</a>
          </nav>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main>
        <div className="contact-wrapper">

          {/* COLUNA ESQUERDA */}
          <div className="contact-info">
            <h1>ENTRE EM CONTATO</h1>

            <p>📧 synergia.adm@outlook.com</p>
            <p>📞 +55 11 99999-9999</p>
            <p>📍 São Paulo - SP</p>

            <div className="info-item instagram-icon">
              <i className="fab fa-instagram" />
            </div>
          </div>

          {/* COLUNA DIREITA */}
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <label>Estou interessado em:</label>
              <select className="input">
                <option>Voluntariado</option>
                <option>Parcerias</option>
                <option>Doações</option>
                <option>Outro</option>
              </select>

              <label>Seu Nome</label>
              <input
                type="text"
                name="nome"
                placeholder="Seu nome"
                value={formData.nome}
                onChange={handleChange}
                className="input"
              />

              <label>Seu Email</label>
              <input
                type="email"
                name="email"
                placeholder="email@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className="input"
              />

              <label>Sua Mensagem</label>
              <textarea
                name="mensagem"
                rows="5"
                value={formData.mensagem}
                onChange={handleChange}
                className="input"
              />

              <button className="btn-enviar" type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Mensagem"}
              </button>

              {success && (
                <p className="success">{success}</p>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
