import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enterDemoMode } from '../lib/demoStore';
import './HomePage.css';

const Arrow: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="square"
    className="arr"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

const BrandMark: React.FC = () => (
  <div className="brand-mark" aria-hidden="true">
    <svg width="10" height="10" viewBox="0 0 10 10">
      <rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor" />
      <rect x="3" y="3" width="4" height="4" fill="currentColor" />
    </svg>
  </div>
);

type Feature = {
  num: string;
  title: React.ReactNode;
  body: string;
  link: string;
};

const FEATURES: Feature[] = [
  {
    num: '01',
    title: <>Vagas que pedem <span className="s">sua</span> engenharia.</>,
    body: 'Posições efetivas filtradas por especialidade e conselho. Sem recrutadores soletrando seu título.',
    link: 'Ver vagas',
  },
  {
    num: '02',
    title: <>Consultoria <span className="s">sob demanda</span>.</>,
    body: 'Ofereça sua hora técnica com escopo, prazo e contrato. A gente cuida da parte chata.',
    link: 'Abrir oferta',
  },
  {
    num: '03',
    title: <>Projetos pontuais, <span className="s">reais</span>.</>,
    body: 'Laudos, memoriais, dimensionamentos, fiscalizações. Trabalho por entrega, com histórico público.',
    link: 'Ver projetos',
  },
  {
    num: '04',
    title: <>Rede de <span className="s">parceiros</span>.</>,
    body: 'Encontre sócios, fornecedores e clientes diretos. Uma camada profissional sem feed de vaidade.',
    link: 'Entrar na rede',
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const els = document.querySelectorAll('.home-shell .reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const goRegister = () => navigate('/register');
  const goLogin = () => navigate('/login');

  return (
    <div className="home-shell">
      <div className="glow" aria-hidden="true" />

      <header className="nav">
        <div className="wrap nav-inner">
          <div className="brand">
            <BrandMark />
            <span>engehub<span className="brand-dot">.</span></span>
          </div>
          <nav className="nav-links">
            <a className="nav-link hide-sm" href="#como">Como funciona</a>
            <a className="nav-link hide-sm" href="#cadastrar">Para empresas</a>
            <button type="button" className="nav-link" onClick={goLogin}>
              Entrar
            </button>
            <button type="button" className="nav-cta" onClick={goRegister}>
              Criar perfil
              <Arrow size={12} />
            </button>
          </nav>
        </div>
      </header>

      <main>
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
                <button type="button" className="btn btn-primary" onClick={goRegister}>
                  Criar meu perfil
                  <Arrow size={14} />
                </button>
                <button type="button" className="btn" onClick={goRegister}>
                  Contratar engenheiros
                </button>
              </div>

              <div className="hero-foot mono">
                Sem cadastro?{' '}
                <button
                  type="button"
                  onClick={enterDemoMode}
                  style={{
                    background: 'transparent',
                    border: 0,
                    padding: 0,
                    margin: 0,
                    color: 'var(--accent)',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    letterSpacing: 'inherit',
                    cursor: 'pointer',
                    borderBottom: '1px solid currentColor',
                  }}
                >
                  Ver demonstração →
                </button>
              </div>
            </div>
          </div>
        </section>

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
                  <a className="feature-link" href="#cadastrar">
                    {f.link}
                    <Arrow size={12} />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cta" id="cadastrar">
          <div className="wrap">
            <div className="reveal">
              <div className="section-kicker mono" style={{ marginBottom: 24 }}>Comece agora</div>
              <h2>
                Dois minutos pra criar seu <span className="s">perfil</span>.
              </h2>
              <p>
                Importe seu histórico técnico, conecte seu CREA, publique a primeira oferta. Você só paga quando fecha negócio.
              </p>
              <div className="cta-actions">
                <button type="button" className="btn btn-primary" onClick={goRegister}>
                  Sou engenheiro
                  <Arrow size={14} />
                </button>
                <button type="button" className="btn" onClick={goRegister}>
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
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <div className="brand">
            <BrandMark />
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
    </div>
  );
};

export default HomePage;
