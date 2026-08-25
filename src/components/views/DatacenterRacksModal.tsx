import React, { useState } from 'react';
import { useCompanyOS } from '../../context/CompanyOSContext';
import { 
  X, 
  Server, 
  Terminal, 
  RefreshCw, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Flame, 
  HardDrive
} from 'lucide-react';
import { ITServerNode } from '../../types';

export const DatacenterRacksModal: React.FC = () => {
  const { 
    activeOverlayModal, 
    setActiveOverlayModal, 
    servers, 
    openTerminalForTarget, 
    rebootServer, 
    setSelectedEntity 
  } = useCompanyOS();

  const [selectedServer, setSelectedServer] = useState<ITServerNode | null>(servers[0] || null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  if (activeOverlayModal !== 'datacenter_racks') return null;

  const racks = ['RACK-01', 'RACK-02', 'RACK-03'];

  const handleReboot = async (srvId: string) => {
    const msg = await rebootServer(srvId);
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-6xl h-[88vh] bg-[#070c18] border border-blue-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200 select-none">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0c1427] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-950/80 border border-blue-400/40 text-blue-300">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-mono text-white">
                  DATACENTER RACKS & BLADE SERVERS MATRIX
                </h2>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-500/30">
                  42U BLADE RACKS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Gabinete visual de servidores bare-metal, virtualizadores e nós de alta densidade.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openTerminalForTarget({ id: 'srv-prod-01', name: 'server-prod-01', type: 'server' })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 text-xs font-mono cursor-pointer transition-all"
            >
              <Terminal className="w-3.5 h-3.5" /> Terminal Geral
            </button>
            <button
              onClick={() => setActiveOverlayModal('none')}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Feedback */}
        {actionFeedback && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-blue-950/80 border border-blue-400/50 text-blue-200 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Main Racks View */}
        <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden bg-[#050811]">
          
          {/* 3 Racks Side-by-Side (8 cols) */}
          <div className="col-span-8 grid grid-cols-3 gap-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-900">
            {racks.map(rackId => {
              const rackServers = servers.filter(s => s.rackId === rackId);
              return (
                <div key={rackId} className="flex flex-col bg-[#080d1a] border-2 border-slate-700/60 rounded-2xl p-3 shadow-xl">
                  {/* Rack Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                    <span className="font-mono font-bold text-xs text-blue-400 flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5" />
                      {rackId}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">42U Rack</span>
                  </div>

                  {/* Server Slots in Rack */}
                  <div className="space-y-2 flex-1">
                    {rackServers.map(srv => {
                      const isSelected = selectedServer?.id === srv.id;
                      const isCrit = srv.status === 'critical';
                      const isWarn = srv.status === 'warning';

                      return (
                        <div
                          key={srv.id}
                          onClick={() => setSelectedServer(srv)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-950/60 border-blue-400 shadow-md shadow-blue-950/50 scale-102'
                              : isCrit
                              ? 'bg-rose-950/40 border-rose-500/70 animate-pulse'
                              : isWarn
                              ? 'bg-amber-950/30 border-amber-500/40'
                              : 'bg-black/50 border-white/10 hover:border-blue-400/40'
                          }`}
                        >
                          {/* Top row with LEDs */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {/* Power & Network LED */}
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              <span className={`w-2 h-2 rounded-full ${isCrit ? 'bg-rose-500 animate-ping' : isWarn ? 'bg-amber-400' : 'bg-cyan-400'}`} />
                              <span className="font-mono font-bold text-[11px] text-white truncate max-w-[120px]">
                                {srv.name}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">{srv.slotUnit}</span>
                          </div>

                          {/* CPU & RAM mini bars */}
                          <div className="mt-2 space-y-1 text-[10px] font-mono text-slate-400">
                            <div className="flex justify-between">
                              <span>CPU: {srv.metrics.cpuUsage}%</span>
                              <span>RAM: {srv.metrics.ramUsage}%</span>
                            </div>
                            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${srv.metrics.cpuUsage > 85 ? 'bg-rose-500' : srv.metrics.cpuUsage > 70 ? 'bg-amber-500' : 'bg-blue-400'}`}
                                style={{ width: `${Math.min(100, srv.metrics.cpuUsage)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Empty Slots */}
                    <div className="p-3 rounded-xl border border-dashed border-white/5 bg-white/2 text-center text-[10px] font-mono text-slate-600">
                      [Slot Vago U07-U12 - Disponível]
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Server Drilldown (4 cols) */}
          <div className="col-span-4 flex flex-col bg-[#0a0f1e] border border-white/10 rounded-2xl p-4 overflow-y-auto">
            {selectedServer ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h3 className="text-sm font-bold font-mono text-blue-300">
                      {selectedServer.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">IP: {selectedServer.ip}</span>
                  </div>
                  <button
                    onClick={() => openTerminalForTarget({ id: selectedServer.id, name: selectedServer.name, type: 'server' })}
                    className="p-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/60 text-blue-300 border border-blue-400/40 text-xs font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <Terminal className="w-3.5 h-3.5" /> SSH Console
                  </button>
                </div>

                {/* Specs */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Rack & Slot:</span>
                    <b className="text-white">{selectedServer.rackId} ({selectedServer.slotUnit})</b>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>CPU Cores:</span>
                    <b className="text-cyan-300">{selectedServer.cores} vCPUs</b>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>RAM Total:</span>
                    <b className="text-purple-300">{selectedServer.totalRamGb} GB</b>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>NVMe Storage:</span>
                    <b className="text-emerald-300">{selectedServer.totalDiskGb} GB</b>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Temperatura:</span>
                    <b className={selectedServer.metrics.temperatureC! > 60 ? 'text-rose-400' : 'text-emerald-400'}>
                      {selectedServer.metrics.temperatureC} °C
                    </b>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="text-[11px] font-mono font-bold text-slate-300 block">COMANDOS NO HOST</span>
                  
                  <button
                    onClick={() => handleReboot(selectedServer.id)}
                    className="w-full py-2.5 px-3 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
                  >
                    <RefreshCw className="w-4 h-4" /> systemctl reboot (Graceful)
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 p-6">
                <Server className="w-10 h-10 mb-2 opacity-30" />
                <span className="text-xs font-mono">Selecione um servidor em um rack para detalhes.</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
