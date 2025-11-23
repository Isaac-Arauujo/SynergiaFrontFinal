import React, { useState } from "react";
import "../style/cadastro.css";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { usuarioService } from "../services/usuarioService";

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    dataNascimento: "",
    cpf: "",
    email: "",
    senha: "",
    confirmacaoSenha: ""
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { cadastrar } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "cpf") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        .slice(0, 14);
    }

    setFormData({ ...formData, [name]: formattedValue });
    setErrors({ ...errors, [name]: "" });
    setSuccess("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nomeCompleto.trim()) newErrors.nomeCompleto = "Nome é obrigatório";

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = "Data de nascimento é obrigatória";
    } else {
      const birthDate = new Date(formData.dataNascimento);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      if (age < 16) newErrors.dataNascimento = "Você deve ter pelo menos 16 anos";
    }

    if (!formData.cpf.replace(/\D/g, "")) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (formData.cpf.replace(/\D/g, "").length !== 11) {
      newErrors.cpf = "CPF inválido";
    }

    if (!formData.email) newErrors.email = "Email é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido";

    if (!formData.senha) newErrors.senha = "Senha é obrigatória";
    else if (formData.senha.length < 6) newErrors.senha = "Mínimo 6 caracteres";

    if (!formData.confirmacaoSenha)
      newErrors.confirmacaoSenha = "Confirmação é obrigatória";
    else if (formData.confirmacaoSenha !== formData.senha)
      newErrors.confirmacaoSenha = "Senhas não coincidem";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const emailDisponivel = await usuarioService.verificarEmail(formData.email);
      if (!emailDisponivel) {
        setErrors({ email: "Email já cadastrado" });
        setLoading(false);
        return;
      }

      const cpfDisponivel = await usuarioService.verificarCpf(formData.cpf.replace(/\D/g, ""));
      if (!cpfDisponivel) {
        setErrors({ cpf: "CPF já cadastrado" });
        setLoading(false);
        return;
      }

      const usuarioData = {
        nomeCompleto: formData.nomeCompleto,
        dataNascimento: formData.dataNascimento,
        cpf: formData.cpf.replace(/\D/g, ""),
        email: formData.email,
        senha: formData.senha
      };

      const result = await cadastrar(usuarioData);

      if (result.success) {
        setSuccess("Cadastro realizado com sucesso! Redirecionando...");
        setTimeout(() => navigate("/login"), 1800);
      } else {
        setErrors({ submit: result.error });
      }
    } catch (err) {
      setErrors({ submit: "Erro ao conectar ao servidor" });
    }

    setLoading(false);
  };

  return (
    <div className="background-container">
      <header className="logo">
        <span className="logo-text">Synergia</span>
      </header>

      <div className="cadastro-card-container">
        <div className="cadastro-card">

          <h1 className="card-title">CADASTRE - SE</h1>

          {/* Mensagens */}
          {errors.submit && (
            <p className="error-box">{errors.submit}</p>
          )}
          {success && (
            <p className="success-box">{success}</p>
          )}

          <form className="cadastro-form" onSubmit={handleSubmit}>

            {/* Nome */}
            <div className="input-group">
              <label>Nome *</label>
              <input type="text" name="nomeCompleto" placeholder="Nome Completo"
                value={formData.nomeCompleto} onChange={handleChange} />
              {errors.nomeCompleto && <span className="error">{errors.nomeCompleto}</span>}
            </div>

            {/* Data */}
            <div className="input-group">
              <label>Data *</label>
              <input type="date" name="dataNascimento"
                value={formData.dataNascimento} onChange={handleChange} />
              {errors.dataNascimento && <span className="error">{errors.dataNascimento}</span>}
            </div>

            {/* CPF */}
            <div className="input-group">
              <label>CPF *</label>
              <input type="text" name="cpf" placeholder="000.000.000-00"
                maxLength={14} value={formData.cpf} onChange={handleChange} />
              {errors.cpf && <span className="error">{errors.cpf}</span>}
            </div>

            {/* Email */}
            <div className="input-group">
              <label>E-mail *</label>
              <input type="email" name="email"
                value={formData.email} onChange={handleChange} />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            {/* Senha */}
            <div className="input-group">
              <label>Senha *</label>
              <input type="password" name="senha"
                value={formData.senha} onChange={handleChange} />
              {errors.senha && <span className="error">{errors.senha}</span>}
            </div>

            {/* Confirmar senha */}
            <div className="input-group">
              <label>Confirme *</label>
              <input type="password" name="confirmacaoSenha"
                value={formData.confirmacaoSenha} onChange={handleChange} />
              {errors.confirmacaoSenha && <span className="error">{errors.confirmacaoSenha}</span>}
            </div>

            <button type="submit" className="btn btn-register-final" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastre-se"}
            </button>

            <p className="cadastro-text">
              Já possui conta? {" "}
              <Link to="/login" className="register-link-highlight">Login</Link>.
            </p>
          </form>

        </div>
      </div>

      {/* Footer removed on cadastro page as requested */}
    </div>
  );
}