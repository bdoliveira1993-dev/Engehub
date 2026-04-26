import React, { useState } from 'react';
import {
  User as UserIcon,
  Briefcase,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  LayoutDashboard,
  BookOpen,
  Calendar,
  Newspaper,
  MessageSquare,
  FileText,
  PenTool,
  Layers,
  Building2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { EngineeringType, User } from '../types';
import EngineeringSelector from './EngineeringSelector';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
}

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
}

const BrandMark: React.FC = () => (
  <span className="brand-mark" aria-hidden="true">
    <svg width="10" height="10" viewBox="0 0 10 10">
      <rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor" />
      <rect x="3" y="3" width="4" height="4" fill="currentColor" />
    </svg>
  </span>
);

const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, path }) => {
    const active = isActive(path);
    return (
      <button
        type="button"
        className={`nav-item ${active ? 'active' : ''}`}
        onClick={() => {
          navigate(path);
          setSidebarOpen(false);
        }}
        aria-current={active ? 'page' : undefined}
      >
        <span className="nav-icon" aria-hidden="true">
          <Icon size={18} />
        </span>
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <div
          className="app-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {!sidebarOpen && (
        <button
          type="button"
          className="app-menu-fab"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
      )}

      <aside
        className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}
        aria-label="Navegação principal"
      >
        <div className="app-sidebar-head">
          <button
            type="button"
            className="app-brand"
            onClick={() => {
              navigate('/dashboard');
              setSidebarOpen(false);
            }}
          >
            <BrandMark />
            <span>engehub<span className="brand-dot">.</span></span>
          </button>
          <button
            type="button"
            className="app-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="app-nav">
          <div className="nav-group">
            <p className="nav-group-label">Painel central</p>
            <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
            <NavItem icon={UserIcon} label="Meu perfil" path="/profile" />
            <NavItem icon={Briefcase} label="Meus serviços" path="/services" />
          </div>

          <div className="nav-group">
            <p className="nav-group-label">Oportunidades</p>
            <NavItem icon={Layers} label="Todas" path="/opportunities" />
            <NavItem icon={FileText} label="Laudos e ART's" path="/opportunities/laudo" />
            <NavItem icon={PenTool} label="Projetos" path="/opportunities/projeto" />
            <NavItem icon={Briefcase} label="Emprego" path="/opportunities/emprego" />
            <NavItem icon={Building2} label="Consultoria" path="/opportunities/consultoria" />
          </div>

          <div className="nav-group">
            <p className="nav-group-label">Rede</p>
            <NavItem icon={BookOpen} label="Educação" path="/courses" />
            <NavItem icon={Calendar} label="Eventos" path="/events" />
            <NavItem icon={Newspaper} label="Notícias" path="/news" />
          </div>
        </nav>

        <div className="app-sidebar-foot">
          <div className="app-user">
            <div className="app-user-avatar" aria-hidden="true">
              {user?.photo ? (
                <img src={user.photo} alt="" />
              ) : (
                <UserIcon size={18} />
              )}
            </div>
            <div className="app-user-info">
              <p className="app-user-name">{user?.name || 'Engenheiro'}</p>
              <p className="app-user-meta">{user?.engineeringType || '—'}</p>
            </div>
          </div>
          <button type="button" className="app-logout" onClick={onLogout}>
            <LogOut size={16} aria-hidden="true" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-header">
          <div className="app-search">
            <Search size={16} className="app-search-icon" aria-hidden="true" />
            <input
              type="text"
              placeholder="Buscar no EngeHub…"
              aria-label="Buscar"
            />
          </div>

          <div className="app-header-right">
            <span className="app-demo-badge" aria-label="Projeto de portfólio">
              Projeto de portfólio
            </span>
            <EngineeringSelector
              current={user?.engineeringType || EngineeringType.CIVIL}
              onChange={() => { /* persistência ainda não implementada */ }}
            />
            <span className="app-header-divider" aria-hidden="true" />
            <button
              type="button"
              className={`app-icon-btn ${isActive('/messages') ? 'active' : ''}`}
              onClick={() => navigate('/messages')}
              aria-label="Mensagens"
            >
              <MessageSquare size={18} />
            </button>
            <button
              type="button"
              className="app-icon-btn"
              aria-label="Notificações"
            >
              <Bell size={18} />
            </button>
          </div>
        </header>

        <div className="app-content">
          <div className="app-content-inner">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
