import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  MapPin,
  Mail,
  Linkedin,
  Phone,
  CheckCircle2,
  Briefcase,
  Edit3,
  Lock,
  Eye,
  User as UserIcon,
  Save,
  X,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { isDemoSession, getDemoProfile, updateDemoProfile } from '../lib/demoStore';
import './AppPages.css';

interface ProfilePageProps {
  user: { name: string; email: string; photo?: string } | null;
  onUpdateUser: (data: any) => void;
}

interface FormData {
  name: string;
  title: string;
  bio: string;
  crea: string;
  linkedin: string;
  phone: string;
  location: string;
}

const Spinner: React.FC = () => (
  <svg className="modal-spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'privacy'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState<FormData>({
    name: user?.name || '',
    title: '',
    bio: '',
    crea: '',
    linkedin: '',
    phone: '',
    location: '',
  });

  useEffect(() => {
    if (isDemoSession()) {
      const demo = getDemoProfile();
      setFormData({
        name: demo.full_name,
        title: demo.occupation,
        bio: demo.bio,
        crea: demo.crea_number,
        linkedin: demo.linkedin,
        phone: demo.phone,
        location: demo.location,
      });
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (data) {
          setFormData({
            name: data.full_name || '',
            title: data.occupation || '',
            bio: data.bio || '',
            crea: data.crea_number || '',
            linkedin: data.linkedin || '',
            phone: data.phone || '',
            location: data.location || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSaveStatus('saving');

    if (isDemoSession()) {
      updateDemoProfile({
        full_name: formData.name,
        occupation: formData.title,
        bio: formData.bio,
        crea_number: formData.crea,
        linkedin: formData.linkedin,
        phone: formData.phone,
        location: formData.location,
      });
      onUpdateUser({ name: formData.name });
      setTimeout(() => {
        setSaveStatus('success');
        setTimeout(() => {
          setIsEditing(false);
          setSaveStatus('idle');
        }, 800);
      }, 400);
      return;
    }

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('No user');
      const { error } = await supabase.from('profiles').upsert({
        id: authUser.id,
        full_name: formData.name,
        occupation: formData.title,
        bio: formData.bio,
        crea_number: formData.crea,
        linkedin: formData.linkedin,
        phone: formData.phone,
        location: formData.location,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      onUpdateUser({ name: formData.name });
      setSaveStatus('success');
      setTimeout(() => {
        setIsEditing(false);
        setSaveStatus('idle');
      }, 1000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setSaveStatus('error');
    }
  };

  if (isLoading) {
    return (
      <div className="page">
        <div className="state-block">
          <Spinner />
          <p className="state-tag">Carregando perfil…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="profile-banner" aria-hidden="true" />

      <div className="profile-header">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-4)' }}>
          <div className="profile-avatar">
            {user?.photo ? <img src={user.photo} alt="" /> : <UserIcon size={48} />}
          </div>
          <div className="profile-id">
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <input
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome completo"
                />
                <input
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título profissional"
                />
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                  <h1>{formData.name}</h1>
                  <span className="badge success">
                    <ShieldCheck size={10} aria-hidden="true" /> CREA verificado
                  </span>
                </div>
                <p className="title">{formData.title || '—'}</p>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          {isEditing ? (
            <>
              <button type="button" className="btn-pill ghost" onClick={() => setIsEditing(false)}>
                <X size={16} /> Cancelar
              </button>
              <button
                type="button"
                className="btn-pill primary"
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? <Spinner /> : saveStatus === 'success' ? <CheckCircle2 size={16} /> : <Save size={16} />}
                {saveStatus === 'saving' ? 'Salvando…' : saveStatus === 'success' ? 'Salvo' : 'Salvar alterações'}
              </button>
            </>
          ) : (
            <button type="button" className="btn-pill ghost" onClick={() => setIsEditing(true)}>
              <Edit3 size={16} /> Editar perfil
            </button>
          )}
        </div>
      </div>

      <div className="profile-grid">
        <aside className="profile-aside">
          <div className="card">
            <span className="badge success">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--status-success)' }} />
              Disponível para projetos
            </span>

            <div className="profile-contact" style={{ marginTop: 'var(--space-5)' }}>
              <p className="form-label" style={{ margin: 0 }}>Contato</p>
              <div className="profile-contact-row">
                <Mail size={16} aria-hidden="true" />
                <span>{user?.email}</span>
              </div>

              {isEditing ? (
                <>
                  <div className="profile-contact-row editable">
                    <Linkedin size={16} aria-hidden="true" />
                    <input value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} placeholder="LinkedIn" />
                  </div>
                  <div className="profile-contact-row editable">
                    <Phone size={16} aria-hidden="true" />
                    <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Telefone" />
                  </div>
                  <div className="profile-contact-row editable">
                    <MapPin size={16} aria-hidden="true" />
                    <input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Localização" />
                  </div>
                </>
              ) : (
                <>
                  <div className="profile-contact-row">
                    <Linkedin size={16} aria-hidden="true" />
                    <span>{formData.linkedin || '—'}</span>
                  </div>
                  <div className="profile-contact-row">
                    <Phone size={16} aria-hidden="true" />
                    <span>{formData.phone || '—'}</span>
                  </div>
                  <div className="profile-contact-row">
                    <MapPin size={16} aria-hidden="true" />
                    <span>{formData.location || '—'}</span>
                  </div>
                </>
              )}
            </div>

            <hr className="sep-x" style={{ margin: 'var(--space-5) 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span className="form-label" style={{ margin: 0 }}>CREA / SP</span>
              {isEditing ? (
                <input
                  className="form-input"
                  style={{ maxWidth: 160, padding: '6px var(--space-3)' }}
                  value={formData.crea}
                  onChange={(e) => setFormData({ ...formData, crea: e.target.value })}
                />
              ) : (
                <span className="profile-crea">{formData.crea || '—'}</span>
              )}
            </div>
          </div>

          {saveStatus === 'error' && (
            <div className="card" style={{ borderColor: 'rgba(239, 68, 68, 0.25)', background: 'rgba(239, 68, 68, 0.06)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', color: 'var(--status-danger)' }}>
                <AlertCircle size={18} aria-hidden="true" />
                <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>Erro ao salvar. Tente novamente.</p>
              </div>
            </div>
          )}
        </aside>

        <div>
          <div className="tabs">
            {[
              { id: 'overview' as const, label: 'Visão geral', icon: Eye },
              { id: 'portfolio' as const, label: 'Portfólio', icon: Briefcase },
              { id: 'privacy' as const, label: 'Privacidade', icon: Lock },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                className={`tab ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                <t.icon size={16} aria-hidden="true" />
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ paddingTop: 'var(--space-6)' }}>
            {activeTab === 'overview' && (
              <div className="profile-section">
                <h3>Sobre mim</h3>
                {isEditing ? (
                  <textarea
                    className="form-textarea"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Conte um pouco sobre sua trajetória, especialidade técnica e foco atual."
                  />
                ) : (
                  <p className="profile-bio">{formData.bio || 'Sem bio cadastrada ainda.'}</p>
                )}

                <h3 style={{ marginTop: 'var(--space-8)' }}>Experiência profissional</h3>
                <div className="profile-experience">
                  {[
                    { company: 'ConstructX Soluções', role: 'Engenheiro Sênior', period: '2021 — Presente', desc: 'Liderança de equipe técnica em obras verticais de alto padrão.' },
                    { company: 'Engenharia Civil Global', role: 'Engenheiro Calculista', period: '2018 — 2021', desc: 'Dimensionamento de estruturas metálicas e concreto armado.' },
                  ].map((exp, idx) => (
                    <div key={idx} className="profile-exp-item">
                      <p className="profile-exp-role">{exp.role}</p>
                      <p className="profile-exp-meta">{exp.period}</p>
                      <p className="profile-exp-company">{exp.company}</p>
                      <p className="profile-exp-desc">{exp.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="card-grid">
                {[
                  { title: 'Complexo Residencial Horizon', year: '2023', category: 'Estrutural', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=250&auto=format&fit=crop' },
                  { title: 'Ponte Estaiada Central', year: '2022', category: 'Infraestrutura', image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=400&h=250&auto=format&fit=crop' },
                ].map((project) => (
                  <article key={project.title} className="media-card">
                    <div className="media-card-image">
                      <img src={project.image} alt={project.title} />
                    </div>
                    <div className="media-card-body">
                      <div className="media-card-meta">
                        <span style={{ color: 'var(--accent)' }}>{project.category}</span>
                        <span>· {project.year}</span>
                      </div>
                      <h3 className="media-card-title">{project.title}</h3>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="modal-note">
                <ShieldCheck size={18} aria-hidden="true" />
                <p style={{ margin: 0 }}>
                  <strong>Seus dados estão protegidos.</strong> A plataforma segue rigorosamente as diretrizes da LGPD. Você pode solicitar exportação ou exclusão dos seus dados a qualquer momento via configurações de conta.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
