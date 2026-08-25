import React from 'react';
import { useCompanyOS } from '../../context/CompanyOSContext';
import { 
  X, 
  ShieldCheck, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User,
  Server
} from 'lucide-react';

export const AuditTrailModal: React.FC = () => {
  const { activeOverlayModal, setActiveOverlayModal, auditLogs } = useCompanyOS();

  if (activeOverlayModal !== 'audit') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[85vh] bg-[#070c18] border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200 select-none">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0c1427] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-mono text-white">
                  TRILHA DE AUDITORIA & HISTÓRICO DE COMANDOS DE TI
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {auditLogs.length} COMANDOS REGISTRADOS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Rastreabilidade de quem executou, comando disparado, nó alvo, resultado e tempo de resposta.
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

        {/* Audit Table Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#050811] scrollbar-thin scrollbar-thumb-cyan-900">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-[11px] uppercase">
                <th className="pb-3">Horário</th>
                <th className="pb-3">Operador / Papel</th>
                <th className="pb-3">Comando Executado</th>
                <th className="pb-3">Recurso Alvo</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Latência</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {auditLogs.map(audit => (
                <tr key={audit.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-slate-500">{audit.timestamp}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-white font-bold">{audit.user}</span>
                      <span className="text-[10px] text-slate-500">({audit.userRole})</span>
                    </div>
                  </td>
                  <td className="py-3 font-bold text-cyan-300">
                    <code className="px-2 py-0.5 rounded bg-black/50 border border-white/10">{audit.command}</code>
                  </td>
                  <td className="py-3 text-slate-300">
                    <div className="flex items-center gap-1">
                      <Server className="w-3.5 h-3.5 text-slate-500" />
                      <span>{audit.targetName}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    {audit.result === 'success' ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Sucesso (0)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-400 font-bold">
                        <XCircle className="w-3.5 h-3.5" /> Falha ({audit.exitCode})
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right text-slate-400">{audit.durationMs} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
