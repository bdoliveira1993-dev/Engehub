/*
 * Store em memória pro Modo Visitante. Mutações vivem só na sessão atual
 * (refresh ou logout = reset). Não toca Supabase.
 */

import {
  DEMO_OPPORTUNITIES,
  DEMO_SERVICES,
  DEMO_PROFILE,
  type DemoOpportunity,
  type DemoProfile,
  type DemoService,
} from './demoData';

const SESSION_KEY = 'engehub_demo';

// ---------- helpers de sessão ----------

export function isDemoSession(): boolean {
  if (typeof window === 'undefined') return false;
  return window.sessionStorage.getItem(SESSION_KEY) === '1';
}

export function enterDemoMode(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(SESSION_KEY, '1');
  // reload completo pra App re-mountar e pegar a flag no boot
  window.location.href = '/dashboard';
}

export function exitDemoMode(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(SESSION_KEY);
  resetDemoStore();
}

// ---------- store mutável ----------

let opportunities: DemoOpportunity[] = [...DEMO_OPPORTUNITIES];
let services: DemoService[] = [...DEMO_SERVICES];
let profile: DemoProfile = { ...DEMO_PROFILE };

export function resetDemoStore(): void {
  opportunities = [...DEMO_OPPORTUNITIES];
  services = [...DEMO_SERVICES];
  profile = { ...DEMO_PROFILE };
}

// ---------- opportunities ----------

export function getDemoOpportunities(): DemoOpportunity[] {
  return [...opportunities];
}

export function getDemoOpportunitiesRecent(limit: number): DemoOpportunity[] {
  return [...opportunities].slice(0, limit);
}

export function addDemoOpportunity(input: {
  title: string;
  description: string;
  category: DemoOpportunity['category'];
  modality: DemoOpportunity['modality'];
  budget: number | null;
  is_negotiable: boolean;
  location?: string | null;
}): DemoOpportunity {
  const row: DemoOpportunity = {
    id: `op-${Date.now()}`,
    creator_id: profile.id,
    title: input.title,
    description: input.description,
    category: input.category,
    modality: input.modality,
    location: input.location ?? 'Remoto',
    budget: input.budget,
    is_negotiable: input.is_negotiable,
    is_active: true,
    created_at: new Date().toISOString(),
    profiles: { full_name: profile.full_name },
  };
  opportunities = [row, ...opportunities];
  return row;
}

// ---------- services ----------

export function getDemoServices(): DemoService[] {
  return [...services];
}

export function addDemoService(input: {
  title: string;
  description: string;
  category: string;
  price: number | null;
}): DemoService {
  const row: DemoService = {
    id: `sv-${Date.now()}`,
    provider_id: profile.id,
    title: input.title,
    description: input.description,
    category: input.category,
    price: input.price,
    status: 'Publicado',
    created_at: new Date().toISOString(),
  };
  services = [row, ...services];
  return row;
}

// ---------- profile ----------

export function getDemoProfile(): DemoProfile {
  return { ...profile };
}

export function updateDemoProfile(patch: Partial<DemoProfile>): DemoProfile {
  profile = { ...profile, ...patch };
  return { ...profile };
}
