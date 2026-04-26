
# Estrutura de Dados e Compliance LGPD

(Conteúdo anterior mantido...)

## 8. Marketplace de Educação e Treinamentos

A plataforma atua como um hub de afiliados para instituições externas.

### Tabela de Cursos (`courses_announcements`)
Armazena os metadados dos cursos anunciados.

```sql
CREATE TABLE courses_announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    institution_id UUID NOT NULL, -- FK para tabela de instituições parceiras
    category VARCHAR(50),
    description TEXT,
    duration_hours INTEGER,
    
    -- Preços e Links
    original_price DECIMAL(10, 2),
    hub_member_price DECIMAL(10, 2),
    affiliate_url TEXT NOT NULL, -- Link de redirecionamento com tracking
    
    image_url TEXT,
    rating_average DECIMAL(2, 1) DEFAULT 0.0,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 9. Transparência de Dados em Redirecionamento
Conforme exigido pela LGPD, o EngenhariaHub registra o evento de redirecionamento (Outbound Link Tracking) para fins de suporte e auditoria de benefícios, informando explicitamente ao usuário que ele está saindo do ambiente controlado pela nossa política de privacidade.
