import React, { useState } from 'react';
import { X, CheckCircle2, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { isDemoSession, addDemoOpportunity } from '../lib/demoStore';
import './AppPages.css';
import './Modal.css';

interface PublishOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const Spinner: React.FC = () => (
  <svg className="modal-spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PublishOpportunityModal: React.FC<PublishOpportunityModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Projeto',
    modality: 'Remoto',
    budget: '',
    negotiable: false,
    description: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const budgetValue = formData.negotiable
      ? null
      : (formData.budget ? parseFloat(formData.budget.replace(',', '.')) : null);

    if (isDemoSession()) {
      addDemoOpportunity({
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        modality: formData.modality as any,
        budget: budgetValue,
        is_negotiable: formData.negotiable,
        location: formData.modality === 'Remoto' ? 'Remoto' : 'A definir',
      });
      setIsSubmitting(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onSuccess();
        onClose();
      }, 1500);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      const { error } = await supabase.from('opportunities').insert({
        creator_id: user.id,
        title: formData.title,
        category: formData.category,
        modality: formData.modality,
        description: formData.description,
        budget: budgetValue,
        is_negotiable: formData.negotiable,
        location: 'Remoto',
      });
      if (error) throw error;
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onSuccess();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Erro ao publicar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
        <div className="modal-frame lg" onClick={(e) => e.stopPropagation()}>
          <div className="modal-head">
            <div className="modal-head-text">
              <h3>Publicar oportunidade</h3>
              <p className="eyebrow">Sua demanda chega à rede de engenheiros</p>
            </div>
            <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar">
              <X size={18} />
            </button>
          </div>

          <form className="modal-body" onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label" htmlFor="opp-title">Título da oportunidade</label>
              <input
                id="opp-title"
                className="form-input"
                placeholder="Ex: Laudo de estabilidade de galpão industrial"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label className="form-label" htmlFor="opp-cat">Tipo</label>
                <select
                  id="opp-cat"
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Laudo">Laudos e ART's</option>
                  <option value="Projeto">Projetos</option>
                  <option value="Emprego">Emprego</option>
                  <option value="Parceria">Parceria</option>
                  <option value="Consultoria">Consultoria</option>
                </select>
              </div>

              <div className="form-field">
                <span className="form-label">Modalidade</span>
                <div className="segmented" role="group" aria-label="Modalidade">
                  {['Presencial', 'Remoto'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      className={formData.modality === mode ? 'active' : ''}
                      onClick={() => setFormData({ ...formData, modality: mode })}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)' }}>
                <label className="form-label" htmlFor="opp-budget">Valor estimado (R$)</label>
                <label className="modal-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.negotiable}
                    onChange={(e) => setFormData({ ...formData, negotiable: e.target.checked })}
                  />
                  A combinar
                </label>
              </div>
              <input
                id="opp-budget"
                className="form-input"
                disabled={formData.negotiable}
                placeholder="0,00"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="opp-desc">Descrição detalhada</label>
              <textarea
                id="opp-desc"
                className="form-textarea"
                rows={4}
                placeholder="Escopo técnico, pré-requisitos e prazos esperados."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="modal-note">
              <Info size={16} aria-hidden="true" />
              <p style={{ margin: 0 }}>
                Sua oportunidade passa por triagem de segurança. Não inclua dados sensíveis de contato — toda comunicação acontece via chat seguro da plataforma.
              </p>
            </div>

            <div className="modal-foot" style={{ padding: 0, border: 0, background: 'transparent' }}>
              <button type="button" className="btn-pill ghost" onClick={onClose}>
                Voltar
              </button>
              <button type="submit" className="btn-pill primary" disabled={isSubmitting}>
                {isSubmitting ? <><Spinner /> Publicando…</> : 'Publicar agora'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showToast && (
        <div className="modal-toast success" role="status">
          <CheckCircle2 size={18} className="icon" aria-hidden="true" />
          <div className="modal-toast-text">
            <strong>Oportunidade publicada</strong>
            <small>Os engenheiros já podem visualizar sua demanda.</small>
          </div>
        </div>
      )}
    </>
  );
};

export default PublishOpportunityModal;
