import React from 'react';
import { useCompanyOS } from '../../context/CompanyOSContext';
import { 
  Terminal, 
  Layers, 
  Radio, 
  Server, 
  AlertTriangle, 
  Activity, 
  ShieldCheck, 
  Bot, 
  Volume2, 
  VolumeX, 
  Flame,
  Zap,
  CheckCircle2,
  Play
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface OfficeHUDProps {
  onOpenCommandCenter: () => void;
}

export const OfficeHUD: React.FC<OfficeHUDProps> = ({ onOpenCommandCenter }) => {
  const { 
    macroStats, 
    incidents, 
    openTerminalForTarget, 
    setActiveOverlayModal,
    activeOverlayModal,
    soundEnabled,
    setSoundEnabled,
    currentRole,
    setCurrentRole,
    resolveIncident
  } = useCompanyOS();

  const activeCritCount = incidents.filter(i => i.status !== 'resolved' && i.severity === 'critical').length;
  const activeWarnCount = macroStats.activeWarnings || 2;
  const isEmergency = activeCritCount > 0;

  return (
    <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-3.5 flex flex-col gap-2">
      {/* Top Main Functional Single-Row Bar */}
      <div className="flex items-center justify-between pointer-events-auto bg-[#070c1a]/95 backdrop-blur-md border border-cyan-500/30 rounded-2xl px-4 py-2.5 shadow-2xl">
        
        {/* Left: Brand & Live Essential Metrics */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-cyan-950/90 border border-cyan-400/50 text-cyan-400">
              <Server className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black font-mono tracking-wider text-white">
                COMPANY<span className="text-cyan-400">OS</span>
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                NOC
              </span>
            </div>
          </div>

          {/* Essential Single-Line Metric Pills */}
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono">
            {/* Servers */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/60 border border-white/10 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span><b>{macroStats.totalServers}</b> SERVIDORES</span>
            </div>

            {/* Services / Pods */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/60 border border-white/10 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span><b>{macroStats.totalServices}</b> SERVIÇOS</span>
            </div>

            {/* Warnings */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span><b>{activeWarnCount}</b> ALERTAS</span>
            </div>

            {/* Critical Incident */}
            <button
              onClick={() => setActiveOverlayModal('incidents')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                isEmergency 
                  ? 'bg-rose-950 text-rose-200 border-rose-500 animate-pulse shadow-md shadow-rose-950/50' 
                  : 'bg-black/60 border-white/10 text-slate-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isEmergency ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
              <b>{activeCritCount}</b> {activeCritCount === 1 ? 'INCIDENTE' : 'INCIDENTES'}
            </button>

            {/* AI Agents */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-950/50 border border-purple-500/40 text-purple-300">
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <span><b>{macroStats.activeAiAgents}</b> AGENTES ATIVOS</span>
            </div>
          </div>
        </div>

        {/* Center: Quick Layer Overlays (Topologia, K8s, Racks, War Room, Logs) */}
        <div className="hidden xl:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveOverlayModal('topology')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeOverlayModal === 'topology' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Radio className="w-3 h-3 text-emerald-400" /> Rede
          </button>

          <button
            onClick={() => setActiveOverlayModal('k8s_explorer')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeOverlayModal === 'k8s_explorer' ? 'bg-violet-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3 h-3 text-violet-400" /> Kubernetes
          </button>

          <button
            onClick={() => setActiveOverlayModal('datacenter_racks')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeOverlayModal === 'datacenter_racks' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Server className="w-3 h-3 text-blue-400" /> Racks 42U
          </button>

          <button
            onClick={() => setActiveOverlayModal('incidents')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeOverlayModal === 'incidents' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Flame className="w-3 h-3 text-rose-400" /> War Room
          </button>

          <button
            onClick={() => setActiveOverlayModal('logs')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeOverlayModal === 'logs' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-3 h-3 text-amber-400" /> Logs
          </button>
        </div>

        {/* Right: Quick Command Center, Terminal, Auto-Heal & Audio */}
        <div className="flex items-center gap-2">
          {/* Auto-Heal Button if Incident is Active */}
          {isEmergency && (
            <button
              onClick={() => {
                resolveIncident('inc-2026-001');
                if (soundEnabled) soundManager.playTaskComplete();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs shadow-lg shadow-emerald-950/60 border border-emerald-400/50 cursor-pointer transition-all hover:scale-102"
              title="Resolver incidente via Auto-Heal com IA"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Auto-Remediar ⚡</span>
            </button>
          )}

          {/* Natural Language Command Bar (Ctrl+K) */}
          <button
            onClick={onOpenCommandCenter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold text-xs shadow-md shadow-cyan-950/60 border border-cyan-400/40 cursor-pointer transition-all hover:scale-102"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>COMANDOS (Ctrl+K)</span>
          </button>

          {/* Quick CLI Terminal Drawer */}
          <button
            onClick={() => openTerminalForTarget({ id: 'srv-prod-01', name: 'server-prod-01', type: 'server' })}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 hover:border-cyan-400/40 cursor-pointer transition-colors"
            title="Abrir Terminal CLI SSH (`)"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 cursor-pointer transition-colors"
            title={soundEnabled ? 'Silenciar Áudio' : 'Ativar Áudio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>

      </div>
    </div>
  );
};
