import React, { useState } from 'react';
import { useCompanyOS } from '../../context/CompanyOSContext';
import { 
  X, 
  Globe, 
  ShieldCheck, 
  Radio, 
  Layers, 
  Database, 
  Server, 
  ArrowRight, 
  Terminal, 
  Activity, 
  Wifi, 
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const NetworkTopologyModal: React.FC = () => {
  const { 
    activeOverlayModal, 
    setActiveOverlayModal, 
    networks, 
    servers, 
    databases, 
    k8sClusters, 
    openTerminalForTarget,
    setSelectedEntity 
  } = useCompanyOS();

  const [selectedNode, setSelectedNode] = useState<string | null>('k8s-node-03');

  if (activeOverlayModal !== 'topology') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-6xl h-[88vh] bg-[#070c18] border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200 select-none">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0c1427] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-300">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-mono text-white">
                  TOPOLOGIA DE REDE GLOBAL & FLUXO DE PACOTES
                </h2>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  BGP MESH 4.85 Gbps
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Roteamento BGP, Cloudflare WAF, Firewalls NGFW, Ingress Traefik, Pods K8s e Clusters de Banco.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openTerminalForTarget({ id: 'net-router-core', name: 'Router-Core-BGP-01', type: 'router' })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 text-xs font-mono cursor-pointer transition-all"
            >
              <Terminal className="w-3.5 h-3.5" /> CLI de Rede
            </button>
            <button
              onClick={() => setActiveOverlayModal('none')}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: High-Tech Visual Topology Graph */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#050811] flex flex-col justify-between relative">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Topology Layer Row */}
          <div className="grid grid-cols-5 gap-4 relative z-10">
            
            {/* 1. EDGE / INTERNET */}
            <div className="flex flex-col gap-3">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>1. Borda / Internet</span>
              </div>
              
              <div 
                onClick={() => setSelectedNode('internet')}
                className="p-3.5 rounded-2xl bg-black/60 border border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition-all hover:scale-102 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-cyan-300">Uplink Level3 & Telxius</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="mt-2 text-[11px] font-mono text-slate-400 space-y-1">
                  <div>Tráfego: <b>4.85 Gbps</b></div>
                  <div>Latência Externa: <b>1.2 ms</b></div>
                  <div>Perda: <b>0.001%</b></div>
                </div>
              </div>

              <div 
                onClick={() => setSelectedNode('waf')}
                className="p-3.5 rounded-2xl bg-black/60 border border-purple-500/30 hover:border-purple-400 cursor-pointer transition-all hover:scale-102"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-purple-300">Cloudflare WAF</span>
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                </div>
                <div className="mt-2 text-[11px] font-mono text-slate-400 space-y-1">
                  <div>Status: <b>Ativo (DDoS Shield)</b></div>
                  <div>Bloqueios Hoje: <b className="text-purple-300">18.4k</b></div>
                </div>
              </div>
            </div>

            {/* 2. CORE ROUTING & FIREWALL */}
            <div className="flex flex-col gap-3">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-blue-400" />
                <span>2. Roteamento Core</span>
              </div>

              <div 
                onClick={() => setSelectedNode('router')}
                className="p-3.5 rounded-2xl bg-black/60 border border-blue-500/30 hover:border-blue-400 cursor-pointer transition-all hover:scale-102"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-blue-300">Router-Core-BGP-01</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="mt-2 text-[11px] font-mono text-slate-400 space-y-1">
                  <div>IP: <b>10.0.0.1</b></div>
                  <div>Rotas BGP: <b>48,219</b></div>
                  <div>Throughput: <b>4.85 Gbps</b></div>
                </div>
              </div>

              <div 
                onClick={() => setSelectedNode('firewall')}
                className="p-3.5 rounded-2xl bg-black/60 border border-rose-500/30 hover:border-rose-400 cursor-pointer transition-all hover:scale-102"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-rose-300">PaloAlto NGFW</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="mt-2 text-[11px] font-mono text-slate-400 space-y-1">
                  <div>IP: <b>10.0.0.2</b></div>
                  <div>Regras: <b>520 ativas</b></div>
                  <div>Zero Day Defense: <b>ON</b></div>
                </div>
              </div>
            </div>

            {/* 3. INGRESS & LOAD BALANCERS */}
            <div className="flex flex-col gap-3">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>3. Ingress & LB</span>
              </div>

              <div 
                onClick={() => setSelectedNode('traefik')}
                className="p-3.5 rounded-2xl bg-black/60 border border-amber-500/30 hover:border-amber-400 cursor-pointer transition-all hover:scale-102"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-amber-300">Traefik Ingress Controller</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="mt-2 text-[11px] font-mono text-slate-400 space-y-1">
                  <div>IP: <b>10.0.0.10</b></div>
                  <div>Conexões: <b>4,890</b></div>
                  <div>Algoritmo: <b>Round-Robin HA</b></div>
                </div>
              </div>
            </div>

            {/* 4. KUBERNETES COMPUTE NODES */}
            <div className="flex flex-col gap-3">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-violet-400" />
                <span>4. Kubernetes Pods</span>
              </div>

              <div 
                onClick={() => setSelectedNode('k8s-node-01')}
                className="p-3 rounded-xl bg-black/60 border border-emerald-500/30 hover:border-emerald-400 cursor-pointer transition-all hover:scale-102"
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-300">
                  <span>k8s-node-01 (CP)</span>
                  <span>🟢 38% CPU</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">14 pods ativos (api-gateway)</div>
              </div>

              <div 
                onClick={() => setSelectedNode('k8s-node-02')}
                className="p-3 rounded-xl bg-black/60 border border-emerald-500/30 hover:border-emerald-400 cursor-pointer transition-all hover:scale-102"
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-300">
                  <span>k8s-node-02 (Worker)</span>
                  <span>🟢 59% CPU</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">19 pods ativos (queue-worker, auth)</div>
              </div>

              {/* Problem Node */}
              <div 
                onClick={() => setSelectedNode('k8s-node-03')}
                className={`p-3 rounded-xl cursor-pointer transition-all hover:scale-102 border ${
                  servers.find(s => s.name === 'server-prod-03')?.status === 'critical'
                    ? 'bg-rose-950/40 border-rose-500/70 shadow-lg shadow-rose-950/50 animate-pulse'
                    : 'bg-black/60 border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold text-rose-300">
                  <span>k8s-node-03 (Worker)</span>
                  <span>🔴 93% CPU</span>
                </div>
                <div className="text-[10px] text-rose-300 mt-1 font-mono">payment-api (CrashLoopBackOff)</div>
              </div>
            </div>

            {/* 5. DATABASE & STREAMING */}
            <div className="flex flex-col gap-3">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-400" />
                <span>5. Dados & Filas</span>
              </div>

              <div 
                onClick={() => setSelectedNode('postgres')}
                className="p-3.5 rounded-2xl bg-black/60 border border-amber-500/30 hover:border-amber-400 cursor-pointer transition-all hover:scale-102"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-amber-300">PostgreSQL Primary</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="mt-2 text-[11px] font-mono text-slate-400 space-y-1">
                  <div>Porta: <b>5432</b></div>
                  <div>QPS: <b>1,840</b></div>
                  <div>Hit Ratio: <b>99.4%</b></div>
                </div>
              </div>

              <div 
                onClick={() => setSelectedNode('redis')}
                className="p-3.5 rounded-2xl bg-black/60 border border-rose-500/30 hover:border-rose-400 cursor-pointer transition-all hover:scale-102"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-rose-300">Redis Cache Cluster</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="mt-2 text-[11px] font-mono text-slate-400 space-y-1">
                  <div>Porta: <b>6379</b></div>
                  <div>QPS: <b>8,400</b></div>
                  <div>Hit Ratio: <b>97.8%</b></div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Selected Node Inspector Bar */}
          <div className="p-4 rounded-2xl bg-[#0c1427] border border-cyan-500/30 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
                Nó Selecionado: <b>{selectedNode}</b>
              </div>
              <span className="text-xs text-slate-300 font-sans">
                Clique duas vezes para abrir o console completo ou use o terminal rápido.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openTerminalForTarget({ id: selectedNode || 'k8s-node-03', name: selectedNode || 'k8s-node-03', type: 'node' })}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold cursor-pointer transition-all"
              >
                <Terminal className="w-4 h-4" /> Abrir CLI no Nó
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
