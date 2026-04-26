-- ============================================================
-- EngeHub — seed de dados pra demonstração de portfólio
-- ============================================================
--
-- COMO USAR:
-- 1. Garanta que você já tem uma conta criada no app (login via Google).
-- 2. Edite a linha v_user_email abaixo com o e-mail da sua conta.
-- 3. Cole o script inteiro no Supabase → SQL Editor → Run.
--
-- Resultado: 15 oportunidades + 5 serviços vinculados ao seu user_id.
-- Aparecem em /opportunities, /services e no Dashboard ao logar.
--
-- Pra rodar de novo (limpar e popular): rode primeiro o bloco "RESET" no fim.
-- ============================================================

-- ----------------------------------------------------------
-- 0. Garantir que as constraints de CHECK estão alinhadas com
--    os valores que o app (PublishOpportunityModal etc.) usa.
--
--    NOT VALID = a constraint vale apenas para INSERTs/UPDATEs
--    novos. Linhas pré-existentes que violem o CHECK não são
--    bloqueadas. Útil pra rodar em DBs com dados de teste
--    "sujos" sem precisar limpar primeiro.
-- ----------------------------------------------------------
ALTER TABLE opportunities DROP CONSTRAINT IF EXISTS opportunities_category_check;
ALTER TABLE opportunities ADD CONSTRAINT opportunities_category_check
  CHECK (category IN ('Projeto', 'Consultoria', 'Laudo', 'Emprego', 'Parceria', 'ART')) NOT VALID;

ALTER TABLE opportunities DROP CONSTRAINT IF EXISTS opportunities_modality_check;
ALTER TABLE opportunities ADD CONSTRAINT opportunities_modality_check
  CHECK (modality IN ('Presencial', 'Remoto', 'Híbrido')) NOT VALID;

ALTER TABLE services DROP CONSTRAINT IF EXISTS services_status_check;
ALTER TABLE services ADD CONSTRAINT services_status_check
  CHECK (status IN ('Rascunho', 'Publicado')) NOT VALID;

DO $$
DECLARE
  v_user_email TEXT := 'bdoliveira1993@gmail.com';   -- ⬅ EDITE AQUI se necessário
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_user_email LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário com e-mail "%" não encontrado em auth.users. Faça login no app primeiro ou edite o e-mail no script.', v_user_email;
  END IF;

  -- ----------------------------------------------------------
  -- OPORTUNIDADES (15 itens, datas espalhadas nos últimos 30 dias)
  -- ----------------------------------------------------------
  INSERT INTO opportunities (creator_id, title, description, category, modality, location, budget, is_negotiable, is_active, created_at) VALUES
    (v_user_id,
     'Laudo de estabilidade — galpão pré-moldado 25k m²',
     'Vistoria técnica e laudo de estabilidade para galpão industrial em Cajamar/SP. Avaliação de fundações, pilares e cobertura metálica. Emissão de ART.',
     'Laudo', 'Presencial', 'Cajamar — SP', 8500.00, FALSE, TRUE,
     NOW() - INTERVAL '2 days'),

    (v_user_id,
     'Projeto elétrico BT · retrofit industrial',
     'Substituição completa de quadros elétricos e redimensionamento de circuitos para planta industrial em Embu das Artes. Conformidade NBR 5410.',
     'Projeto', 'Híbrido', 'Embu das Artes — SP', 24800.00, FALSE, TRUE,
     NOW() - INTERVAL '4 days'),

    (v_user_id,
     'Consultoria NR-12 · linha de envase',
     'Análise de conformidade de máquinas e equipamentos da linha de envase com a NR-12. Plano de adequação e treinamento de equipe.',
     'Consultoria', 'Presencial', 'Sorocaba — SP', 6200.00, FALSE, TRUE,
     NOW() - INTERVAL '5 days'),

    (v_user_id,
     'ART de instalações · galpão logístico 6.000 m²',
     'Emissão de ART para instalações elétricas, hidráulicas e SPDA de novo galpão logístico na Rod. Castello Branco.',
     'ART', 'Remoto', 'Itu — SP', 3400.00, FALSE, TRUE,
     NOW() - INTERVAL '6 days'),

    (v_user_id,
     'Projeto hidrossanitário · hospital 80 leitos',
     'Projeto completo de hidráulica predial, esgoto, gás medicinal e prevenção a incêndio para hospital em construção.',
     'Projeto', 'Híbrido', 'Campinas — SP', 28500.00, FALSE, TRUE,
     NOW() - INTERVAL '7 days'),

    (v_user_id,
     'Engenheiro civil pleno — incorporadora Horizon',
     'Vaga CLT para acompanhamento técnico de obras verticais de alto padrão. 5+ anos de experiência. Pacote: R$ 14.000 + benefícios.',
     'Emprego', 'Presencial', 'São Paulo — SP', 14000.00, FALSE, TRUE,
     NOW() - INTERVAL '8 days'),

    (v_user_id,
     'Comissionamento subestação 13,8 kV',
     'Comissionamento e energização de subestação de distribuição. Testes de proteção, sinalização e SCADA.',
     'Projeto', 'Presencial', 'Bauru — SP', 32400.00, FALSE, TRUE,
     NOW() - INTERVAL '10 days'),

    (v_user_id,
     'Consultoria BIM · coordenação de projeto residencial',
     'Coordenação BIM (Revit) entre disciplinas arquitetura, estrutura e sistemas para empreendimento residencial de 28 andares.',
     'Consultoria', 'Remoto', 'Belo Horizonte — MG', 18000.00, FALSE, TRUE,
     NOW() - INTERVAL '11 days'),

    (v_user_id,
     'Memorial de cálculo · passarela metálica',
     'Dimensionamento e memorial de cálculo de passarela metálica de 32 m de vão livre sobre rodovia.',
     'Projeto', 'Remoto', 'Sumaré — SP', 7200.00, FALSE, TRUE,
     NOW() - INTERVAL '13 days'),

    (v_user_id,
     'Parceria comercial · fornecedor de aço estrutural',
     'Procuro engenheiro estrutural para parceria recorrente em projetos de galpão metálico no eixo SP/RJ. Comissão por projeto fechado.',
     'Parceria', 'Híbrido', 'São Paulo — SP', NULL, TRUE, TRUE,
     NOW() - INTERVAL '14 days'),

    (v_user_id,
     'Projeto de SPDA · centro logístico',
     'Sistema de proteção contra descargas atmosféricas para centro logístico de 18.000 m². Cálculo conforme NBR 5419.',
     'Projeto', 'Presencial', 'Guarujá — SP', 11800.00, FALSE, TRUE,
     NOW() - INTERVAL '16 days'),

    (v_user_id,
     'Análise de vibração · eixo rotativo 1800 rpm',
     'Diagnóstico de vibração em eixo rotativo de máquina de papel. Identificação de modos de falha e recomendações.',
     'Consultoria', 'Presencial', 'Mogi Guaçu — SP', 9500.00, FALSE, TRUE,
     NOW() - INTERVAL '18 days'),

    (v_user_id,
     'Engenheiro de produção PJ · startup industrial',
     'Posição PJ para startup de manufatura aditiva. Foco em otimização de processos e PCP. Modelo híbrido, 3 dias presencial.',
     'Emprego', 'Híbrido', 'São Paulo — SP', NULL, TRUE, TRUE,
     NOW() - INTERVAL '20 days'),

    (v_user_id,
     'Topografia com drone · loteamento 14 ha',
     'Levantamento topográfico aerofotogramétrico com drone para loteamento de 14 hectares. Entrega de nuvem de pontos e curvas.',
     'Projeto', 'Presencial', 'Atibaia — SP', 12300.00, FALSE, TRUE,
     NOW() - INTERVAL '23 days'),

    (v_user_id,
     'Estudo de viabilidade · usina solar 2 MWp',
     'Estudo técnico e financeiro de viabilidade para usina fotovoltaica de 2 MWp em terreno rural. Inclui análise de irradiação e CAPEX.',
     'Consultoria', 'Híbrido', 'Ribeirão Preto — SP', 22000.00, FALSE, TRUE,
     NOW() - INTERVAL '27 days');

  -- ----------------------------------------------------------
  -- SERVIÇOS (5 itens, todos publicados)
  -- ----------------------------------------------------------
  INSERT INTO services (provider_id, title, description, category, price, status, created_at) VALUES
    (v_user_id,
     'Cálculo de estrutura metálica',
     'Dimensionamento de estruturas metálicas para galpões e edifícios industriais. Memorial completo, plantas e ART. Prazo médio: 15 dias úteis.',
     'Projetos Estruturais', 6500.00, 'Publicado',
     NOW() - INTERVAL '5 days'),

    (v_user_id,
     'Laudo de estabilidade estrutural',
     'Perícia técnica e laudo de estabilidade para imóveis comerciais e industriais. Inspeção visual + ensaios não destrutivos quando necessário.',
     'Laudos e Perícias', 4800.00, 'Publicado',
     NOW() - INTERVAL '8 days'),

    (v_user_id,
     'Projeto hidrossanitário residencial multifamiliar',
     'Projeto completo de hidráulica predial, esgoto, águas pluviais e prevenção a incêndio para edifícios residenciais até 20 pavimentos.',
     'Projetos Estruturais', 8200.00, 'Publicado',
     NOW() - INTERVAL '12 days'),

    (v_user_id,
     'Consultoria em conformidade NR-18',
     'Auditoria e consultoria de segurança em canteiro de obras. Plano de adequação à NR-18, treinamento de CIPA e PCMAT.',
     'Consultoria', 3200.00, 'Publicado',
     NOW() - INTERVAL '15 days'),

    (v_user_id,
     'Memorial descritivo + ART de regularização',
     'Elaboração de memorial descritivo técnico e emissão de ART para regularização de imóveis junto à prefeitura.',
     'Laudos e Perícias', 1900.00, 'Publicado',
     NOW() - INTERVAL '20 days');

  RAISE NOTICE 'Seed concluído: 15 oportunidades + 5 serviços inseridos para %', v_user_email;
END $$;


-- ============================================================
-- RESET (rode pra apagar todos os dados de demo desse usuário)
-- ============================================================
-- DESCOMENTE o bloco abaixo se quiser limpar antes de re-popular:
--
-- DO $$
-- DECLARE
--   v_user_email TEXT := 'bruna.o@mse.com.br';   -- ⬅ MESMO E-MAIL DO BLOCO ACIMA
--   v_user_id UUID;
-- BEGIN
--   SELECT id INTO v_user_id FROM auth.users WHERE email = v_user_email LIMIT 1;
--   IF v_user_id IS NULL THEN
--     RAISE EXCEPTION 'Usuário não encontrado.';
--   END IF;
--   DELETE FROM opportunities WHERE creator_id = v_user_id;
--   DELETE FROM services WHERE provider_id = v_user_id;
--   RAISE NOTICE 'Reset concluído para %', v_user_email;
-- END $$;
