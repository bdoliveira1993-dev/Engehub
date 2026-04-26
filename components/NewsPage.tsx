import React, { useEffect, useState } from 'react';
import {
  Heart,
  MessageSquare,
  Share2,
  Clock,
  User as UserIcon,
  Send,
  Bookmark,
  TrendingUp,
} from 'lucide-react';
import './AppPages.css';

interface Comment {
  id: string;
  userName: string;
  userPhoto?: string;
  text: string;
  createdAt: string;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  imageUrl: string;
  likes: number;
  commentsCount: number;
  isLiked: boolean;
  comments: Comment[];
}

const NewsPage: React.FC<{ user: { name: string; photo?: string } | null }> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setNews([
        {
          id: '1',
          title: 'Nova Norma de Desempenho (NBR 15575) entra em consulta pública para revisão técnica',
          summary: 'A revisão foca em critérios de sustentabilidade e novos materiais cimentícios que prometem reduzir a pegada de carbono em até 30%. Especialistas debatem o impacto nos custos de obra.',
          source: 'Portal PINI',
          date: 'Há 2 horas',
          imageUrl: 'https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=1200&h=675&auto=format&fit=crop',
          likes: 124,
          commentsCount: 18,
          isLiked: false,
          comments: [
            { id: 'c1', userName: 'Eng. Carlos Silva', text: 'Excelente atualização. O foco em sustentabilidade é mandatório agora.', createdAt: 'Há 1 hora' },
          ],
        },
        {
          id: '2',
          title: 'Uso de Drones e IA reduz em 40% erros de levantamento topográfico em rodovias',
          summary: 'A tecnologia permite o processamento de nuvens de pontos em tempo real, integrando diretamente com softwares BIM para ajuste dinâmico de projetos de terraplenagem.',
          source: 'EngeHub News',
          date: 'Há 5 horas',
          imageUrl: 'https://images.unsplash.com/photo-1473960155412-586798e15af4?q=80&w=1200&h=675&auto=format&fit=crop',
          likes: 89,
          commentsCount: 5,
          isLiked: true,
          comments: [],
        },
        {
          id: '3',
          title: 'Mercado de Estruturas Metálicas prevê alta de 15% para o primeiro semestre',
          summary: 'O crescimento é impulsionado pelo setor logístico e a rapidez de montagem comparado ao concreto armado convencional em obras industriais.',
          source: 'Valor Econômico',
          date: 'Ontem',
          imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&h=675&auto=format&fit=crop',
          likes: 210,
          commentsCount: 42,
          isLiked: false,
          comments: [],
        },
      ]);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleLike = (id: string) => {
    setNews((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 } : item,
      ),
    );
  };

  const handleAddComment = (id: string) => {
    const text = newComments[id];
    if (!text?.trim() || !user) return;
    const newComment: Comment = {
      id: Math.random().toString(),
      userName: user.name,
      userPhoto: user.photo,
      text,
      createdAt: 'Agora',
    };
    setNews((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, comments: [newComment, ...item.comments], commentsCount: item.commentsCount + 1 }
          : item,
      ),
    );
    setNewComments((prev) => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="page" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="page-head">
        <div>
          <h1>EngeHub News</h1>
          <p>As principais notícias técnicas e de mercado para engenheiros.</p>
        </div>
        <div className="page-head-actions">
          <button type="button" className="icon-btn active" aria-label="Em alta">
            <TrendingUp size={16} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="state-block">
          <p className="state-tag">Carregando notícias…</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {news.map((item) => (
            <article key={item.id} className="card hoverable" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div className="media-card-image">
                <img src={item.imageUrl} alt={item.title} />
                <span
                  className="badge info"
                  style={{ position: 'absolute', top: 'var(--space-4)', left: 'var(--space-4)', background: 'rgba(12,12,13,0.85)' }}
                >
                  {item.source}
                </span>
              </div>

              <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>
                  <Clock size={11} aria-hidden="true" />
                  <span>{item.date}</span>
                </div>

                <h2 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.015em', lineHeight: 1.3 }}>
                  {item.title}
                </h2>

                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
                  {item.summary}
                </p>

                <hr className="sep-x" />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
                    <button
                      type="button"
                      onClick={() => toggleLike(item.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        background: 'transparent',
                        border: 0,
                        cursor: 'pointer',
                        color: item.isLiked ? 'var(--status-danger)' : 'var(--text-tertiary)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 500,
                      }}
                    >
                      <Heart size={16} fill={item.isLiked ? 'currentColor' : 'none'} aria-hidden="true" />
                      {item.likes}
                    </button>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                      <MessageSquare size={16} aria-hidden="true" />
                      {item.commentsCount}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button type="button" className="icon-btn" aria-label="Salvar"><Bookmark size={16} /></button>
                    <button type="button" className="icon-btn" aria-label="Compartilhar"><Share2 size={16} /></button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                  <div className="chat-avatar" style={{ width: 32, height: 32 }} aria-hidden="true">
                    {user?.photo ? <img src={user.photo} alt="" /> : <UserIcon size={14} />}
                  </div>
                  <div className="search-bar" style={{ flex: 1 }}>
                    <input
                      type="text"
                      placeholder="Comente tecnicamente…"
                      value={newComments[item.id] || ''}
                      onChange={(e) => setNewComments((prev) => ({ ...prev, [item.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(item.id)}
                      aria-label="Novo comentário"
                    />
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => handleAddComment(item.id)}
                      disabled={!newComments[item.id]?.trim()}
                      aria-label="Enviar comentário"
                      style={{ width: 28, height: 28 }}
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>

                {item.comments.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)' }}>
                    {item.comments.map((c) => (
                      <div key={c.id} style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <div className="chat-avatar" style={{ width: 28, height: 28 }} aria-hidden="true">
                          {c.userPhoto ? <img src={c.userPhoto} alt="" /> : <UserIcon size={12} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
                            <strong style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>
                              {c.userName}
                            </strong>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)' }}>
                              · {c.createdAt}
                            </span>
                          </div>
                          <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {c.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsPage;
