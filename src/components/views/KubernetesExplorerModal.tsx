import React, { useState } from 'react';
import { useCompanyOS } from '../../context/CompanyOSContext';
import { 
  X, 
  Layers, 
  Server, 
  Terminal, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Activity, 
  FileText, 
  Bot,
  Search,
  Zap
} from 'lucide-react';
import { K8sPod, K8sNode } from '../../types';

export const KubernetesExplorerModal: React.FC = () => {
  const { 
    activeOverlayModal, 
    setActiveOverlayModal, 
    k8sClusters, 
    restartPod, 
    openTerminalForTarget,
    runAiInvestigation,
    setSelectedEntity 
  } = useCompanyOS();

  const [selectedNamespace, setSelectedNamespace] = useState<string>('production');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedPod, setSelectedPod] = useState<K8sPod | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  if (activeOverlayModal !== 'k8s_explorer') return null;

  const cluster = k8sClusters[0];
  const filteredPods = cluster.pods.filter(pod => {
    const matchNs = selectedNamespace === 'all' || pod.namespace === selectedNamespace;
    const matchSearch = !searchFilter || pod.name.toLowerCase().includes(searchFilter.toLowerCase());
    return matchNs && matchSearch;
  });

  const handleRestart = async (podId: string) => {
    const msg = await restartPod(podId);
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-6xl h-[88vh] bg-[#070c18] border border-violet-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200 select-none">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0d1427] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-950/80 border border-violet-400/40 text-violet-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-mono text-white">
                  KUBERNETES CLUSTER EXPLORER & POD MANAGER
                </h2>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-500/30">
                  {cluster.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Navegue na hierarquia: Cluster ➔ Nodes ➔ Namespaces ➔ Deployments ➔ Pods ➔ Containers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openTerminalForTarget({ id: cluster.id, name: cluster.name, type: 'k8s_cluster' })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 text-violet-300 border border-violet-500/40 text-xs font-mono cursor-pointer transition-all"
            >
              <Terminal className="w-3.5 h-3.5" /> kubectl CLI
            </button>
            <button
              onClick={() => setActiveOverlayModal('none')}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-violet-950/80 border border-violet-400/50 text-violet-200 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Cluster Nodes Bar */}
        <div className="px-6 py-3 bg-[#090e1d] border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-400">NÓS DO CLUSTER:</span>
            {cluster.nodes.map(node => (
              <div 
                key={node.id}
                onClick={() => setSelectedEntity(node, 'k8s_node')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono cursor-pointer transition-all hover:scale-102 ${
                  node.status === 'critical'
                    ? 'bg-rose-950/60 border-rose-500/60 text-rose-300 shadow-md shadow-rose-950/50 animate-pulse'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:border-violet-400/50'
                }`}
              >
                <Server className="w-3.5 h-3.5 text-violet-400" />
                <span className="font-bold">{node.name}</span>
                <span className="text-[10px] text-slate-400">({node.metrics.cpuUsage}% CPU)</span>
                {node.status === 'critical' ? <span className="text-rose-400 font-bold">🔴</span> : <span className="text-emerald-400">🟢</span>}
              </div>
            ))}
          </div>

          {/* Search & Namespace filter */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 border border-white/10 rounded-xl text-xs">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <input 
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Filtrar pods..."
                className="bg-transparent text-violet-200 outline-none placeholder:text-slate-600 font-mono text-xs w-28"
              />
            </div>

            <select
              value={selectedNamespace}
              onChange={e => setSelectedNamespace(e.target.value)}
              className="px-2.5 py-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-slate-300 outline-none cursor-pointer"
            >
              <option value="all">Todos Namespaces</option>
              {cluster.namespaces.map(ns => (
                <option key={ns} value={ns}>{ns}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Main Grid: Pods List & Selected Pod Inspector */}
        <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden bg-[#050811]">
          
          {/* Left: Pods Table / Cards (7 cols) */}
          <div className="col-span-7 flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-violet-900">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>PODS EM EXECUÇÃO ({filteredPods.length})</span>
              <span>STATUS & RESTARTS</span>
            </div>

            {filteredPods.map(pod => (
              <div 
                key={pod.id}
                onClick={() => setSelectedPod(pod)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedPod?.id === pod.id
                    ? 'bg-violet-950/40 border-violet-400 shadow-lg shadow-violet-950/50'
                    : pod.status === 'critical'
                    ? 'bg-rose-950/30 border-rose-500/50 hover:border-rose-400 animate-pulse'
                    : 'bg-black/40 border-white/10 hover:border-violet-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${pod.status === 'critical' ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
                    <span className="font-mono font-bold text-xs text-white">{pod.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    pod.phase === 'CrashLoopBackOff' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-emerald-950 text-emerald-300'
                  }`}>
                    {pod.phase}
                  </span>
                </div>

                <div className="mt-2.5 grid grid-cols-4 gap-2 text-[11px] font-mono text-slate-400">
                  <div>NS: <span className="text-violet-300">{pod.namespace}</span></div>
                  <div>Nó: <span className="text-slate-300">{pod.nodeName}</span></div>
                  <div>Restarts: <span className={pod.restarts > 0 ? 'text-amber-400 font-bold' : 'text-slate-300'}>{pod.restarts}</span></div>
                  <div>Idade: <span className="text-slate-300">{pod.age}</span></div>
                </div>

                {pod.lastLogSnippet && (
                  <div className="mt-2 p-2 rounded-lg bg-black/60 border border-white/5 text-[10px] font-mono text-slate-400 truncate">
                    <span className="text-slate-500">Último log:</span> {pod.lastLogSnippet}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: Selected Pod Drilldown (5 cols) */}
          <div className="col-span-5 flex flex-col bg-[#0a0f1e] border border-white/10 rounded-2xl p-4 overflow-y-auto">
            {selectedPod ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-violet-300 truncate max-w-[240px]">
                      {selectedPod.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">IP: {selectedPod.ip}</span>
                  </div>
                  <button
                    onClick={() => openTerminalForTarget({ id: selectedPod.id, name: selectedPod.name, type: 'k8s_pod' })}
                    className="p-1.5 rounded-lg bg-violet-600/30 hover:bg-violet-600/60 text-violet-300 border border-violet-400/40 text-xs font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <Terminal className="w-3.5 h-3.5" /> Exec CLI
                  </button>
                </div>

                {/* Containers Inside Pod */}
                <div>
                  <span className="text-[11px] font-mono font-bold text-slate-300 block mb-1.5">CONTAINERS DO POD</span>
                  {selectedPod.containers.map(c => (
                    <div key={c.name} className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono space-y-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-white">{c.name}</span>
                        <span className={c.ready ? 'text-emerald-400' : 'text-rose-400'}>{c.state}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">Imagem: <span className="text-violet-300">{c.image}</span></div>
                      <div className="text-[11px] text-slate-400">Memória Limite: <b>{c.memoryLimitMb} MB</b></div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <span className="text-[11px] font-mono font-bold text-slate-300 block">AÇÕES NO POD</span>
                  
                  <button
                    onClick={() => handleRestart(selectedPod.id)}
                    className="w-full py-2.5 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
                  >
                    <RefreshCw className="w-4 h-4" /> kubectl rollout restart pod
                  </button>

                  <button
                    onClick={() => runAiInvestigation(selectedPod.name)}
                    className="w-full py-2.5 px-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-500/40 font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Bot className="w-4 h-4 text-purple-400" /> 🤖 IA Diagnosticar Causa-Raiz
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 p-6">
                <Layers className="w-10 h-10 mb-2 opacity-30" />
                <span className="text-xs font-mono">Selecione um pod ao lado para inspecionar métricas, limites e executar ações.</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
