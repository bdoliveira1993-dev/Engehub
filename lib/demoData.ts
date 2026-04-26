/*
 * EngeHub — dados curados pra o "Modo Visitante" (demo).
 * Servem ao recrutador que clica em "Entrar como visitante" — não
 * tocam Supabase, vivem só na memória da sessão atual.
 */

import { EngineeringType, type User } from '../types';

const daysAgo = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

// ---------- usuário virtual ----------

export const DEMO_USER: User = {
  name: 'Ana Martins',
  email: 'ana.martins@demo.engehub',
  engineeringType: EngineeringType.CIVIL,
};

// ---------- profile (linha equivalente ao que viria de profiles no DB) ----------

export interface DemoProfile {
  id: string;
  full_name: string;
  occupation: string;
  bio: string;
  crea_number: string;
  linkedin: string;
  phone: string;
  location: string;
  avatar_url?: string;
}

export const DEMO_PROFILE: DemoProfile = {
  id: 'demo-user',
  full_name: 'Ana Martins',
  occupation: 'Engenheira Civil Sênior · Especialista em Estruturas',
  bio: 'Engenheira civil com 12 anos de experiência em projetos estruturais de edifícios verticais e galpões industriais. Foco em concreto armado, estruturas metálicas e mistas. Membro do conselho técnico da AsBEA-SP.',
  crea_number: 'SP-12.345-D',
  linkedin: 'linkedin.com/in/ana-martins-eng',
  phone: '+55 11 91234-5678',
  location: 'São Paulo — SP',
};

// ---------- opportunities (formato espelha rows do Supabase) ----------

export interface DemoOpportunity {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  category: 'Projeto' | 'Consultoria' | 'Laudo' | 'Emprego' | 'Parceria' | 'ART';
  modality: 'Presencial' | 'Remoto' | 'Híbrido';
  location: string | null;
  budget: number | null;
  is_negotiable: boolean;
  is_active: boolean;
  created_at: string;
  profiles: { full_name: string } | null;
}

// engenheiros fictícios que postaram as oportunidades
const ENG = {
  carlos: { id: 'eng-carlos', full_name: 'Carlos Pereira' },
  luiza: { id: 'eng-luiza', full_name: 'Luiza Mendes' },
  marcos: { id: 'eng-marcos', full_name: 'Marcos Santos' },
  patricia: { id: 'eng-patricia', full_name: 'Patrícia Lima' },
  roberto: { id: 'eng-roberto', full_name: 'Roberto Almeida' },
};

export const DEMO_OPPORTUNITIES: DemoOpportunity[] = [
  {
    id: 'op-001',
    creator_id: ENG.carlos.id,
    title: 'Laudo de estabilidade — galpão pré-moldado 25k m²',
    description: 'Vistoria técnica e laudo de estabilidade para galpão industrial em Cajamar/SP. Avaliação de fundações, pilares e cobertura metálica. Emissão de ART.',
    category: 'Laudo',
    modality: 'Presencial',
    location: 'Cajamar — SP',
    budget: 8500,
    is_negotiable: false,
    is_active: true,
    created_at: daysAgo(2),
    profiles: { full_name: ENG.carlos.full_name },
  },
  {
    id: 'op-002',
    creator_id: ENG.luiza.id,
    title: 'Projeto elétrico BT · retrofit industrial',
    description: 'Substituição completa de quadros elétricos e redimensionamento de circuitos para planta industrial em Embu das Artes. Conformidade NBR 5410.',
    category: 'Projeto',
    modality: 'Híbrido',
    location: 'Embu das Artes — SP',
    budget: 24800,
    is_negotiable: false,
    is_active: true,
    created_at: daysAgo(4),
    profiles: { full_name: ENG.luiza.full_name },
  },
  {
    id: 'op-003',
    creator_id: ENG.marcos.id,
    title: 'Consultoria NR-12 · linha de envase',
    description: 'Análise de conformidade de máquinas e equipamentos da linha de envase com a NR-12. Plano de adequação e treinamento de equipe.',
    category: 'Consultoria',
    modality: 'Presencial',
    location: 'Sorocaba — SP',
    budget: 6200,
    is_negotiable: false,
    is_active: true,
    created_at: daysAgo(5),
    profiles: { full_name: ENG.marcos.full_name },
  },
  {
    id: 'op-004',
    creator_id: ENG.patricia.id,
    title: "ART de instalações · galpão logístico 6.000 m²",
    description: 'Emissão de ART para instalações elétricas, hidráulicas e SPDA de novo galpão logístico na Rod. Castello Branco.',
    category: 'ART',
    modality: 'Remoto',
    location: 'Itu — SP',
    budget: 3400,
    is_negotiable: false,
    is_active: true,
    created_at: daysAgo(6),
    profiles: { full_name: ENG.patricia.full_name },
  },
  {
    id: 'op-005',
    creator_id: ENG.carlos.id,
    title: 'Projeto hidrossanitário · hospital 80 leitos',
    description: 'Projeto completo de hidráulica predial, esgoto, gás medicinal e prevenção a incêndio para hospital em construção.',
    category: 'Projeto',
    modality: 'Híbrido',
    location: 'Campinas — SP',
    budget: 28500,
    is_negotiable: false,
    is_active: true,
    created_at: daysAgo(7),
    profiles: { full_name: ENG.carlos.full_name },
  },
  {
    id: 'op-006',
    creator_id: ENG.roberto.id,
    title: 'Engenheiro civil pleno — incorporadora Horizon',
    description: 'Vaga CLT para acompanhamento técnico de obras verticais de alto padrão. 5+ anos de experiência. Pacote: R$ 14.000 + benefícios.',
    category: 'Emprego',
    modality: 'Presencial',
    location: 'São Paulo — SP',
    budget: 14000,
    is_negotiable: false,
    is_active: true,
    created_at: daysAgo(8),
    profiles: { full_name: ENG.roberto.full_name },
  },
  {
    id: 'op-007',
    creator_id: ENG.luiza.id,
    title: 'Comissionamento subestação 13,8 kV',
    description: 'Comissionamento e energização de subestação de distribuição. Testes de proteção, sinalização e SCADA.',
    category: 'Projeto',
    modality: 'Presencial',
    location: 'Bauru — SP',
    budget: 32400,
    is_negotiable: false,
    is_active: true,
    created_at: daysAgo(10),
    profiles: { full_name: ENG.luiza.full_name },
  },
  {
    id: 'op-008',
    creator_id: ENG.patricia.id,
    title: 'Consultoria BIM · coordenação de projeto residencial',
    description: 'Coordenação BIM (Revit) entre disciplinas arquitetura, estrutura e sistemas para empreendimento residencial de 28 andares.',
    category: 'Consultoria',
    modality: 'Remoto',
    location: 'Belo Horizonte — MG',
    budget: 18000,
    is_negotiable: false,
    is_active: true,
    created_at: daysAgo(11),
    profiles: { full_name: ENG.patricia.full_name },
  },
  {
    id: 'op-009',
    creator_id: ENG.carlos.id,
    title: 'Memorial de cálculo · passarela metálica',
    description: 'Dimensionamento e memorial de cálculo de passarela metálica de 32 m de vão livre sobre rodovia.',
    category: 'Projeto',
    modality: 'Remoto',
    location: 'Sumaré — SP',
    budget: 7200,
    is_negotiable: false,
    is_active: true,
    created_at: daysAgo(13),
    profiles: { full_name: ENG.carlos.full_name },
  },
  {
    id: 'op-010',
    creator_id: ENG.marcos.id,
    title: 'Parceria comercial · fornecedor de aço estrutural',
    description: 'Procuro engenheiro estrutural para parceria recorrente em projetos de galpão metálico no eixo SP/RJ. Comissão por projeto fechado.',
    category: 'Parceria',
    modality: 'Híbrido',
    location: 'São Paulo — SP',
    budget: null,
    is_negotiable: true,
    is_active: true,
    created_at: daysAgo(14),
    profiles: { full_name: ENG.marcos.full_name },
  },
  {
    id: 'op-011',
    creator_id: ENG.luiza.id,
    title: 'Projeto de SPDA · centro logístico',
    description: 'Sistema de proteção contra descargas atmosféricas para centro logístico de 18.000 m². Cálculo conforme NBR 5419.',
    category: 'Projeto',
    modality: 'Presencial',
    location: 'Guarujá — SP',
    budget: 11800,
    is_negotiable: false,
    is_active: true,
    created_at: daysAgo(16),
    profiles: { full_name: ENG.luiza.full_name },
  },
  {
    id: 'op-012',
    creator_id: ENG.roberto.id,
    title: 'Análise de vibração · eixo rotativo 1800 rpm',
    description: 'Diagnóstico de vibração em eixo rotativo de máquina de papel. Identificação de modos de falha e recomendações.',
    category: 'Consultoria',
    modality: 'Presencial',
    location: 'Mogi Guaçu — SP',
    budget: 9500,
    is_negotiable: false,
    is_active: true,
    created_at: daysAgo(18),
    profiles: { full_name: ENG.roberto.full_name },
  },
  {
    id: 'op-013',
    creator_id: ENG.patricia.id,
    title: 'Engenheiro de produção PJ · startup industrial',
    description: 'Posição PJ para startup de manufatura aditiva. Foco em otimização de processos e PCP. Modelo híbrido, 3 dias presencial.',
    category: 'Emprego',
    modality: 'Híbrido',
    location: 'São Paulo — SP',
    budget: null,
    is_negotiable: true,
    is_active: true,
    created_at: daysAgo(20),
    profiles: { full_name: ENG.patricia.full_name },
  },
  {
    id: 'op-014',
    creator_id: ENG.marcos.id,
    title: 'Topografia com drone · loteamento 14 ha',
    description: 'Levantamento topográfico aerofotogramétrico com drone para loteamento de 14 hectares. Entrega de nuvem de pontos e curvas.',
    category: 'Projeto',
    modality: 'Presencial',
    location: 'Atibaia — SP',
    budget: 12300,
    is_negotiable: false,
    is_active: true,
    created_at: daysAgo(23),
    profiles: { full_name: ENG.marcos.full_name },
  },
  {
    id: 'op-015',
    creator_id: ENG.carlos.id,
    title: 'Estudo de viabilidade · usina solar 2 MWp',
    description: 'Estudo técnico e financeiro de viabilidade para usina fotovoltaica de 2 MWp em terreno rural. Inclui análise de irradiação e CAPEX.',
    category: 'Consultoria',
    modality: 'Híbrido',
    location: 'Ribeirão Preto — SP',
    budget: 22000,
    is_negotiable: false,
    is_active: true,
    created_at: daysAgo(27),
    profiles: { full_name: ENG.carlos.full_name },
  },
];

// ---------- services (próprios da Ana) ----------

export interface DemoService {
  id: string;
  provider_id: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
  status: 'Rascunho' | 'Publicado';
  created_at: string;
}

export const DEMO_SERVICES: DemoService[] = [
  {
    id: 'sv-001',
    provider_id: DEMO_PROFILE.id,
    title: 'Cálculo de estrutura metálica',
    description: 'Dimensionamento de estruturas metálicas para galpões e edifícios industriais. Memorial completo, plantas e ART. Prazo médio: 15 dias úteis.',
    category: 'Projetos Estruturais',
    price: 6500,
    status: 'Publicado',
    created_at: daysAgo(5),
  },
  {
    id: 'sv-002',
    provider_id: DEMO_PROFILE.id,
    title: 'Laudo de estabilidade estrutural',
    description: 'Perícia técnica e laudo de estabilidade para imóveis comerciais e industriais. Inspeção visual + ensaios não destrutivos quando necessário.',
    category: 'Laudos e Perícias',
    price: 4800,
    status: 'Publicado',
    created_at: daysAgo(8),
  },
  {
    id: 'sv-003',
    provider_id: DEMO_PROFILE.id,
    title: 'Projeto hidrossanitário residencial multifamiliar',
    description: 'Projeto completo de hidráulica predial, esgoto, águas pluviais e prevenção a incêndio para edifícios residenciais até 20 pavimentos.',
    category: 'Projetos Estruturais',
    price: 8200,
    status: 'Publicado',
    created_at: daysAgo(12),
  },
  {
    id: 'sv-004',
    provider_id: DEMO_PROFILE.id,
    title: 'Consultoria em conformidade NR-18',
    description: 'Auditoria e consultoria de segurança em canteiro de obras. Plano de adequação à NR-18, treinamento de CIPA e PCMAT.',
    category: 'Consultoria',
    price: 3200,
    status: 'Publicado',
    created_at: daysAgo(15),
  },
  {
    id: 'sv-005',
    provider_id: DEMO_PROFILE.id,
    title: 'Memorial descritivo + ART de regularização',
    description: 'Elaboração de memorial descritivo técnico e emissão de ART para regularização de imóveis junto à prefeitura.',
    category: 'Laudos e Perícias',
    price: 1900,
    status: 'Publicado',
    created_at: daysAgo(20),
  },
];
