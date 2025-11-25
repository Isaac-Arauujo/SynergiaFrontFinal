// src/pages/LandingPage.jsx
import React, { useEffect, useState } from "react";
import "../style/landingpage.css";
import heroBg from "../img/unnamed.jpg";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { localService } from "../services/localService";
import LocationCard from "../components/LocationCard";
import { Loader, MapPin } from "lucide-react";

export default function LandingPage() {
  // seu AuthContext usa "usuario" — mas alguns lugares podem usar "user"
  const auth = useAuth();
  const usuario = auth?.usuario || auth?.user || null;

  const navigate = useNavigate();

  // estado para locais
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const dados = await localService.listarTodos();
        // normaliza respostas possíveis (array ou wrapper)
        const lista = Array.isArray(dados) ? dados : (dados?.content || dados?.lista || dados?.items || []);
        if (mounted) setLocais(lista || []);
      } catch (err) {
        console.error("Erro ao carregar locais (LandingPage):", err);
        if (mounted) setError("Erro ao carregar locais");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleVerDetalhe = (id) => {
    if (!id) return;
    navigate(`/locais/detalhe/${id}`);
  };

  const filtered = locais.filter(l => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (l.nome || "").toLowerCase().includes(s)
      || (l.descricao || "").toLowerCase().includes(s)
      || (l.rua || l.cidade || "").toLowerCase().includes(s);
  });

  return (
    <div className="landing-page">

      {/* HEADER */}
      <header className="hero-section">
        {/* BOTÃO/FOTO DO USUÁRIO */}
        <div className="user-profile">
          {usuario ? (
            <button
              className="profile-button"
              onClick={() => navigate("/login")}
            >
              <img
                src={
                  usuario.fotoPerfil ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Foto do usuário"
              />
            </button>
          ) : (
            <a href="/login" className="btn-login-header">Login</a>
          )}
        </div>

        <div className="navbar">
          <div className="logo"></div>
          <nav>
            <a href="#about">Sobre Nós</a>
            <a href="/">Início</a>
            <a href="#how-it-works">Como funciona</a>
            <a href="/contato">Contato</a>
            <a href="#projects">Projetos</a>
          </nav>
        </div>

        <div className="hero-content">
          <h1>Como podemos mudar o mundo?</h1>
          <p>Tudo começa com um simples passo.</p>
          <div className="hero-buttons">
            <a href="/cadastro" className="btn-volunteer">Seja Voluntário</a>
            <a href="/login" className="btn-login">Login</a>
          </div>
        </div>
      </header>

      {/* ABOUT SECTION */}
      <section className="about-section container" id="about">
        <div className="about-text-content">
          <h2>A SYNERGIA: Juntos pelo Planeta, pelas Pessoas e pelos Animais</h2>
          <p>A SYNERGIA é uma ONG comprometida em transformar o mundo por meio da união de pessoas com um propósito comum: cuidar do nosso planeta e apoiar comunidades e proteger os animais e/ou ecossistemas impactados pela poluição.</p>
        </div>

        <div className="mission-highlight">
          <div className="mission-text">
            <p>Acreditamos que pequenas ações, quando somadas, geram grandes transformações.</p>
          </div>
          <div className="mission-image">
            <img src="src/img/1728002025.98.webp" alt="Crianças sorrindo" />
          </div>
        </div>

        <div className="mission-statement">
          <div className="mission-image-large">
            <img src="src/img/Captura de tela 2025-11-11 203644.png" alt="Voluntários limpando" />
          </div>
          <div className="mission-text-content">
            <h3>Nossa Missão</h3>
            <p>Na SYNERGIA, unimos pessoas com um propósito: cuidar do planeta, apoiar comunidades e proteger animais.</p>
            <p>Trabalhamos na recuperação de áreas poluídas, revitalização de rios, apoio a comunidades e projetos pedagógicos ou de preservação ambiental para inspirar mudanças.</p>
          </div>
        </div>
      </section>

      {/* LOCATION CARDS DINÂMICOS */}
      <section className="available-locations container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2>Locais Disponíveis</h2>
          <div style={{ width: 280 }}>
            <input
              type="text"
              placeholder="Buscar locais..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <Loader className="animate-spin" size={36} />
            <div className="text-gray-600 mt-2">Carregando locais...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <MapPin size={48} className="mx-auto mb-3" />
            Nenhum local encontrado.
          </div>
        ) : (
          <div className="locations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {filtered.map(local => (
              <div key={local.id || local.localId || local._id} className="location-card-wrapper">
                <LocationCard
                  location={local}
                  onVerDetalhe={() => handleVerDetalhe(local.id || local.localId || local._id)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* HOW TO VOLUNTEER */}
      <section className="how-to-volunteer container" id="how-it-works">
        <h2>Como ser um Voluntário</h2>

        {[1, 2, 3, 4].map((step) => (
          <div key={step} className={`step-card ${step === 4 ? "step-card-last" : ""}`}>
            <div className="step-number">{step}</div>
            <div className="step-content">
              {step === 1 && (
                <>
                  <h3>Escolha um local próximo a você</h3>
                  <p>Encontre uma comunidade, bairro ou área que precise de apoio...</p>
                </>
              )}
              {step === 2 && (
                <>
                  <h3>Escolha uma ação ou projeto</h3>
                  <p>Decida como quer contribuir: limpeza, revitalização, apoio a animais ou educação...</p>
                </>
              )}
              {step === 3 && (
                <>
                  <h3>Inscreva-se e participe</h3>
                  <p>Cadastre-se no site ou contate a equipe local...</p>
                </>
              )}
              {step === 4 && (
                <>
                  <h3>Faça a diferença e inspire outros</h3>
                  <p>Colabore e compartilhe sua experiência para engajar mais pessoas.</p>
                </>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* FEEDBACKS */}
      <section className="feedbacks-section container">
        <h2>FEEDBACKS SYNERGIES</h2>
        <div className="feedbacks-grid">
          {[{
            text: "A Synergia me acolheu de um jeito único. Participar das ações pela causa animal transformou meu olhar sobre o mundo. Hoje me sinto parte de algo maior, onde cada pequena atitude faz diferença.",
            role: "Voluntária",
            name: "Emanuel Boyle",
            img: "src/img/Captura de tela 2025-11-11 204657.png"
          }, {
            text: "Participar da Synergia me mostrou na prática como a ação local tem poder. A cada mutirão, a gente percebe o impacto real na vida das pessoas e na preservação do meio ambiente. É inspirador demais.",
            role: "Voluntária",
            name: "Ana Beatriz",
            img: "src/img/Captura de tela 2025-11-11 204724.png"
          }, {
            text: "No meu bairro, o projeto da Synergia mudou tudo. Ver crianças, famílias e voluntários unidos por um ambiente melhor me emociona. Eu nunca imaginei que pudesse contribuir tanto para minha comunidade.",
            role: "Voluntária",
            name: "Pietra Lima",
            img: "src/img/Captura de tela 2025-11-11 204657.png"
          }].map((fb, i) => (
            <div className="feedback-card" key={i}>
              <div className="quote-icon">"</div>
              <p>{fb.text}</p>
              <div className="profile">
                <img src={fb.img} alt={fb.name} className="profile-pic" />
                <p className="role">{fb.role}</p>
                <p className="name">{fb.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact">
        <div className="footer-content container">
          <div className="footer-about">
            <h4>SYNERGIA</h4>
            <p>Conectando voluntários a projetos que transformam comunidades...</p>
          </div>
          <div className="footer-links">
            <h4>Links Rápidos</h4>
            <ul>
              <li><a href="#home">Início</a></li>
              <li><a href="#about">Sobre Nós</a></li>
              <li><a href="#projects">Projetos</a></li>
              <li><a href="#how-it-works">Como Funciona</a></li>
              <li><a href="/contato">Contato</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <p>© 2025 SYNERGIA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
