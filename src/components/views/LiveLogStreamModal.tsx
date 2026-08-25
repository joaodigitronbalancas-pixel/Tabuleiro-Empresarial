import React, { useState } from 'react';
import { useCompanyOS } from '../../context/CompanyOSContext';
import { 
  X, 
  Terminal, 
  Search, 
  Play, 
  Pause, 
  Trash2, 
  Filter, 
  Download,
  Activity,
  Layers
} from 'lucide-react';
import { ITLog } from '../../types';

export const LiveLogStreamModal: React.FC = () => {
  const { activeOverlayModal, setActiveOverlayModal, logs } = useCompanyOS();
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  if (activeOverlayModal !== 'logs') return null;

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchQuery || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'ALL' || log.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[85vh] bg-[#070c18] border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200 select-none">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0c1427] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-300">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-mono text-white">
                  LIVE TELEMETRY LOG STREAM (CENTRAL DE LOGS)
                </h2>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  TAILING LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Stream unificado de syslog, kubelet, nginx, postgresql, waf e agentes de IA.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border cursor-pointer transition-all ${
                isPaused
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                  : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              }`}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              {isPaused ? 'Continuar' : 'Pausar'}
            </button>

            <button
              onClick={() => setActiveOverlayModal('none')}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="px-6 py-3 bg-[#090e1d] border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs flex-1">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por mensagem, serviço ou host..."
                className="bg-transparent text-cyan-200 outline-none placeholder:text-slate-600 font-mono text-xs w-full"
              />
            </div>
          </div>

          {/* Severity Buttons */}
          <div className="flex items-center gap-1.5">
            {['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG', 'AUDIT'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Output Console */}
        <div className="flex-1 p-4 bg-[#050811] overflow-y-auto font-mono text-xs select-text space-y-1.5 scrollbar-thin scrollbar-thumb-cyan-900">
          {filteredLogs.map(log => {
            const isErr = log.level === 'ERROR';
            const isWarn = log.level === 'WARN';
            const isAudit = log.level === 'AUDIT';

            return (
              <div 
                key={log.id}
                className={`flex items-start gap-3 p-2 rounded-lg border transition-colors ${
                  isErr
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                    : isWarn
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                    : isAudit
                    ? 'bg-purple-950/20 border-purple-500/30 text-purple-300'
                    : 'bg-black/30 border-white/5 text-slate-300'
                }`}
              >
                <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                  isErr ? 'bg-rose-900 text-rose-200' : isWarn ? 'bg-amber-900 text-amber-200' : 'bg-slate-800 text-slate-300'
                }`}>
                  {log.level}
                </span>
                <span className="text-cyan-400 font-bold shrink-0">[{log.source}]</span>
                <span className="text-slate-400 shrink-0">({log.service})</span>
                <span className="flex-1 break-all">{log.message}</span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
