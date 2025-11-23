import React, { useEffect } from "react";
import "./tiete.css";

export default function Tiete() {

  useEffect(() => {
    document.body.style.background = "#fff";  
    return () => {
      document.body.style.background = "";
    };
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <header className="navbar-contato">
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
      </header>

      <main className="content-wrapper">

        {/* TÍTULO */}
        <div className="local-title-section">
          <div className="container">
            <h2>Local: Rio Tietê</h2>
          </div>
        </div>

        {/* IMAGEM */}
        <div className="image-section">
          <div className="bg-shape"></div>

          <div className="image-container">
            <img
              src="https://s2.static.brasilescola.uol.com.br/be/2020/07/poluicao-rio-tiete.jpg"
              alt="Poluição no Rio Tietê"
            />
          </div>
        </div>

        {/* DESCRIÇÃO */}
        <section className="description-section">
          <div className="container">
            <p>
              O Rio Tietê é o principal curso d'água do estado de São Paulo, mas,
              ao passar pela <strong>Região Metropolitana</strong>, transforma-se em um dos rios mais poluídos do país.
              Esse problema histórico é resultado, principalmente, da expansão urbana e industrial
              desordenada que utilizou o rio como um grande canal de escoamento de dejetos.
            </p>

            <p>
              A maior fonte de poluição é o <strong>esgoto doméstico</strong> sem tratamento, lançado diretamente no leito,
              o que causa a famosa “mancha de poluição”, que se estende por mais de 200 km.
              Esse despejo eleva drasticamente os níveis de <strong>coliformes fecais</strong>, diminui o
              <strong> oxigênio dissolvido</strong> — criando trechos mortos onde a vida aquática não existe —
              além de gerar o forte mau cheiro característico.
            </p>

            <p>
              Além do esgoto residencial, o Tietê recebe grandes volumes de <strong>resíduos industriais</strong>,
              introduzindo contaminantes químicos e metais pesados ao rio.
              Outro fator crítico é a <strong>poluição difusa</strong>, composta por lixo, óleos e detritos
              trazidos das ruas e avenidas, principalmente da Marginal Tietê,
              agravando enchentes e a degradação ambiental da região.
            </p>
          </div>
        </section>

        {/* COMO AJUDAR */}
        <section className="action-section">
          <div className="container">
            <h3>Como podemos ajudar na recuperação do Rio Tietê?</h3>

            <p>
              A recuperação do Tietê exige ações estruturais e de mobilização social.
              A ONG Syngia pode focar na <strong>limpeza de afluentes e margens</strong>, além da
              <strong> fiscalização comunitária</strong> para combater o despejo irregular de resíduos —
              medidas essenciais para reduzir a poluição difusa que alimenta a mancha principal.
            </p>

            <p>
              Uma prioridade é organizar mutirões de limpeza nos córregos e canais laterais que
              deságuam no Tietê, pois são a porta de entrada do lixo no rio. Além disso,
              campanhas de educação ambiental são fundamentais para conscientizar moradores
              e empresas sobre o impacto das ligações clandestinas de esgoto e do descarte incorreto de resíduos,
              promovendo uma mudança de comportamento e preservação do rio.
            </p>
          </div>
        </section>

        {/* MENSAGEM FINAL */}
        <div className="footer-message">
          <div className="container">
            <p>
Proteger o Rio Tietê é garantir um futuro melhor para todas as pessoas, para o meio ambiente e para as próximas gerações.            </p>
          </div>
        </div>

      </main>
    </>
  );
}
