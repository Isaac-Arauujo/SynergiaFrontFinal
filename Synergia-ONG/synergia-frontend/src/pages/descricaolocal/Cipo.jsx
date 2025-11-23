import React, { useEffect } from "react";
import "./cipo.css";

export default function CipoGuacu() {

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
            <h2>Local: Cipó-Guaçu</h2>
          </div>
        </div>

        {/* IMAGEM */}
        <div className="image-section">
          <div className="bg-shape"></div>

          <div className="image-container">
            <img
              src="https://s2-g1.glbimg.com/HvepQASG4sw0nB2YpSgzCC6kU38=/0x0:993x584/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2022/H/7/3aWY0bRHWuLVlhNQvnsQ/mortandade-peixes.jpg"
              alt="Mortandade de peixes no Rio Cipó"
            />
          </div>
        </div>

        {/* DESCRIÇÃO */}
        <section className="description-section">
          <div className="container">
            <p>
              Cipó-Guaçu é um distrito fundamental na Área de Proteção aos Mananciais,
              contribuindo diretamente para a bacia do Rio Embu-Guaçu — um dos principais
              afluentes da <strong>Represa de Guarapiranga</strong>.
            </p>

            <p>
              Apesar de sua importância ambiental, a região sofre com o avanço da
              <strong> ocupação urbana desordenada</strong>, que compromete os recursos hídricos.
            </p>

            <p>
              O maior problema é a falta de <strong>saneamento básico adequado</strong>.
              Sem rede de coleta e tratamento, o esgoto doméstico é lançado diretamente
              em córregos como o Rio Cipó, aumentando os <strong>coliformes</strong>,
              tornando a água imprópria e ameaçando a qualidade da água que abastece
              milhões de pessoas em São Paulo.
            </p>

            <p>
              Outro fator grave é o <strong>descarte irregular de lixo</strong> nas margens,
              além do <strong>desmatamento</strong> em Áreas de Preservação Permanente,
              afetando todo o ecossistema local.
            </p>
          </div>
        </section>

        {/* COMO AJUDAR */}
        <section className="action-section">
          <div className="container">
            <h3>Como podemos ajudar em Cipó-Guaçu?</h3>

            <p>
              A ONG Syngia pode atuar em duas frentes principais:
              <strong> limpeza de margens</strong> e
              <strong> educação ambiental</strong>.
            </p>

            <p>
              Mutirões nas margens do Rio Cipó ajudam a remover resíduos sólidos,
              reduzindo a poluição difusa e preservando os mananciais.
            </p>

            <p>
              Além disso, ações educativas com moradores e escolas são essenciais
              para combater o descarte irregular e conscientizar sobre a importância
              do saneamento básico.
            </p>
          </div>
        </section>

        {/* MENSAGEM FINAL */}
        <div className="footer-message">
          <div className="container">
            <p>
              Proteger Cipó-Guaçu é garantir água limpa para hoje e para o futuro.
            </p>
          </div>
        </div>

      </main>
    </>
  );
}
