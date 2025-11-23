import React from "react";
import "../style/landingpage.css";
import heroBg from "../img/unnamed.jpg";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* HEADER */}
      <header className="hero-section">

        {/* BOTÃO/FOTO DO USUÁRIO */}
        <div className="user-profile">
          {user ? (
            <button
              className="profile-button"
              onClick={() => navigate("/usuario")}
            >
              <img
                src={
                  user.fotoPerfil ||
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

      {/* O RESTO DO SEU CÓDIGO DA LANDING PAGE... */}


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

        {/* LOCATION CARDS */}
        <section className="available-locations container">
          <h2>Locais Disponíveis</h2>
          <div className="locations-grid">
            <div className="location-card">
              <div className="card-image">
                <img src="src/img/Captura de tela 2025-11-11 204408.png" alt="Voluntário em Cipó-Guaçu" />
              </div>
              <p>Cipó-Guaçu</p>
              <a href="/cipo" className="btn-link">
  <button className="btn-details">Ver Detalhes</button>
</a>
            </div>

            <div className="location-card">
              <div className="card-image">
                <img src="https://cj.estrategia.com/portal/wp-content/uploads/2025/01/11193245/173601144167796eb18406f_1736011441_3x2_md.jpg" alt="Voluntário no Guarujá" />
              </div>
              <p>Guarujá</p>
              <a href="/guaruja" className="btn-link">
  <button className="btn-details">Ver Detalhes</button>
</a>
            </div>

            <div className="location-card">
              <div className="card-image">
                <img src="https://imagens.ebc.com.br/jZNaSA3QeJIK98QbfuhU7bcBEfY=/1170x700/smart/https://agenciabrasil.ebc.com.br/sites/default/files/thumbnails/image/rvrsa_abr_080720120506_0.jpg?itok=qUdSTuvR" alt="Voluntário no Rio Tietê" />
              </div>
              <p>Rio Tietê</p>
            <a href="/tiete" className="btn-link">
  <button className="btn-details">Ver Detalhes</button>
</a>
            </div>
          </div>
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
}
, {
  text: "Participar da Synergia me mostrou na prática como a ação local tem poder. A cada mutirão, a gente percebe o impacto real na vida das pessoas e na preservação do meio ambiente. É inspirador demais.",
  role: "Voluntária",
  name: "Ana Beatriz",
  img: "src/img/Captura de tela 2025-11-11 204724.png"
}
,{
  text: "No meu bairro, o projeto da Synergia mudou tudo. Ver crianças, famílias e voluntários unidos por um ambiente melhor me emociona. Eu nunca imaginei que pudesse contribuir tanto para minha comunidade.",
  role: "Voluntária",
  name: "Pietra Lima",
  img: "src/img/Captura de tela 2025-11-11 204657.png"
}
].map((fb, i) => (
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