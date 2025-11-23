import React, { useEffect } from "react";
import "./guaruja.css";

export default function Guaruja() {

  // Remove o fundo verde herdado da LandingPage
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
            <h2>Local: Guarujá</h2>
          </div>
        </div>

        {/* IMAGEM */}
        <div className="image-section">
          <div className="bg-shape"></div>

          <div className="image-container">
            <img
              src="https://cj.estrategia.com/portal/wp-content/uploads/2025/01/11193245/173601144167796eb18406f_1736011441_3x2_md.jpg"
              alt="Poluição nas praias do Guarujá"
            />
          </div>
        </div>

        {/* DESCRIÇÃO */}
        <section className="description-section">
          <div className="container">
            <p>
              A poluição nas praias do Guarujá é resultado direto do despejo de
              esgoto doméstico e de resíduos urbanos sem tratamento adequado.
              Em várias regiões da cidade, canais e tubulações levam água suja
              até a faixa de areia, formando manchas escuras e contaminando o mar.
            </p>

            <p>
              Quando o esgoto é lançado no mar, ele carrega grandes quantidades
              de bactérias e matéria orgânica, tornando a água imprópria para o
              banho e perigosa para a saúde pública. Muitas análises apontam
              índices altíssimos de coliformes fecais, indicando a presença de
              dejetos humanos.
            </p>

            <p>
              O impacto ambiental também é grave: a poluição altera o equilíbrio
              do ecossistema marinho, afeta peixes, aves e outros animais que
              dependem da água limpa para sobreviver. Além disso, o mau cheiro e
              o acúmulo de resíduos sólidos nas margens de canais agravam a
              degradação do ambiente costeiro.
            </p>
          </div>
        </section>

        {/* COMO AJUDAR */}
        <section className="action-section">
          <div className="container">
            <h3>Como podemos ajudar?</h3>

            <p>
              A ONG Syngia pode desempenhar um papel essencial na limpeza e
              recuperação das áreas poluídas do Guarujá, especialmente nos
              pontos onde o esgoto e o lixo urbano chegam até a areia e o mar.
            </p>

            <p>
              O primeiro passo é organizar mutirões de limpeza comunitária,
              reunindo voluntários, moradores e parceiros locais. A Syngia pode
              estabelecer ações regulares nas praias e margens de canais, onde
              o acúmulo de resíduos é mais frequente.
            </p>

            <p>
              Ao mesmo tempo, campanhas de educação ambiental ajudam a
              conscientizar a população sobre o descarte correto do lixo e a
              importância do saneamento básico, reduzindo os riscos ambientais
              e promovendo a preservação das praias locais.
            </p>
          </div>
        </section>

        {/* MENSAGEM FINAL */}
        <div className="footer-message">
          <div className="container">
            <p>
              Cuidar do Guarujá é cuidar da vida; cada gesto de limpeza se
              transforma em um passo para um futuro mais azul e mais verde.
            </p>
          </div>
        </div>

      </main>
    </>
  );
}
