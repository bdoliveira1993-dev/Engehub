/* Minimal, editorial-industrial. No dashboard, no fake data. */

const Arrow = ({ size = 14 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" className="arr">
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

const FEATURES = [
  {
    num: "01",
    title: <>Vagas que pedem <span className="s">sua</span> engenharia.</>,
    body: "Posições efetivas filtradas por especialidade e conselho. Sem recrutadores soletrando seu título.",
    link: "Ver vagas",
  },
  {
    num: "02",
    title: <>Consultoria <span className="s">sob demanda</span>.</>,
    body: "Ofereça sua hora técnica com escopo, prazo e contrato. A gente cuida da parte chata.",
    link: "Abrir oferta",
  },
  {
    num: "03",
    title: <>Projetos pontuais, <span className="s">reais</span>.</>,
    body: "Laudos, memoriais, dimensionamentos, fiscalizações. Trabalho por entrega, com histórico público.",
    link: "Ver projetos",
  },
  {
    num: "04",
    title: <>Rede de <span className="s">parceiros</span>.</>,
    body: "Encontre sócios, fornecedores e clientes diretos. Uma camada profissional sem feed de vaidade.",
    link: "Entrar na rede",
  },
];

function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <svg width="10" height="10" viewBox="0 0 10 10">
              <rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="#7aa2ff" />
              <rect x="3" y="3" width="4" height="4" fill="#7aa2ff" />
            </svg>
          </div>
          <span>engehub<span className="brand-dot">.</span></span>
        </div>
        <nav className="nav-links">
          <a className="nav-link" href="#como">Como funciona</a>
          <a className="nav-link" href="#empresas">Para empresas</a>
          <a className="nav-link" href="#entrar">Entrar</a>
          <a className="nav-cta" href="#cadastrar">
            Criar perfil
            <Arrow size={12} />
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="reveal">
          <span className="eyebrow mono">Em pré-lançamento · rede profissional</span>

          <h1>
            O hub da <span className="s">engenharia</span> brasileira.
          </h1>

          <p className="hero-lede">
            Encontre trabalho, projetos e parceiros de negócio num só lugar.
          </p>

          <div className="hero-ctas">
            <button className="btn btn-primary">
              Criar meu perfil
              <Arrow size={14} />
            </button>
            <button className="btn">
              Contratar engenheiros
            </button>
          </div>

          <div className="hero-foot mono">
            Cadastro gratuito
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="section" id="como">
      <div className="wrap">
        <div className="features-head reveal">
          <h2 className="features-title">
            Quatro formas de fazer sua engenharia <span className="s">acontecer</span>.
          </h2>
        </div>

        <div className="features reveal">
          {FEATURES.map((f) => (
            <article key={f.num} className="feature">
              <div className="feature-num mono">{f.num}</div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
              <a className="feature-link" href="#">
                {f.link}
                <Arrow size={12} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="cta" id="cadastrar">
      <div className="wrap">
        <div className="reveal">
          <div className="section-kicker mono" style={{ marginBottom: 24 }}>Comece agora</div>
          <h2>
            Dois minutos pra criar seu <span className="s">perfil</span>.
          </h2>
          <p>
            Importe seu histórico técnico, conecte seu CREA, publique a primeira oferta.
            Você só paga quando fecha negócio.
          </p>
          <div className="cta-actions">
            <button className="btn btn-primary">
              Sou engenheiro
              <Arrow size={14} />
            </button>
            <button className="btn">
              Sou empresa
              <Arrow size={14} />
            </button>
          </div>
          <div className="cta-note">
            Gratuito para começar · taxa apenas sobre contratos fechados
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <svg width="10" height="10" viewBox="0 0 10 10">
              <rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="#7aa2ff" />
              <rect x="3" y="3" width="4" height="4" fill="#7aa2ff" />
            </svg>
          </div>
          <span>engehub<span className="brand-dot">.</span></span>
        </div>
        <div className="footer-links">
          <a href="#">Sobre</a>
          <a href="#">Contato</a>
          <a href="#">Privacidade</a>
          <a href="#">Termos</a>
        </div>
      </div>
    </footer>
  );
}

function App() {
  React.useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div className="glow" aria-hidden="true"></div>
      <Nav />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
