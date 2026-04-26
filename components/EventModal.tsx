import React, { useState } from 'react';
import { X, Info } from 'lucide-react';
import './AppPages.css';
import './Modal.css';

interface EventModalProps {
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

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Webinar',
    date: '',
    time: '',
    location: '',
    description: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-frame" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-head-text">
            <h3>Cadastrar evento</h3>
            <p className="eyebrow">Compartilhe conhecimento com a rede</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label" htmlFor="ev-title">Título do evento</label>
            <input
              id="ev-title"
              className="form-input"
              placeholder="Ex: Webinar de patologia de fachadas"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label" htmlFor="ev-type">Tipo</label>
              <select
                id="ev-type"
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option>Webinar</option>
                <option>Palestra</option>
                <option>Visita Técnica</option>
                <option>Workshop</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="ev-date">Data</label>
              <input
                id="ev-date"
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label" htmlFor="ev-time">Hora</label>
              <input
                id="ev-time"
                type="time"
                className="form-input"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="ev-loc">Local ou link</label>
              <input
                id="ev-loc"
                className="form-input"
                placeholder="Auditório ou link Zoom"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="ev-desc">Descrição</label>
            <textarea
              id="ev-desc"
              className="form-textarea"
              rows={3}
              placeholder="Tópicos principais e pré-requisitos."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="modal-note">
            <Info size={16} aria-hidden="true" />
            <p style={{ margin: 0 }}>
              Eventos publicados passam por curadoria técnica antes de aparecer pra rede.
            </p>
          </div>

          <div className="modal-foot" style={{ padding: 0, border: 0, background: 'transparent' }}>
            <button type="button" className="btn-pill ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-pill primary" disabled={isSubmitting}>
              {isSubmitting ? <><Spinner /> Publicando…</> : 'Publicar evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
