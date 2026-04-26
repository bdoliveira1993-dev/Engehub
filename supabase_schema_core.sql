
-- ENGENHARIAHUB: DATABASE CORE SCHEMA
-- Este script deve ser executado no SQL Editor do Supabase.

-- 0. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE CATEGORIAS DE ENGENHARIA
CREATE TABLE engineering_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Popular categorias iniciais
INSERT INTO engineering_categories (name, slug) VALUES
('Civil', 'civil'),
('Elétrica', 'eletrica'),
('Mecânica', 'mecanica'),
('Química', 'quimica'),
('Produção', 'producao'),
('Computação', 'computacao'),
('Ambiental', 'ambiental');

-- 2. TABELA DE PERFIS (Extensão do auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    engineering_type_id UUID REFERENCES engineering_categories(id),
    crea_number VARCHAR(50),
    bio TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABELA DE OPORTUNIDADES
CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    engineering_type_id UUID REFERENCES engineering_categories(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) CHECK (category IN ('Projeto', 'Consultoria', 'Laudo', 'Emprego', 'Parceria', 'ART')),
    modality VARCHAR(20) CHECK (modality IN ('Presencial', 'Remoto', 'Híbrido')),
    location VARCHAR(255),
    budget DECIMAL(12, 2),
    is_negotiable BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABELA DE PROPOSTAS
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    engineer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    value DECIMAL(12, 2),
    status VARCHAR(20) DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Em Análise', 'Aceita', 'Recusada')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABELA DE EVENTOS
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    is_online BOOLEAN DEFAULT FALSE,
    type VARCHAR(50) CHECK (type IN ('Webinar', 'Palestra', 'Visita Técnica', 'Workshop')),
    image_url TEXT,
    engineering_type_id UUID REFERENCES engineering_categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABELA DE CONFIRMAÇÃO DE EVENTOS (RSVP)
CREATE TABLE event_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reminder_sent_24h BOOLEAN DEFAULT FALSE,
    reminder_sent_1h BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- 7. TABELA DE FÓRUM (Tópicos)
CREATE TABLE forum_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    engineering_type_id UUID REFERENCES engineering_categories(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. TABELA DE FÓRUM (Respostas)
CREATE TABLE forum_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. TABELA DE MENSAGENS (Chat Direto)
CREATE TABLE direct_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-----------------------------------------------------------
-- SEGURANÇA (RLS - ROW LEVEL SECURITY)
-----------------------------------------------------------

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA PROFILES (LGPD)
CREATE POLICY "Qualquer um pode ver nomes e cargos" ON profiles FOR SELECT USING (true);
CREATE POLICY "Dono pode editar seu próprio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);

-- POLÍTICAS PARA OPORTUNIDADES
CREATE POLICY "Qualquer logado pode ver oportunidades" ON opportunities FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Qualquer logado pode criar oportunidades" ON opportunities FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Apenas criador pode editar oportunidade" ON opportunities FOR UPDATE USING (auth.uid() = creator_id);

-- POLÍTICAS PARA PROPOSTAS
CREATE POLICY "Dono da oportunidade vê todas as propostas" ON proposals FOR SELECT USING (
    EXISTS (SELECT 1 FROM opportunities WHERE id = opportunity_id AND creator_id = auth.uid())
);
CREATE POLICY "Engenheiro vê suas próprias propostas" ON proposals FOR SELECT USING (auth.uid() = engineer_id);
CREATE POLICY "Apenas engenheiro logado pode enviar proposta" ON proposals FOR INSERT WITH CHECK (auth.uid() = engineer_id);

-- POLÍTICAS PARA MENSAGENS (PRIVACIDADE TOTAL)
CREATE POLICY "Participantes podem ler suas mensagens" ON direct_messages FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "Qualquer um pode enviar mensagem" ON direct_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- POLÍTICAS PARA FÓRUM
CREATE POLICY "Qualquer um pode ler tópicos" ON forum_topics FOR SELECT USING (true);
CREATE POLICY "Logado pode criar tópico" ON forum_topics FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Qualquer um pode ler respostas" ON forum_replies FOR SELECT USING (true);
CREATE POLICY "Logado pode responder" ON forum_replies FOR INSERT WITH CHECK (auth.uid() = author_id);

-- POLÍTICAS PARA EVENTOS
CREATE POLICY "Qualquer um pode ver eventos" ON events FOR SELECT USING (true);
CREATE POLICY "Dono pode gerenciar sua presença" ON event_attendees FOR ALL USING (auth.uid() = user_id);

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX idx_opportunities_eng_type ON opportunities(engineering_type_id);
CREATE INDEX idx_forum_topics_eng_type ON forum_topics(engineering_type_id);
CREATE INDEX idx_messages_conversation ON direct_messages(sender_id, receiver_id);
