
import React, { useState } from 'react';
import { EngineeringType } from '../types';
import { 
  HardHat, 
  Zap, 
  Settings, 
  FlaskConical, 
  ChevronRight, 
  CheckCircle2,
  ShieldCheck,
  Search,
  Loader2,
  MoreHorizontal
} from 'lucide-react';

interface EngineeringOnboardingModalProps {
  isOpen: boolean;
  onComplete: (data: { type: EngineeringType; crea?: string }) => void;
}

const EngineeringOnboardingModal: React.FC<EngineeringOnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [selectedType, setSelectedType] = useState<EngineeringType | null>(null);
  const [crea, setCrea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtherSelector, setShowOtherSelector] = useState(false);

  if (!isOpen) return null;

  const mainOptions = [
    { type: EngineeringType.CIVIL, icon: HardHat, color: 'text-blue-600', bg: 'bg-blue-50', border: 'hover:border-blue-200' },
    { type: EngineeringType.ELECTRICAL, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50', border: 'hover:border-amber-200' },
    { type: EngineeringType.MECHANICAL, icon: Settings, color: 'text-slate-600', bg: 'bg-slate-50', border: 'hover:border-slate-300' },
    { type: EngineeringType.CHEMICAL, icon: FlaskConical, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'hover:border-emerald-200' },
  ];

  const otherOptions = [
    EngineeringType.PRODUCTION,
    EngineeringType.COMPUTER,
    EngineeringType.ENVIRONMENTAL,
  ];

  const handleFinish = async () => {
    if (!selectedType) return;
    
    setIsSubmitting(true);
    
    // Simulação de delay para configuração de perfil no EngeHub DB
    setTimeout(() => {
      onComplete({ type: selectedType, crea: crea || undefined });
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white md:bg-slate-900/60 md:backdrop-blur-xl animate-in fade-in duration-500">
      <div className="relative w-full h-full md:h-auto md:max-w-3xl bg-white md:rounded-[48px] shadow-2xl p-8 md:p-16 flex flex-col items-center overflow-y-auto custom-scrollbar">
        
        <div className="max-w-md w-full text-center space-y-4 mb-12">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-2xl shadow-blue-200 rotate-3">
            <HardHat size={40} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight pt-4">
            Bem-vindo ao EngeHub!
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Sincronize sua especialidade para liberar o feed técnico.
          </p>
        </div>

        {/* Grid de Seleção Principal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
          {mainOptions.map((opt) => (
            <button
              key={opt.type}
              onClick={() => {
                setSelectedType(opt.type);
                setShowOtherSelector(false);
              }}
              className={`relative flex items-center gap-4 p-6 rounded-3xl border-2 transition-all group text-left ${
                selectedType === opt.type 
                ? 'border-blue-600 bg-blue-50/30 ring-4 ring-blue-50 shadow-lg shadow-blue-100' 
                : 'border-slate-50 bg-white hover:bg-slate-50/50 ' + opt.border
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl ${opt.bg} ${opt.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <opt.icon size={28} />
              </div>
              <div className="flex-1">
                <p className="font-black text-slate-800 text-lg">Eng. {opt.type}</p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Personalizar Feed</p>
              </div>
              {selectedType === opt.type && (
                <div className="absolute top-4 right-4 text-blue-600">
                  <CheckCircle2 size={24} fill="white" />
                </div>
              )}
            </button>
          ))}

          {/* Opção "Outras" */}
          <div className="sm:col-span-2">
            {!showOtherSelector ? (
              <button
                onClick={() => setShowOtherSelector(true)}
                className={`w-full flex items-center justify-center gap-3 p-5 rounded-3xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-all font-black uppercase text-xs tracking-widest ${
                  showOtherSelector || otherOptions.includes(selectedType!) ? 'hidden' : ''
                }`}
              >
                <MoreHorizontal size={20} /> Todas as Engenharias
              </button>
            ) : (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Selecione sua categoria técnica</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {otherOptions.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-tight border-2 transition-all ${
                        selectedType === type ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' : 'border-slate-100 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Campos Adicionais */}
        <div className={`w-full max-w-2xl space-y-6 transition-all duration-500 ${selectedType ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <div className="relative">
            <div className="flex items-center gap-2 mb-2 px-1">
              <ShieldCheck size={16} className="text-blue-500" />
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Número do CREA / Registro (Opcional)</label>
            </div>
            <input 
              type="text" 
              placeholder="Ex: 506.XXX.XXX-X"
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
              value={crea}
              onChange={(e) => setCrea(e.target.value)}
            />
            <p className="mt-2 text-[10px] text-slate-400 px-1 font-bold italic opacity-70">
              * O EngeHub verifica credenciais para aumentar sua relevância no marketplace.
            </p>
          </div>

          <button
            onClick={handleFinish}
            disabled={!selectedType || isSubmitting}
            className="w-full py-5 bg-blue-600 text-white font-black uppercase text-sm tracking-widest rounded-[28px] shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? (
              <><Loader2 className="animate-spin" /> Sincronizando Perfil...</>
            ) : (
              <><CheckCircle2 size={20} /> Ativar Conta EngeHub</>
            )}
          </button>
        </div>

        <p className="mt-8 text-slate-300 text-[10px] text-center font-black uppercase tracking-widest max-w-xs opacity-50">
          EngeHub Ecosystem © 2026 - LGPD Compliant
        </p>
      </div>
    </div>
  );
};

export default EngineeringOnboardingModal;
