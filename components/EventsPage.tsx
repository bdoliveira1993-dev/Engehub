import React, { useState } from 'react';
import {
  MapPin,
  Video,
  Plus,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import EventModal from './EventModal';
import './AppPages.css';

export interface EventItem {
  id: string;
  title: string;
  day: string;
  month: string;
  time: string;
  location: string;
  isOnline: boolean;
  type: 'Webinar' | 'Palestra' | 'Visita Técnica' | 'Workshop';
  description: string;
  imageUrl: string;
  isConfirmed: boolean;
}

const TYPE_BADGE: Record<string, 'info' | 'success' | 'warning' | 'muted'> = {
  Webinar: 'info',
  'Visita Técnica': 'success',
  Palestra: 'warning',
  Workshop: 'muted',
};

const EventsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([
    {
      id: '1',
      title: 'Webinar: Inovações em Concreto Protendido',
      day: '25',
      month: 'FEV',
      time: '19:00',
      location: 'Zoom · EngeHub Live',
      isOnline: true,
      type: 'Webinar',
      description: 'Análise das novas normas de protensão e softwares de cálculo.',
      imageUrl: '',
      isConfirmed: false,
    },
    {
      id: '2',
      title: 'Visita Técnica: Obra Edifício Metropolitan',
      day: '02',
      month: 'MAR',
      time: '09:00',
      location: 'Av. Paulista, 1000 — SP',
      isOnline: false,
      type: 'Visita Técnica',
      description: 'Concretagem da laje do 25º pavimento e sistemas de fôrmas.',
      imageUrl: '',
      isConfirmed: true,
    },
    {
      id: '3',
      title: 'Palestra: Gestão de Riscos na Construção Civil',
      day: '15',
      month: 'MAR',
      time: '14:30',
      location: 'Auditório EngeHub · Presencial',
      isOnline: false,
      type: 'Palestra',
      description: 'Como mitigar riscos contratuais e técnicos em grandes empreendimentos.',
      imageUrl: '',
      isConfirmed: false,
    },
  ]);

  const togglePresence = (id: string) => {
    setEvents(events.map((ev) => (ev.id === id ? { ...ev, isConfirmed: !ev.isConfirmed } : ev)));
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Eventos da comunidade</h1>
          <p>Networking e aprendizado contínuo para sua carreira.</p>
        </div>
        <div className="page-head-actions">
          <button type="button" className="btn-pill ghost" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} aria-hidden="true" /> Cadastrar evento
          </button>
        </div>
      </div>

      <div className="card-grid">
        {events.map((event) => (
          <article key={event.id} className="card hoverable" style={{ display: 'flex', padding: 0, overflow: 'hidden' }}>
            <div className="date-badge">
              <span className="date-badge-month">{event.month}</span>
              <span className="date-badge-day">{event.day}</span>
              <span className="date-badge-time">{event.time}</span>
            </div>

            <div style={{ flex: 1, padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                <span className={`badge ${TYPE_BADGE[event.type] || 'muted'}`}>{event.type}</span>
                <span style={{ color: 'var(--text-tertiary)' }} aria-label={event.isOnline ? 'Online' : 'Presencial'}>
                  {event.isOnline ? <Video size={14} aria-hidden="true" /> : <MapPin size={14} aria-hidden="true" />}
                </span>
              </div>

              <h3 className="media-card-title" style={{ margin: 0 }}>{event.title}</h3>

              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                {event.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>
                <MapPin size={11} aria-hidden="true" />
                <span>{event.location}</span>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <div className="people-stack">
                  {[11, 12, 13].map((n) => (
                    <div key={n} className="avatar">
                      <img src={`https://i.pravatar.cc/100?img=${n}`} alt="" />
                    </div>
                  ))}
                  <div className="avatar more">+24</div>
                </div>

                <button
                  type="button"
                  className={`btn-pill ${event.isConfirmed ? 'accent' : 'primary'}`}
                  onClick={() => togglePresence(event.id)}
                >
                  {event.isConfirmed ? (
                    <><CheckCircle2 size={14} aria-hidden="true" /> Presença confirmada</>
                  ) : (
                    <>Confirmar presença <ChevronRight size={14} className="arr" aria-hidden="true" /></>
                  )}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default EventsPage;
