import React, { useEffect, useState } from 'react';
import {
  Search,
  MapPin,
  DollarSign,
  Calendar,
  ChevronRight,
  Plus,
  Filter,
  Send,
  X,
  ShieldCheck,
  FileUp,
  Building2,
  Briefcase,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import PublishOpportunityModal from './PublishOpportunityModal';
import { supabase } from '../lib/supabase';
import { isDemoSession, getDemoOpportunities } from '../lib/demoStore';
import './AppPages.css';
import './Modal.css';

const SLUG_TO_CATEGORY: Record<string, string> = {
  laudo: 'Laudo',
  projeto: 'Projeto',
  emprego: 'Emprego',
  consultoria: 'Consultoria',
};

interface Opportunity {
  id: string;
  title: string;
  category: 'Projeto' | 'Consultoria' | 'Laudo' | 'Emprego' | 'Parceria' | 'ART';
  location: string;
  budget: string;
  rawBudget: number | null;
  isNegotiable: boolean;
  description: string;
  company: string;
  postedAt: string;
}

type BudgetFilter = 'up5k' | '5k20k' | 'above20k' | 'negotiable' | null;
type ModalityFilter = 'Remoto' | 'Presencial' | null;


const CATEGORY_ICON: Record<string, LucideIcon> = {
  Laudo: ShieldCheck,
  ART: ShieldCheck,
  Projeto: Briefcase,
  Consultoria: Building2,
  Emprego: Building2,
  Parceria: Users,
};

const CATEGORY_BADGE: Record<string, 'warning' | 'info' | 'success' | 'muted'> = {
  Laudo: 'warning',
  ART: 'warning',
  Projeto: 'info',
  Consultoria: 'success',
  Emprego: 'muted',
  Parceria: 'info',
};

const Spinner: React.FC = () => (
  <svg className="state-spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const OpportunityCard: React.FC<{ opp: Opportunity; onOpenProposal: (opp: Opportunity) => void }> = ({ opp, onOpenProposal }) => {
  const Icon = CATEGORY_ICON[opp.category] || Briefcase;
  const badge = CATEGORY_BADGE[opp.category] || 'muted';
  return (
    <article
      className="card hoverable"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
        <div className="stat-icon" aria-hidden="true">
          <Icon size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
            <span className={`badge ${badge}`}>{opp.category}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={10} aria-hidden="true" /> {opp.postedAt}
            </span>
          </div>
          <h3 className="media-card-title" style={{ margin: 0 }}>{opp.title}</h3>
          <p style={{ margin: 'var(--space-2) 0 0', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
            {opp.description}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Building2 size={12} aria-hidden="true" /> {opp.company}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={12} aria-hidden="true" /> {opp.location}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--status-success)' }}>
          <DollarSign size={12} aria-hidden="true" /> {opp.budget}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" className="btn-pill primary" onClick={() => onOpenProposal(opp)}>
          Enviar proposta <ChevronRight size={14} className="arr" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};

const OpportunitiesPage: React.FC = () => {
  const { category: categorySlug } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const categoryFromUrl = categorySlug ? (SLUG_TO_CATEGORY[categorySlug] || null) : null;

  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(categoryFromUrl);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [modalityFilter, setModalityFilter] = useState<ModalityFilter>(null);
  const [budgetFilter, setBudgetFilter] = useState<BudgetFilter>(null);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatOpportunities = (rows: any[]): Opportunity[] =>
    rows.map((item: any) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      location: item.location || 'Remoto',
      rawBudget: item.budget ?? null,
      isNegotiable: item.is_negotiable ?? false,
      budget: item.is_negotiable || !item.budget
        ? 'A combinar'
        : `R$ ${item.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      description: item.description,
      company: item.profiles?.full_name || 'EngeHub User',
      postedAt: new Date(item.created_at).toLocaleDateString('pt-BR'),
    }));

  const fetchOpportunities = async () => {
    if (isDemoSession()) {
      setOpportunities(formatOpportunities(getDemoOpportunities()));
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*, profiles:creator_id ( full_name )')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOpportunities(formatOpportunities(data || []));
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
    setCategoryFilter(categoryFromUrl);
  }, [categoryFromUrl]);

  const handleOpenProposal = (opp: Opportunity) => {
    setSelectedOpp(opp);
    setIsProposalModalOpen(true);
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !categoryFilter ||
      opp.category === categoryFilter ||
      (categoryFilter === 'Laudo' && opp.category === 'ART');
    const matchesModality =
      !modalityFilter ||
      (modalityFilter === 'Remoto' && opp.location === 'Remoto') ||
      (modalityFilter === 'Presencial' && opp.location !== 'Remoto');
    const matchesBudget =
      !budgetFilter ||
      (budgetFilter === 'negotiable' && opp.isNegotiable) ||
      (budgetFilter === 'up5k' && opp.rawBudget !== null && opp.rawBudget <= 5000) ||
      (budgetFilter === '5k20k' && opp.rawBudget !== null && opp.rawBudget > 5000 && opp.rawBudget <= 20000) ||
      (budgetFilter === 'above20k' && opp.rawBudget !== null && opp.rawBudget > 20000);
    return matchesSearch && matchesCategory && matchesModality && matchesBudget;
  });

  const activeFilterCount = [modalityFilter, budgetFilter].filter(Boolean).length;

  const getPageTitle = () => {
    if (!categoryFilter) return 'Todas as oportunidades';
    if (categoryFilter === 'Laudo') return "Laudos e ART's";
    return categoryFilter + 's';
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{getPageTitle()}</h1>
          <p>
            {categoryFilter
              ? `Exibindo demandas filtradas por ${categoryFilter}.`
              : 'Encontre projetos, laudos e vagas exclusivas para engenheiros.'}
          </p>
        </div>
        <div className="page-head-actions">
          <button type="button" className="btn-pill ghost" onClick={() => setIsPublishModalOpen(true)}>
            <Plus size={16} aria-hidden="true" /> Publicar oportunidade
          </button>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 220 }}>
            <Search size={14} aria-hidden="true" />
            <input
              type="text"
              placeholder="Buscar por título, empresa ou cidade…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar oportunidades"
            />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {categoryFilter && (
              <button
                type="button"
                className="btn-pill ghost"
                onClick={() => navigate('/opportunities')}
              >
                Limpar filtro <X size={14} />
              </button>
            )}
            <button
              type="button"
              className={`btn-pill ghost${activeFilterCount > 0 ? ' filter-active' : ''}`}
              onClick={() => setIsFilterPanelOpen((v) => !v)}
              aria-expanded={isFilterPanelOpen}
            >
              <Filter size={14} aria-hidden="true" />
              Mais filtros
              {activeFilterCount > 0 && (
                <span className="filter-count" aria-label={`${activeFilterCount} filtro(s) ativo(s)`}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {isFilterPanelOpen && (
          <div className="filter-panel">
            <hr className="sep-x" />
            <div className="filter-panel-row">
              <div className="filter-group">
                <p className="filter-group-label">Modalidade</p>
                <div className="segmented" role="group" aria-label="Filtrar por modalidade">
                  {(['Todos', 'Remoto', 'Presencial'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      className={modalityFilter === (mode === 'Todos' ? null : mode) ? 'active' : ''}
                      onClick={() => setModalityFilter(mode === 'Todos' ? null : mode)}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <p className="filter-group-label">Faixa de orçamento</p>
                <div className="filter-chips">
                  {([
                    { label: 'Todos', value: null },
                    { label: 'Até R$ 5k', value: 'up5k' },
                    { label: 'R$ 5k – 20k', value: '5k20k' },
                    { label: 'Acima de R$ 20k', value: 'above20k' },
                    { label: 'A combinar', value: 'negotiable' },
                  ] as { label: string; value: BudgetFilter }[]).map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      className={`btn-chip${budgetFilter === opt.value ? ' active' : ''}`}
                      onClick={() => setBudgetFilter(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div>
                <button
                  type="button"
                  className="btn-pill ghost"
                  style={{ fontSize: 'var(--text-xs)', padding: '8px 16px' }}
                  onClick={() => { setModalityFilter(null); setBudgetFilter(null); }}
                >
                  <X size={12} /> Limpar filtros adicionais
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', minHeight: 320 }}>
        {isLoading ? (
          <div className="state-block">
            <Spinner />
            <p className="state-tag">Sincronizando…</p>
          </div>
        ) : filteredOpportunities.length > 0 ? (
          filteredOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} onOpenProposal={handleOpenProposal} />
          ))
        ) : (
          <div className="state-block">
            <div className="state-icon"><Search size={20} /></div>
            <p className="state-title">Nenhuma oportunidade encontrada</p>
            <p className="state-message">
              Tente mudar o filtro ou a busca para ver mais resultados.
            </p>
            <button
              type="button"
              className="btn-pill ghost"
              onClick={() => {
                setSearchQuery('');
                navigate('/opportunities');
              }}
            >
              Ver todas as oportunidades
            </button>
          </div>
        )}
      </div>

      <PublishOpportunityModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onSuccess={() => {
          fetchOpportunities();
        }}
      />

      {isProposalModalOpen && selectedOpp && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsProposalModalOpen(false)}
        >
          <div className="modal-frame" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-head-text">
                <h3>Enviar proposta</h3>
                <p className="eyebrow">Ref: {selectedOpp.title}</p>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsProposalModalOpen(false)}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="modal-body"
              onSubmit={(e) => {
                e.preventDefault();
                setIsProposalModalOpen(false);
              }}
            >
              <div className="form-field">
                <label className="form-label" htmlFor="prop-msg">Mensagem de apresentação</label>
                <textarea
                  id="prop-msg"
                  className="form-textarea"
                  rows={5}
                  placeholder="Olá! Gostaria de me candidatar a esta oportunidade. Tenho experiência em…"
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label" htmlFor="prop-value">Valor da proposta (R$)</label>
                  <input
                    id="prop-value"
                    className="form-input"
                    type="number"
                    placeholder="0,00"
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="prop-file">Anexo técnico (opcional)</label>
                  <label className="modal-fileupload" htmlFor="prop-file">
                    <FileUp size={14} aria-hidden="true" />
                    Enviar cronograma / PDF
                    <input id="prop-file" type="file" />
                  </label>
                </div>
              </div>

              <div className="modal-note success">
                <ShieldCheck size={16} aria-hidden="true" />
                <p style={{ margin: 0 }}>
                  <strong>LGPD:</strong> Seus dados de contato e portfólio só são compartilhados com o anunciante após interesse mútuo. Tudo via chat seguro da plataforma.
                </p>
              </div>

              <div className="modal-foot" style={{ padding: 0, border: 0, background: 'transparent' }}>
                <button type="button" className="btn-pill ghost" onClick={() => setIsProposalModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-pill primary">
                  <Send size={14} aria-hidden="true" /> Enviar agora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunitiesPage;
