import React, { useState } from 'react';
import {
  Clock,
  Star,
  BookOpen,
  Building2,
  Tag,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import './AppPages.css';
import './Modal.css';

interface Course {
  id: string;
  title: string;
  category: string;
  image: string;
  duration: string;
  rating: number;
  institution: string;
  originalPrice: string;
  discountPrice: string;
  affiliateUrl: string;
}

const CourseCard: React.FC<{ course: Course; onSelect: (course: Course) => void }> = ({ course, onSelect }) => (
  <article className="media-card">
    <div className="media-card-image">
      <img src={course.image} alt={course.title} />
    </div>
    <div className="media-card-body">
      <div className="media-card-meta">
        <span style={{ color: 'var(--accent)' }}>{course.category}</span>
        <span>·</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Building2 size={10} aria-hidden="true" /> {course.institution}
        </span>
      </div>
      <h3 className="media-card-title">{course.title}</h3>
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Clock size={11} aria-hidden="true" /> {course.duration}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--status-warning)' }}>
          <Star size={11} fill="currentColor" aria-hidden="true" /> {course.rating.toFixed(1)}
        </span>
      </div>

      <div className="media-card-foot">
        <div>
          <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-faint)', textDecoration: 'line-through' }}>
            {course.originalPrice}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 'var(--text-md)', fontWeight: 500, color: 'var(--text-primary)' }}>
            {course.discountPrice}
          </p>
        </div>
        <span className="badge success">
          <Tag size={10} aria-hidden="true" /> Desconto
        </span>
      </div>

      <button type="button" className="btn-pill primary" onClick={() => onSelect(course)} style={{ width: '100%' }}>
        Ver no parceiro <ExternalLink size={14} aria-hidden="true" />
      </button>
    </div>
  </article>
);

const CoursesPage: React.FC = () => {
  const [redirectingCourse, setRedirectingCourse] = useState<Course | null>(null);

  const courses: Course[] = [
    {
      id: '1',
      title: 'Especialização em Patologia das Construções',
      category: 'Pós-Graduação',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=600&h=400&auto=format&fit=crop',
      duration: '450h',
      rating: 4.9,
      institution: 'IPOG Institute',
      originalPrice: 'R$ 12.400',
      discountPrice: 'R$ 9.800',
      affiliateUrl: 'https://ipog.edu.br/curso/engenharia',
    },
    {
      id: '2',
      title: 'MBA em Gestão de Projetos de Engenharia',
      category: 'MBA',
      image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=600&h=400&auto=format&fit=crop',
      duration: '360h',
      rating: 4.8,
      institution: 'PUC-PR Online',
      originalPrice: 'R$ 15.000',
      discountPrice: 'R$ 12.500',
      affiliateUrl: 'https://pucpr.br/mba-gestao',
    },
    {
      id: '3',
      title: 'Cálculo Avançado de Estruturas Metálicas',
      category: 'Extensão',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&h=400&auto=format&fit=crop',
      duration: '60h',
      rating: 5.0,
      institution: 'Software Master Academy',
      originalPrice: 'R$ 1.200',
      discountPrice: 'R$ 850',
      affiliateUrl: 'https://softwaremaster.com/calculo',
    },
    {
      id: '4',
      title: 'Metodologia BIM para Coordenadores',
      category: 'Treinamento',
      image: 'https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=600&h=400&auto=format&fit=crop',
      duration: '40h',
      rating: 4.7,
      institution: 'BIM Brasil Pro',
      originalPrice: 'R$ 890',
      discountPrice: 'R$ 640',
      affiliateUrl: 'https://bimbrasil.pro/treinamento',
    },
  ];

  const confirmRedirect = () => {
    if (redirectingCourse) {
      window.open(redirectingCourse.affiliateUrl, '_blank');
      setRedirectingCourse(null);
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Marketplace de educação</h1>
          <p>Cursos e especializações com benefícios exclusivos para a comunidade.</p>
        </div>
      </div>

      <div className="stats-grid cols-3">
        <div className="stat">
          <div className="stat-icon" aria-hidden="true"><BookOpen size={18} /></div>
          <div className="stat-text">
            <p className="stat-label">Catálogo</p>
            <p className="stat-value">124 cursos</p>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon" aria-hidden="true"><Building2 size={18} /></div>
          <div className="stat-text">
            <p className="stat-label">Rede parceira</p>
            <p className="stat-value">18 escolas</p>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon" aria-hidden="true"><Tag size={18} /></div>
          <div className="stat-text">
            <p className="stat-label">Desconto médio</p>
            <p className="stat-value">22%</p>
          </div>
        </div>
      </div>

      <div className="card-grid cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} onSelect={setRedirectingCourse} />
        ))}
      </div>

      {redirectingCourse && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setRedirectingCourse(null)}
        >
          <div className="modal-frame sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body" style={{ textAlign: 'center', alignItems: 'center' }}>
              <div className="state-icon" style={{ color: 'var(--accent)' }}>
                <ExternalLink size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 500, color: 'var(--text-primary)' }}>
                Saindo da plataforma
              </h3>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', maxWidth: 360 }}>
                Você está sendo redirecionado para a <strong style={{ color: 'var(--text-primary)' }}>{redirectingCourse.institution}</strong>. A política de privacidade do parceiro passa a valer ao sair.
              </p>

              <div className="modal-note" style={{ width: '100%', marginTop: 'var(--space-2)' }}>
                <ShieldCheck size={16} aria-hidden="true" />
                <p style={{ margin: 0, textAlign: 'left' }}>
                  <strong>Garantia de desconto:</strong> O benefício exclusivo de membro será aplicado automaticamente via link de afiliado.
                </p>
              </div>
            </div>

            <div className="modal-foot">
              <button type="button" className="btn-pill ghost" onClick={() => setRedirectingCourse(null)}>
                Voltar
              </button>
              <button type="button" className="btn-pill primary" onClick={confirmRedirect}>
                Continuar <ArrowRight size={14} className="arr" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
