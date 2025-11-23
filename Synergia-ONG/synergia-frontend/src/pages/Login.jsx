import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader } from "lucide-react";
import "../style/login.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    senha: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(formData.email, formData.senha);

      if (result.success) {
        navigate("/");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background-container">
      {/* LOGO */}
      <header className="logo">
        <span className="logo-text">Synergia</span>
      </header>

      {/* CARD */}
      <div className="login-card-container">
        <div className="login-card">
          <h1 className="card-title">LOGIN</h1>

          {error && (
            <div
              style={{
                background: "#ffe5e5",
                border: "1px solid #ffb3b3",
                color: "#b30000",
                padding: "10px 15px",
                width: "100%",
                borderRadius: "10px",
                marginBottom: "10px",
                fontSize: "0.9em"
              }}
            >
              {error}
            </div>
          )}

          {/* FORM */}
          <form className="login-form" onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="input-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* SENHA */}
            <div className="input-group" style={{ position: "relative" }}>
              <label htmlFor="senha">Senha</label>
              <input
                type={showPassword ? "text" : "password"}
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required
                style={{ paddingRight: "45px" }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#777"
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* ESQUECEU A SENHA */}
            <Link to="/esqueci-senha" className="forgot-password">
              Esqueceu a senha?
            </Link>

            {/* BUTTON */}
            <button
              type="submit"
              className="btn btn-login"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" style={{ marginRight: 5 }} />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          {/* TEXTO CADASTRO */}
          <p className="register-text">
            Sem{" "}
            <Link to="/cadastro" className="register-link-highlight">
              Cadastro
            </Link>
            ? Venha mudar o mundo conosco.
          </p>

          <Link to="/cadastro" className="btn btn-register">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}