-- Migration V2: Fix Column Types and Add Missing Tables

-- 1. Alterar coluna budget para DECIMAL na tabela opportunities
ALTER TABLE opportunities ADD COLUMN budget_decimal DECIMAL(12, 2);
UPDATE opportunities SET budget_decimal = NULLIF(REGEXP_REPLACE(budget, '[^0-9.]', '', 'g'), '')::DECIMAL;
ALTER TABLE opportunities DROP COLUMN budget;
ALTER TABLE opportunities RENAME COLUMN budget_decimal TO budget;

-- 2. Garantir tabela de serviços (mencionada no report mas não no schema original)
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    price DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'Rascunho' CHECK (status IN ('Rascunho', 'Publicado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS para services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Políticas para services
CREATE POLICY "Qualquer um pode ver serviços publicados" ON services FOR SELECT USING (status = 'Publicado');
CREATE POLICY "Dono pode ver seus serviços (inclusive rascunhos)" ON services FOR SELECT USING (auth.uid() = provider_id);
CREATE POLICY "Dono pode criar serviços" ON services FOR INSERT WITH CHECK (auth.uid() = provider_id);
CREATE POLICY "Dono pode editar seus serviços" ON services FOR UPDATE USING (auth.uid() = provider_id);
CREATE POLICY "Dono pode deletar seus serviços" ON services FOR DELETE USING (auth.uid() = provider_id);
