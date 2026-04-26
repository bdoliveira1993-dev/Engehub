import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EngineeringType } from '../types';
import { enterDemoMode } from '../lib/demoStore';
import './Auth.css';

interface RegisterPageProps {
  onRegister: (name: string, email: string, specialty: EngineeringType) => void;
  onSwitchToLogin: () => void;
}

const BrandMark: React.FC = () => (
  <span className="brand-mark" aria-hidden="true">
    <svg width="10" height="10" viewBox="0 0 10 10">
      <rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor" />
      <rect x="3" y="3" width="4" height="4" fill="currentColor" />
    </svg>
  </span>
);

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialty, setSpecialty] = useState<EngineeringType>(EngineeringType.CIVIL);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(name || 'Novo Engenheiro', email || 'novo@engehub.com', specialty);
  };

  return (
    <div className="auth-shell">
      <div className="glow" aria-hidden="true" />

      <div className="auth-frame">
        <a className="auth-brand" href="/" aria-label="Voltar para a página inicial">
          <BrandMark />
          <span>engehub<span className="brand-dot">.</span></span>
        </a>

        <div className="auth-head">
          <h1>Criar <span className="s">perfil</span>.</h1>
          <p>Dois minutos. Sem cartão. Comece a receber propostas alinhadas com a sua engenharia.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label" htmlFor="reg-name">Nome completo</label>
            <input
              id="reg-name"
              type="text"
              className="field-input"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="reg-email">E-mail</label>
            <input
              id="reg-email"
              type="email"
              className="field-input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="reg-specialty">Especialidade</label>
            <select
              id="reg-specialty"
              className="field-select"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value as EngineeringType)}
            >
              {Object.values(EngineeringType).map((type) => (
                <option key={type} value={type}>Engenharia {type}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="reg-password">Senha</label>
            <input
              id="reg-password"
              type="password"
              className="field-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-cta">
            Finalizar cadastro
          </button>
        </form>

        <div className="auth-divider" aria-hidden="true"><span>ou</span></div>

        <button type="button" className="auth-cta ghost" onClick={enterDemoMode}>
          Entrar como visitante
        </button>

        <p className="auth-switch">
          Já é da rede?{' '}
          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
          >
            Entrar
          </a>
        </p>

        <small className="auth-lgpd">
          Ao cadastrar-se você concorda com os termos de privacidade e compliance LGPD.
        </small>
      </div>
    </div>
  );
};

export default RegisterPage;
