import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Loader } from "lucide-react"; // Mantendo o ícone Loader

import "../style/esquecisenha.css"; // Assumindo que este arquivo contém os estilos base da segunda estrutura
import "@fortawesome/fontawesome-free/css/all.min.css"; // Mantido por precaução, mas não essencial se o Loader for da lucide-react

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Simulação de envio de email
    // **Atenção: Substitua esta lógica de setTimeout pela sua chamada real ao backend aqui**
    setTimeout(() => {
      setMessage("Se o email existir em nosso sistema, você receberá instruções para redefinir sua senha.");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="background-container min-h-screen flex flex-col"> {/* Mantido background-container e flex-col */}
      {/* Header */}
      <header className="logo p-6"> {/* Mantido logo e p-6 */}
        <div className="logo-content"> {/* Div para envolver o texto do logo se necessário no seu CSS */}
          <span className="logo-text text-2xl font-bold text-white">Synergia</span> {/* Mantido logo-text e estilos de texto */}
        </div>
      </header>

      {/* Card de Redefinição */}
      <div className="login-card-container flex-1 flex items-center justify-center p-6"> {/* Mantido login-card-container e centralização */}
        <div className="login-card bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"> {/* Mantido login-card e estilos do card */}
          <h1 className="card-title text-2xl font-bold text-center text-gray-800 mb-2">REDEFINIR SENHA</h1> {/* Mantido card-title e estilos de título */}
          <p className="text-center text-gray-600 mb-8">
            Digite seu email para receber instruções de redefinição
          </p>

          {message && (
            <div className="message-container bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm"> {/* Estilo para mensagem de sucesso/aviso */}
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="redefinir-senha-form space-y-6"> {/* Mantido redefinir-senha-form e espaçamento */}
            {/* Email */}
            <div className="input-group"> {/* Mantido input-group */}
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-synergia-green focus:border-transparent transition-colors" // Estilos do input
                placeholder="seu@email.com"
              />
            </div>

            {/* Botão Enviar */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-send w-full bg-synergia-green text-white py-3 rounded-lg font-medium hover:bg-synergia-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" // Mantido btn btn-send e estilos do botão
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                "Enviar Instruções"
              )}
            </button>
          </form>

          {/* Voltar para Login */}
          <div className="mt-8 text-center">
            <Link 
              to="/login" 
              className="text-synergia-green font-semibold hover:text-synergia-dark transition-colors" // Estilos do Link
            >
              ← Voltar para o Login
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-container p-6 text-center text-white text-sm"> {/* Adicionei uma classe para o footer se precisar estilizar */}
        <p>Synergia ONG © 2024 - Todos os direitos reservados</p>
      </footer>
    </div>
  );
}