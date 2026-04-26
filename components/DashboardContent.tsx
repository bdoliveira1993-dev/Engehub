import React, { useEffect, useState } from 'react';
import {
  FileText,
  Users,
  Briefcase,
  Zap,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ViewType } from '../types';
import { supabase } from '../lib/supabase';
import { isDemoSession, getDemoOpportunitiesRecent } from '../lib/demoStore';
import './Dashboard.css';

interface DashboardContentProps {
  user: { name: string; email: string; engineeringType?: string } | null;
  onNavigate?: (view: ViewType, subCategory?: string | null) => void;
}

interface Opportunity {
  id: string | number;
  title: string;
  category: string;
  created_at: string;
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value }) => (
  <div className="stat-card">
    <div className="stat-card-icon" aria-hidden="true">
      <Icon size={18} />
    </div>
    <p className="stat-card-label">{label}</p>
    <p className="stat-card-value">{value}</p>
  </div>
);

const Spinner: React.FC = () => (
  <svg className="dashboard-state-spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const DashboardContent: React.FC<DashboardContentProps> = ({ user, onNavigate }) => {
  const [recentOpportunities, setRecentOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOpportunities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchOpportunities = async () => {
    if (isDemoSession()) {
      setRecentOpportunities(getDemoOpportunitiesRecent(5) as Opportunity[]);
      setIsLoading(false);
      setError(null);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: dbError } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (dbError) throw dbError;
      setRecentOpportunities((data as Opportunity[]) || []);
    } catch (err: any) {
      console.error('Erro ao buscar oportunidades:', err);
      setError('Falha ao sincronizar dados do EngeHub.');
    } finally {
      setIsLoading(false);
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'Engenheiro';

  return (
    <div className="dashboard">
      <div className="dashboard-head">
        <div>
          <h1>Olá, {firstName}.</h1>
          <p>
            Bem-vinda ao painel central{user?.engineeringType ? ` · Eng. ${user.engineeringType}` : ''}.
          </p>
        </div>
        <span className="dashboard-badge">
          <ShieldCheck size={12} aria-hidden="true" />
          Conta verificada · LGPD
        </span>
      </div>

      <div className="dashboard-stats">
        <StatCard icon={FileText} label="Laudos ativos" value="08" />
        <StatCard icon={Briefcase} label="Projetos" value="03" />
        <StatCard icon={Users} label="Networking" value="156" />
        <StatCard icon={Zap} label="Demandas" value="24" />
      </div>

      <section className="dashboard-section">
        <div className="dashboard-section-head">
          <div>
            <h2 className="dashboard-section-title">Oportunidades recentes</h2>
            <p className="dashboard-section-eyebrow">Dados em tempo real · Supabase</p>
          </div>
          <button
            type="button"
            className="dashboard-section-link"
            onClick={() => onNavigate?.(ViewType.OPPORTUNITIES)}
          >
            Ver todos
            <ChevronRight size={14} className="arr" aria-hidden="true" />
          </button>
        </div>

        {isLoading ? (
          <div className="dashboard-state">
            <Spinner />
            <p className="dashboard-state-label">Sincronizando…</p>
          </div>
        ) : error ? (
          <div className="dashboard-state">
            <AlertCircle size={28} color="var(--text-faint)" aria-hidden="true" />
            <p className="dashboard-state-message">{error}</p>
            <button
              type="button"
              className="dashboard-state-action"
              onClick={fetchOpportunities}
            >
              Recarregar
            </button>
          </div>
        ) : recentOpportunities.length > 0 ? (
          <div className="opp-list">
            {recentOpportunities.map((item) => (
              <button
                key={item.id}
                type="button"
                className="opp-row"
                onClick={() => onNavigate?.(ViewType.OPPORTUNITIES, item.category)}
              >
                <div className="opp-left">
                  <div className="opp-icon" aria-hidden="true">
                    <FileText size={16} />
                  </div>
                  <div className="opp-meta-block">
                    <p className="opp-title">{item.title}</p>
                    <div className="opp-meta">
                      <span className="opp-meta-date">
                        {new Date(item.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="opp-meta-cat">{item.category}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className="opp-chev" aria-hidden="true" />
              </button>
            ))}
          </div>
        ) : (
          <div className="dashboard-state">
            <p className="dashboard-state-message">
              Nenhuma oportunidade recente. Volte mais tarde.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardContent;
