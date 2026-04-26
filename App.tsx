
import React, { useState, useEffect } from 'react';
import { ViewType, EngineeringType, User } from './types';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage'; // Assumindo que existe, se não, criar ou remover
import HomePage from './components/HomePage';
import Layout from './components/Layout';
import DashboardContent from './components/DashboardContent';
import ProfilePage from './components/ProfilePage';
import ServicesPage from './components/ServicesPage';
import OpportunitiesPage from './components/OpportunitiesPage';
import CoursesPage from './components/CoursesPage';
import MessagesPage from './components/MessagesPage';
import EventsPage from './components/EventsPage';
import NewsPage from './components/NewsPage';
import EngineeringOnboardingModal from './components/EngineeringOnboardingModal';
import ProtectedRoute from './components/ProtectedRoute';
import { supabase } from './lib/supabase';
import { isDemoSession, exitDemoMode } from './lib/demoStore';
import { DEMO_USER } from './lib/demoData';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Modo Visitante (demo) — pula auth real e usa usuário virtual.
    if (isDemoSession()) {
      setUser(DEMO_USER);
      setLoading(false);
      return;
    }

    const checkInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.error('[EngeHub] getSession error:', error);
        if (data?.session) {
          await handleAuthUser(data.session.user);
        }
      } catch (err) {
        console.error('[EngeHub] checkInitialSession falhou:', err);
      } finally {
        setLoading(false);
      }
    };

    checkInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await handleAuthUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthUser = async (supabaseUser: any) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, engineering_type_id, engineering_categories(name)')
        .eq('id', supabaseUser.id)
        .single();

      const categoryName = (profile as any)?.engineering_categories?.name as string | undefined;
      const engineeringType = categoryName
        ? (Object.values(EngineeringType).find((v) => v === categoryName) as EngineeringType | undefined)
        : undefined;

      const userData: User = {
        name: profile?.full_name || supabaseUser.user_metadata?.full_name || 'Engenheiro',
        email: supabaseUser.email || '',
        photo: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url,
        engineeringType
      };

      setUser(userData);
    } catch (err) {
      console.error("Erro na sincronização EngeHub:", err);
    }
  };

  const handleLogout = async () => {
    if (isDemoSession()) {
      exitDemoMode();
      setUser(null);
      navigate('/');
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">Sincronizando EngeHub...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <HomePage />}
      />
      <Route
        path="/login"
        element={
          user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={() => { }} onSwitchMode={() => { }} />
        }
      />
      <Route
        path="/register"
        element={
          user
            ? <Navigate to="/dashboard" replace />
            : <RegisterPage onRegister={() => navigate('/login')} onSwitchToLogin={() => navigate('/login')} />
        }
      />

      <Route
        element={
          <ProtectedRoute user={user}>
            <Layout user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardContent user={user} onNavigate={(path) => navigate(path)} />} />
        <Route path="/profile" element={<ProfilePage user={user} onUpdateUser={(data) => setUser({ ...user, ...data } as User)} />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/opportunities" element={<OpportunitiesPage />} />
        <Route path="/opportunities/:category" element={<OpportunitiesPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/news" element={<NewsPage user={user} />} />
      </Route>

      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
    </Routes>
  );
};

export default App;
