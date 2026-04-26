import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { enterDemoMode } from '../lib/demoStore';
import './Auth.css';

interface LoginPageProps {
  onLogin: (name?: string, email?: string) => void;
  onSwitchMode: () => void;
}

const BrandMark: React.FC = () => (
  <span className="brand-mark" aria-hidden="true">
    <svg width="10" height="10" viewBox="0 0 10 10">
      <rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor" />
      <rect x="3" y="3" width="4" height="4" fill="currentColor" />
    </svg>
  </span>
);

const GoogleLogo: React.FC = () => (
  <svg className="google-logo" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const Spinner: React.FC = () => (
  <svg className="spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const AlertIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5" />
    <circle cx="12" cy="16.5" r="0.6" fill="currentColor" />
  </svg>
);

const LoginPage: React.FC<LoginPageProps> = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const redirectUrl = window.location.origin.replace(/\/$/, '');

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline',
          },
        },
      });

      if (authError) throw authError;
    } catch (err: any) {
      console.error('Erro EngeHub Auth:', err);
      setError(err.message || 'Erro de conexão com o Google.');
    } finally {
      setIsLoading(false);
    }
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
          <h1>Entrar.</h1>
          <p>Acesse seu hub e continue de onde parou.</p>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            <AlertIcon />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          className="auth-cta"
          onClick={enterDemoMode}
        >
          Entrar como visitante
        </button>

        <div className="auth-divider" aria-hidden="true">
          <span>ou</span>
        </div>

        <button
          type="button"
          className="auth-google"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : <GoogleLogo />}
          {isLoading ? 'Conectando…' : 'Entrar com Google'}
        </button>

        <p className="auth-switch">
          Não tem conta?{' '}
          <a
            href="/register"
            onClick={(e) => {
              e.preventDefault();
              navigate('/register');
            }}
          >
            Criar perfil
          </a>
        </p>

        <small className="auth-lgpd">
          Conexão segura via Supabase Auth. Dados protegidos conforme a LGPD.
        </small>
      </div>
    </div>
  );
};

export default LoginPage;
