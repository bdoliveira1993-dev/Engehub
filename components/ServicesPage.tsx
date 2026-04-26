import React, { useEffect, useState } from 'react';
import {
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Star,
  FileText,
  PencilRuler,
  Briefcase,
  X,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { isDemoSession, getDemoServices, addDemoService } from '../lib/demoStore';
import './AppPages.css';
import './Modal.css';

interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  price: string;
  status: 'Publicado' | 'Rascunho';
  icon: React.ComponentType<{ size?: number }>;
}

const Spinner: React.FC = () => (
  <svg className="state-spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const Icon = service.icon;
  return (
    <article className="card hoverable" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
        <div className="stat-icon" aria-hidden="true">
          <Icon size={18} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className={`badge ${service.status === 'Publicado' ? 'success' : 'muted'}`}>
            {service.status}
          </span>
          <button type="button" className="icon-btn" aria-label="Mais opções">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <h3 className="media-card-title" style={{ margin: 0 }}>{service.title}</h3>
      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
        {service.description}
      </p>

      <hr className="sep-x" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p className="stat-label" style={{ marginBottom: 4 }}>Preço sugerido</p>
          <p style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 500, color: 'var(--text-primary)' }}>
            {service.price}
          </p>
        </div>
      </div>
    </article>
  );
};

const ServicesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newService, setNewService] = useState({
    title: '',
    category: 'Projetos Estruturais',
    description: '',
    price: '',
    days: '',
  });

  const formatServices = (rows: any[]): Service[] =>
    rows.map((item: any) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      description: item.description,
      price: item.price ? `R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Sob consulta',
      status: item.status,
      icon: item.category?.includes('Laudo') ? FileText : PencilRuler,
    }));

  const fetchServices = async () => {
    if (isDemoSession()) {
      setServices(formatServices(getDemoServices()));
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setServices(formatServices(data || []));
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceValue = newService.price ? parseFloat(newService.price.replace(',', '.')) : null;

    if (isDemoSession()) {
      addDemoService({
        title: newService.title,
        description: newService.description,
        category: newService.category,
        price: priceValue,
      });
      setIsModalOpen(false);
      setNewService({ title: '', category: 'Projetos Estruturais', description: '', price: '', days: '' });
      fetchServices();
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');
      const { error } = await supabase.from('services').insert({
        provider_id: user.id,
        title: newService.title,
        category: newService.category,
        description: newService.description,
        price: priceValue,
        status: 'Publicado',
      });
      if (error) throw error;
      setIsModalOpen(false);
      setNewService({ title: '', category: 'Projetos Estruturais', description: '', price: '', days: '' });
      fetchServices();
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Meus serviços</h1>
          <p>Gerencie seu catálogo de serviços e laudos técnicos.</p>
        </div>
        <div className="page-head-actions">
          <button type="button" className="btn-pill primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} aria-hidden="true" /> Novo serviço
          </button>
        </div>
      </div>

      <div className="stats-grid cols-3">
        <div className="stat">
          <div className="stat-icon" aria-hidden="true"><CheckCircle2 size={18} /></div>
          <div className="stat-text">
            <p className="stat-label">Serviços ativos</p>
            <p className="stat-value">{services.length}</p>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon" aria-hidden="true"><Clock size={18} /></div>
          <div className="stat-text">
            <p className="stat-label">Em rascunho</p>
            <p className="stat-value">0</p>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon" aria-hidden="true"><Star size={18} /></div>
          <div className="stat-text">
            <p className="stat-label">Avaliação média</p>
            <p className="stat-value">4.9</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="state-block">
          <Spinner />
          <p className="state-tag">Sincronizando…</p>
        </div>
      ) : services.length > 0 ? (
        <div className="card-grid cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="state-block">
          <div className="state-icon"><Briefcase size={24} /></div>
          <p className="state-title">Sua galeria está vazia</p>
          <p className="state-message">
            Você ainda não cadastrou serviços. Comece agora para ser encontrado por novos clientes e empresas.
          </p>
          <button type="button" className="btn-pill primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} aria-hidden="true" /> Criar primeiro serviço
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setIsModalOpen(false)}>
          <div className="modal-frame" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-head-text">
                <h3>Novo serviço</h3>
                <p className="eyebrow">Informações técnicas</p>
              </div>
              <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <form className="modal-body" onSubmit={handleCreateService}>
              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label" htmlFor="srv-title">Título do serviço</label>
                  <input
                    id="srv-title"
                    className="form-input"
                    placeholder="Ex: Cálculo de estrutura metálica"
                    value={newService.title}
                    onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="srv-cat">Categoria</label>
                  <select
                    id="srv-cat"
                    className="form-select"
                    value={newService.category}
                    onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                  >
                    <option>Projetos Estruturais</option>
                    <option>Laudos e Perícias</option>
                    <option>Consultoria</option>
                    <option>Gerenciamento</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="srv-desc">Descrição detalhada</label>
                <textarea
                  id="srv-desc"
                  className="form-textarea"
                  rows={4}
                  placeholder="Descreva o escopo, metodologias utilizadas e o que o cliente receberá."
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label" htmlFor="srv-price">Preço estimado (R$)</label>
                  <input
                    id="srv-price"
                    className="form-input"
                    placeholder="0,00 (Opcional)"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="srv-days">Prazo (dias)</label>
                  <input
                    id="srv-days"
                    className="form-input"
                    type="number"
                    placeholder="Ex: 15"
                    value={newService.days}
                    onChange={(e) => setNewService({ ...newService, days: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-note">
                <CheckCircle2 size={16} aria-hidden="true" />
                <p style={{ margin: 0 }}>
                  <strong>Atenção:</strong> Ao publicar, seu serviço estará visível para empresas verificadas. Certifique-se de que os dados técnicos estejam corretos para garantir a emissão da ART.
                </p>
              </div>

              <div className="modal-foot" style={{ padding: 0, border: 0, background: 'transparent' }}>
                <button type="button" className="btn-pill ghost" onClick={() => setIsModalOpen(false)}>
                  Salvar rascunho
                </button>
                <button type="submit" className="btn-pill primary">
                  Publicar serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
