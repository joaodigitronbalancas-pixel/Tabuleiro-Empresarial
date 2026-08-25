import React, { useState } from 'react';
import { useCompanyOS } from '../../context/CompanyOSContext';
import { 
  X, 
  Terminal, 
  RefreshCw, 
  Play, 
  Pause, 
  Square, 
  Activity, 
  Cpu, 
  Database, 
  Server, 
  Radio, 
  ShieldCheck, 
  AlertTriangle, 
  Bot, 
  User, 
  CheckCircle2, 
  HardDrive, 
  Wifi, 
  Clock, 
  Zap, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { ITServerNode, K8sPod, ITDatabaseNode, ITNetworkDevice, ITSecurityNode, ITEmployee, ITAIAgent } from '../../types';

export const ITEntityDrawer: React.FC = () => {
  const { 
    selectedEntity, 
    selectedEntityType, 
    clearSelection, 
    openTerminalForTarget,
    rebootServer,
    restartPod,
    runAiInvestigation,
    pingTarget,
    resolveIncident,
    currentRole
  } = useCompanyOS();

  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'commands' | 'logs'>('overview');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!selectedEntity) return null;

  const entity = selectedEntity;
  const isServer = selectedEntityType === 'server' || !!entity.rackId;
  const isPod = selectedEntityType === 'k8s_pod' || !!entity.phase;
  const isDatabase = selectedEntityType === 'database' || !!entity.engine;
  const isNetwork = selectedEntityType === 'router' || selectedEntityType === 'switch' || selectedEntityType === 'firewall' || !!entity.macAddress;
  const isSecurity = selectedEntityType === 'firewall' || !!entity.threatLevel;
  const isAI = entity.isAI === true;
  const isHuman = entity.isAI === false && !!entity.email;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'working':
      case 'Running':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">🟢 HEALTHY</span>;
      case 'warning':
      case 'thinking':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40 animate-pulse">🟡 WARNING</span>;
      case 'critical':
      case 'error':
      case 'CrashLoopBackOff':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-950/90 text-rose-300 border border-rose-500/60 animate-pulse">🔴 CRITICAL</span>;
      case 'degraded':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-orange-950/80 text-orange-300 border border-orange-500/40">🟠 DEGRADED</span>;
      case 'maintenance':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-950/80 text-blue-300 border border-blue-500/40">🔵 MAINTENANCE</span>;
      default:
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-white/10">⚫ OFFLINE</span>;
    }
  };

  const handleAction = async (actionFn: () => Promise<string>, actionName: string) => {
    setIsProcessing(true);
    setActionFeedback(`Executando ${actionName}...`);
    try {
      const res = await actionFn();
      setActionFeedback(res);
    } catch (err: any) {
      setActionFeedback(`Erro: ${err?.message || 'Falha ao executar'}`);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-lg bg-[#0a0f1d]/95 backdrop-blur-xl border-l border-cyan-500/30 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-slate-200 select-text">
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-4 bg-[#0d152a] border-b border-white/10 select-none">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
            {isServer && <Server className="w-5 h-5" />}
            {isPod && <Layers className="w-5 h-5" />}
            {isDatabase && <Database className="w-5 h-5" />}
            {isNetwork && <Radio className="w-5 h-5" />}
            {isSecurity && <ShieldCheck className="w-5 h-5" />}
            {isAI && <Bot className="w-5 h-5 text-purple-400" />}
            {isHuman && <User className="w-5 h-5 text-blue-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold font-mono text-white tracking-wide">
                {entity.name}
              </h2>
              {getStatusBadge(entity.status || entity.phase)}
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              {entity.ip && <span className="font-mono text-cyan-400/90 mr-2">{entity.ip}</span>}
              {entity.hostname && <span className="text-slate-400">{entity.hostname}</span>}
              {entity.role && <span className="text-slate-300">{entity.role}</span>}
            </p>
          </div>
        </div>

        <button 
          onClick={clearSelection}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-white/10 bg-[#070b16] px-4 select-none">
        {[
          { id: 'overview', label: 'Visão Geral' },
          { id: 'metrics', label: 'Telemetria' },
          { id: 'commands', label: 'Ações Rápidas' },
          { id: 'logs', label: 'Logs & Eventos' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2.5 text-xs font-semibold font-sans border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div className="mx-4 mt-3 p-3 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-200 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Drawer Body Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-sans scrollbar-thin scrollbar-thumb-cyan-900">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Quick Metrics Capsule Bar */}
            {entity.metrics && (
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">CPU</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold font-mono text-cyan-300">{entity.metrics.cpuUsage || 0}%</span>
                    <Cpu className="w-4 h-4 text-cyan-400/60" />
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full ${entity.metrics.cpuUsage > 85 ? 'bg-rose-500' : entity.metrics.cpuUsage > 70 ? 'bg-amber-500' : 'bg-cyan-400'}`}
                      style={{ width: `${Math.min(100, entity.metrics.cpuUsage || 0)}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">RAM</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold font-mono text-purple-300">{entity.metrics.ramUsage || 0}%</span>
                    <Activity className="w-4 h-4 text-purple-400/60" />
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full ${entity.metrics.ramUsage > 85 ? 'bg-rose-500' : entity.metrics.ramUsage > 70 ? 'bg-amber-500' : 'bg-purple-400'}`}
                      style={{ width: `${Math.min(100, entity.metrics.ramUsage || 0)}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">LATÊNCIA</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold font-mono text-emerald-300">{entity.metrics.latencyMs || 0} ms</span>
                    <Wifi className="w-4 h-4 text-emerald-400/60" />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Uptime: {entity.metrics.uptimePercentage || 99.9}%</span>
                </div>
              </div>
            )}

            {/* Server Specific Info */}
            {isServer && (
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                <h3 className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider">Especificações do Servidor</h3>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                  <div><span className="text-slate-500">Rack / Slot:</span> {entity.rackId} ({entity.slotUnit})</div>
                  <div><span className="text-slate-500">Ambiente:</span> {entity.environment}</div>
                  <div><span className="text-slate-500">Cores CPU:</span> {entity.cores} vCPUs</div>
                  <div><span className="text-slate-500">RAM Total:</span> {entity.totalRamGb} GB</div>
                  <div><span className="text-slate-500">Disco NVMe:</span> {entity.totalDiskGb} GB</div>
                  <div><span className="text-slate-500">Sistema:</span> {entity.os}</div>
                </div>

                {entity.runningServices && (
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[10px] text-slate-400 block mb-1.5">Serviços Ativos:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {entity.runningServices.map((svc: string) => (
                        <span key={svc} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI Agent Info */}
            {isAI && (
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-3">
                <div className="flex items-center gap-2 text-purple-300 font-bold font-mono text-xs">
                  <Bot className="w-4 h-4" />
                  <span>Cérebro Neural: {entity.model}</span>
                </div>
                <p className="text-xs text-slate-300">
                  <b className="text-purple-300">Tarefa Atual:</b> {entity.currentTask}
                </p>
                {entity.currentInvestigation && (
                  <div className="p-2.5 rounded-lg bg-black/40 border border-purple-500/20 text-purple-200 text-xs">
                    <b>Investigando:</b> {entity.currentInvestigation}
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2 rounded bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-500 block">Precisão</span>
                    <span className="font-bold text-emerald-400">{entity.accuracyRate}%</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-500 block">Auto-Fixes</span>
                    <span className="font-bold text-purple-300">{entity.autonomousRemediations}</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-500 block">Tarefas Hoje</span>
                    <span className="font-bold text-cyan-300">{entity.tasksCompletedToday}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Primary Action Button to Open Terminal */}
            <button
              onClick={() => openTerminalForTarget({ id: entity.id, name: entity.name, type: selectedEntityType || 'server' })}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold font-mono text-xs shadow-lg shadow-cyan-950/50 border border-cyan-400/40 cursor-pointer transition-all hover:scale-101"
            >
              <Terminal className="w-4 h-4" />
              <span>Abrir Terminal CLI em {entity.name}</span>
            </button>
          </div>
        )}

        {/* METRICS TAB */}
        {activeTab === 'metrics' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-black/40 border border-white/10">
              <span className="text-xs font-mono font-bold text-cyan-300 block mb-2">Throughput e Pacotes</span>
              <div className="space-y-1.5 font-mono text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Largura de Banda:</span>
                  <b className="text-cyan-300">{entity.metrics?.networkThroughputMbps || 420} Mbps</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pacotes / Seg:</span>
                  <b>{entity.metrics?.packetsPerSec || 18400} pps</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Requisições HTTP:</span>
                  <b>{entity.metrics?.requestsPerSec || 3200} req/s</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Taxa de Erro:</span>
                  <b className={entity.metrics?.errorRate > 1 ? 'text-rose-400' : 'text-emerald-400'}>{entity.metrics?.errorRate || 0.0}%</b>
                </div>
              </div>
            </div>

            {entity.metrics?.temperatureC && (
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between font-mono">
                <span className="text-slate-400">Temperatura dos Cores:</span>
                <span className={`font-bold ${entity.metrics.temperatureC > 65 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {entity.metrics.temperatureC} °C
                </span>
              </div>
            )}
          </div>
        )}

        {/* COMMANDS & QUICK ACTIONS TAB */}
        {activeTab === 'commands' && (
          <div className="space-y-3">
            <span className="text-[11px] font-mono text-slate-400 block">
              Comandos autorizados para o perfil <b className="text-cyan-300">{currentRole}</b>:
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={isProcessing}
                onClick={() => handleAction(() => pingTarget(entity.ip || entity.name), 'Ping')}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 text-left cursor-pointer transition-all flex items-center gap-2"
              >
                <Wifi className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="font-mono font-bold text-slate-200">Ping Test</div>
                  <div className="text-[10px] text-slate-500">Verificar latência</div>
                </div>
              </button>

              <button
                disabled={isProcessing}
                onClick={() => handleAction(() => runAiInvestigation(entity.name), 'Diagnóstico IA')}
                className="p-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 hover:border-purple-400 text-left cursor-pointer transition-all flex items-center gap-2"
              >
                <Bot className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="font-mono font-bold text-purple-200">Diagnóstico IA</div>
                  <div className="text-[10px] text-purple-400/70">Análise neural</div>
                </div>
              </button>

              {isServer && (
                <button
                  disabled={isProcessing}
                  onClick={() => handleAction(() => rebootServer(entity.id), 'Reboot de Servidor')}
                  className="p-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 hover:border-rose-400 text-left cursor-pointer transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 text-rose-400" />
                  <div>
                    <div className="font-mono font-bold text-rose-200">Reboot Nó</div>
                    <div className="text-[10px] text-rose-400/70">Reiniciar host</div>
                  </div>
                </button>
              )}

              {isPod && (
                <button
                  disabled={isProcessing}
                  onClick={() => handleAction(() => restartPod(entity.id), 'Restart Pod')}
                  className="p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 hover:border-emerald-400 text-left cursor-pointer transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-mono font-bold text-emerald-200">Restart Pod</div>
                    <div className="text-[10px] text-emerald-400/70">Limpar CrashLoop</div>
                  </div>
                </button>
              )}

              {isDatabase && (
                <button
                  disabled={isProcessing}
                  onClick={() => handleAction(async () => 'Pool de conexões limpo. 0 deadlocks.', 'Kill Slow Queries')}
                  className="p-3 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 hover:border-amber-400 text-left cursor-pointer transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-mono font-bold text-amber-200">Kill Slow Qs</div>
                    <div className="text-[10px] text-amber-400/70">Limpar conexões</div>
                  </div>
                </button>
              )}
            </div>

            {/* Auto-remediation shortcut if degraded or critical */}
            {(entity.status === 'critical' || entity.status === 'warning') && (
              <button
                disabled={isProcessing}
                onClick={() => {
                  resolveIncident('inc-2026-001');
                  setActionFeedback('🎉 Ação de remediação aplicada. Recurso restabelecido para HEALTHY 🟢.');
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Aplicar Auto-Remediação Imediata</span>
              </button>
            )}
          </div>
        )}

        {/* LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="space-y-2 font-mono text-[11px]">
            <span className="text-[10px] text-slate-400 block mb-1">Últimos eventos capturados pelo agente:</span>
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-2 text-slate-300">
              <div className="flex items-center gap-2 text-cyan-300">
                <span className="text-slate-500">10:42:35</span>
                <span>[INFO] Telemetry probe nominal for {entity.name}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-slate-500">10:40:12</span>
                <span>[DEBUG] cgroup stats memory_used=1840MB</span>
              </div>
              {entity.status === 'critical' && (
                <div className="flex items-center gap-2 text-rose-400 font-bold bg-rose-950/30 p-1.5 rounded">
                  <span className="text-slate-500">10:38:00</span>
                  <span>[ERROR] Liveness probe failed /healthz HTTP 500</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
