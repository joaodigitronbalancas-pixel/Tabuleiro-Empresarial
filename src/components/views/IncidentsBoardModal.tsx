import React from 'react';
import { useCompanyOS } from '../../context/CompanyOSContext';
import { 
  X, 
  AlertTriangle, 
  Bot, 
  CheckCircle2, 
  Terminal, 
  RefreshCw, 
  ShieldAlert, 
  Clock, 
  ArrowRight,
  Flame,
  FileCode2
} from 'lucide-react';
import { ITIncident } from '../../types';

export const IncidentsBoardModal: React.FC = () => {
  const { 
    activeOverlayModal, 
    setActiveOverlayModal, 
    incidents, 
    resolveIncident, 
    openTerminalForTarget 
  } = useCompanyOS();

  if (activeOverlayModal !== 'incidents') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[85vh] bg-[#070c18] border border-rose-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200 select-none">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0c1427] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-950/80 border border-rose-400/40 text-rose-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-mono text-white">
                  CENTRAL DE INCIDENTES CRÍTICOS & INVESTIGAÇÃO AUTÔNOMA
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-950 text-rose-300 border border-rose-500/30">
                  {incidents.filter(i => i.status !== 'resolved').length} ATIVOS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Monitorar ➔ Identificar ➔ Investigar ➔ Comandar ➔ Resolver
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveOverlayModal('none')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Incident List Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#050811] scrollbar-thin scrollbar-thumb-rose-900">
          {incidents.map(inc => {
            const isResolved = inc.status === 'resolved';

            return (
              <div 
                key={inc.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isResolved
                    ? 'bg-black/40 border-emerald-500/30 opacity-80'
                    : 'bg-rose-950/20 border-rose-500/50 shadow-xl shadow-rose-950/30'
                }`}
              >
                {/* Top Title & Severity */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase ${
                        inc.severity === 'critical' ? 'bg-rose-950 text-rose-300 border border-rose-500/40 animate-pulse' : 'bg-amber-950 text-amber-300'
                      }`}>
                        {inc.severity}
                      </span>
                      <h3 className="text-sm font-bold font-mono text-white">
                        {inc.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs font-mono text-slate-400">
                      <span>Detectado às: <b className="text-slate-200">{inc.detectedAt}</b></span>
                      <span>Impacto: <b className="text-rose-300">{inc.impact.toUpperCase()}</b></span>
                      <span>Serviço Afetado: <b className="text-cyan-300">{inc.service}</b> ({inc.nodeName})</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!isResolved ? (
                      <button
                        onClick={() => resolveIncident(inc.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer transition-all hover:scale-102"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Auto-Remediar & Resolver
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> RESOLVIDO
                      </span>
                    )}

                    <button
                      onClick={() => openTerminalForTarget({ id: inc.nodeId, name: inc.nodeName, type: 'incident' })}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <Terminal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Root Cause & Diagnostic Chain */}
                <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                  {inc.rootCause && (
                    <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-xs font-mono">
                      <span className="text-slate-400 block font-bold mb-1">🔍 DIAGNÓSTICO & CAUSA-RAIZ:</span>
                      <p className="text-rose-200">{inc.rootCause}</p>
                    </div>
                  )}

                  {/* Investigation Steps Pipeline */}
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-400 block mb-2">
                      CADEIA DE INVESTIGAÇÃO AUTÔNOMA ({inc.assignedAgentName}):
                    </span>
                    <div className="space-y-1.5">
                      {inc.investigationSteps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-black/40 border border-white/5 text-xs font-mono">
                          <span className={step.status === 'completed' ? 'text-emerald-400' : 'text-amber-400 animate-spin'}>
                            {step.status === 'completed' ? '✓' : '⟳'}
                          </span>
                          <span className="text-slate-300 flex-1">{step.step}</span>
                          {step.result && <span className="text-cyan-300 font-bold">{step.result}</span>}
                          <span className="text-[10px] text-slate-500">{step.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {inc.runbookRecommended && (
                    <div className="flex items-center gap-2 text-xs font-mono text-purple-300 pt-1">
                      <FileCode2 className="w-4 h-4 text-purple-400" />
                      <span>Runbook Recomendado: <b>{inc.runbookRecommended}</b></span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
