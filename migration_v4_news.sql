-- EngenhariaHub: Esquema para Feed de Notícias e Interações Sociais
-- Pré-requisito: rodar supabase_schema_core.sql antes (uuid-ossp + auth.users)

-- 1. Tabela de Notícias (Gerenciada via CMS ou Admin)
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    source VARCHAR(100),
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    engineering_type_id UUID REFERENCES engineering_categories(id),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sistema de Curtidas (Likes)
CREATE TABLE news_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    news_id UUID REFERENCES news(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(news_id, user_id)
);

-- 3. Comentários
CREATE TABLE news_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    news_id UUID REFERENCES news(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    parent_comment_id UUID REFERENCES news_comments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_news_created_at ON news(created_at DESC);
CREATE INDEX idx_news_comments_news_id ON news_comments(news_id);
CREATE INDEX idx_news_likes_news_id ON news_likes(news_id);
CREATE INDEX idx_news_engineering ON news(engineering_type_id);

-- View com contadores agregados
CREATE VIEW news_with_stats AS
SELECT
    n.*,
    (SELECT COUNT(*) FROM news_likes WHERE news_id = n.id) AS likes_count,
    (SELECT COUNT(*) FROM news_comments WHERE news_id = n.id) AS comments_count
FROM news n;

-- Segurança (RLS)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer um pode ler notícias" ON news FOR SELECT USING (true);
CREATE POLICY "Qualquer um pode ler likes" ON news_likes FOR SELECT USING (true);
CREATE POLICY "Logado pode curtir" ON news_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Dono pode descurtir" ON news_likes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Qualquer um pode ler comentários" ON news_comments FOR SELECT USING (true);
CREATE POLICY "Logado pode comentar" ON news_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Dono pode editar/apagar próprio comentário" ON news_comments FOR DELETE USING (auth.uid() = user_id);
