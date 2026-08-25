import React, { useState, useRef, useEffect } from 'react';
import { useCompanyOS } from '../../context/CompanyOSContext';
import { 
  ServerRackSprite, 
  K8sPodSprite, 
  DatabaseSprite, 
  NetworkDeviceSprite, 
  HumanCharacterSprite, 
  AIAgentSprite 
} from './OfficeSprites';
import { NetworkDataCables } from './NetworkDataCables';
import { 
  Activity, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Flame, 
  Layers, 
  Server, 
  Database, 
  ShieldCheck, 
  Radio, 
  Bot, 
  Terminal,
  Crosshair,
  Sparkles
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export const OfficeCanvas: React.FC = () => {
  const { 
    departments, 
    servers, 
    k8sClusters, 
    databases, 
    networks, 
    security, 
    incidents, 
    employees, 
    aiAgents, 
    selectedEntity,
    setSelectedEntity, 
    openTerminalForTarget,
    setActiveOverlayModal,
    soundEnabled,
    rebootServer,
    restartPod
  } = useCompanyOS();

  // Canvas Viewport Pan & Zoom State
  const [zoom, setZoom] = useState<number>(0.92);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 20, y: 15 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Active Critical Incidents
  const activeCritCount = incidents.filter(i => i.status !== 'resolved' && i.severity === 'critical').length;
  const isEmergency = activeCritCount > 0;

  // Agent Dynamic Walking Coordinates (Simulated Live Movement)
  // When incident is active, DevOps Agent walks from (860, 390) over to K8s/Datacenter (760, 160)
  const [agentCoords, setAgentCoords] = useState<{ [id: string]: { x: number; y: number; isInvestigating: boolean } }>({
    'ai-devops-01': { x: 740, y: 170, isInvestigating: isEmergency },
    'ai-noc-01': { x: 220, y: 120, isInvestigating: false },
    'ai-sec-01': { x: 1330, y: 390, isInvestigating: false },
    'ai-db-01': { x: 570, y: 390, isInvestigating: false }
  });

  useEffect(() => {
    if (isEmergency) {
      // Walk to Kubernetes Node 03 / Datacenter
      setAgentCoords(prev => ({
        ...prev,
        'ai-devops-01': { x: 740, y: 170, isInvestigating: true }
      }));
    } else {
      // Walk back to DevOps station
      setAgentCoords(prev => ({
        ...prev,
        'ai-devops-01': { x: 860, y: 390, isInvestigating: false }
      }));
    }
  }, [isEmergency]);

  // Mouse drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-node')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom(prev => Math.min(1.6, Math.max(0.45, prev * zoomFactor)));
  };

  // Camera Presets
  const focusOn = (targetX: number, targetY: number, targetZoom: number = 1.05) => {
    setPan({ x: -targetX + window.innerWidth / 2.8, y: -targetY + window.innerHeight / 3.2 });
    setZoom(targetZoom);
    if (soundEnabled) soundManager.playClick();
  };

  const resetView = () => {
    setZoom(0.92);
    setPan({ x: 20, y: 15 });
    if (soundEnabled) soundManager.playClick();
  };

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full h-screen bg-[#030611] overflow-hidden select-none cursor-grab active:cursor-grabbing ${
        isEmergency ? 'ring-4 ring-rose-500/50 ring-inset' : ''
      }`}
    >
      {/* Background High-Tech Grid & Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, #00e5ff18 0%, transparent 70%),
            linear-gradient(to right, #1e293b 1px, transparent 1px),
            linear-gradient(to bottom, #1e293b 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px'
        }}
      />

      {/* Emergency Ambient Siren Overlay */}
      {isEmergency && (
        <div className="absolute inset-0 pointer-events-none bg-rose-950/20 animate-pulse duration-1000 z-10" />
      )}

      {/* Virtual Office Interactive World Layer */}
      <div
        className="absolute transition-transform duration-100 ease-out origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: '2600px',
          height: '1700px'
        }}
      >
        {/* Animated Network Data Cables with moving glowing packets */}
        <NetworkDataCables isEmergency={isEmergency} />

        {/* 1. ROOM: NOC CENTRAL VIDEO WALL */}
        <div 
          className={`absolute rounded-3xl p-5 border transition-all duration-300 ${
            isEmergency 
              ? 'bg-[#160918]/90 border-rose-500/70 shadow-2xl shadow-rose-950/60' 
              : 'bg-[#080f22]/90 border-cyan-500/30 shadow-2xl backdrop-blur-md'
          }`}
          style={{ left: '40px', top: '40px', width: '380px', height: '300px' }}
        >
          {/* Room Header */}
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                <Activity className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-black font-mono text-white tracking-wider uppercase">
                  NOC — CENTRAL DE OPERAÇÕES
                </h3>
                <span className="text-[9px] text-slate-400 font-mono">Telemetria & Video Wall Global</span>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              SLO 99.98%
            </span>
          </div>

          {/* Big Live Video Wall Screen */}
          <div 
            onClick={() => setActiveOverlayModal('incidents')}
            className="p-3 rounded-2xl bg-black/80 border border-cyan-500/50 hover:border-cyan-400 cursor-pointer interactive-node transition-all mb-3"
          >
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-cyan-300 mb-1.5">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                VIDEO WALL PRINCIPAL
              </span>
              <span className="text-emerald-400">60 FPS REALTIME</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
              <div className="p-1.5 rounded-lg bg-cyan-950/50 border border-cyan-500/20 text-center">
                <span className="text-slate-400 text-[8px] block">RPS</span>
                <b className="text-cyan-300">18.4k</b>
              </div>
              <div className="p-1.5 rounded-lg bg-cyan-950/50 border border-cyan-500/20 text-center">
                <span className="text-slate-400 text-[8px] block">LATÊNCIA</span>
                <b className="text-emerald-400">12ms</b>
              </div>
              <div className={`p-1.5 rounded-lg border text-center ${
                isEmergency ? 'bg-rose-950/70 border-rose-500 text-rose-300 animate-pulse' : 'bg-cyan-950/50 border-cyan-500/20'
              }`}>
                <span className="text-slate-400 text-[8px] block">ESTADO</span>
                <b className="text-[9px]">{isEmergency ? '🔴 1 ALERTA' : '🟢 NOMINAL'}</b>
              </div>
            </div>
          </div>

          {/* Operator Stations (Marcio Tanaka & NOC Agent) */}
          <div className="flex items-center justify-around">
            {employees.filter(e => e.departmentId === 'noc').map(emp => (
              <div key={emp.id} className="interactive-node">
                <HumanCharacterSprite
                  employee={emp}
                  isSelected={selectedEntity?.id === emp.id}
                  hasIncidentNearby={isEmergency}
                  onClick={() => setSelectedEntity(emp, 'technician')}
                />
              </div>
            ))}
            {aiAgents.filter(a => a.departmentId === 'noc').map(agent => (
              <div key={agent.id} className="interactive-node">
                <AIAgentSprite
                  agent={agent}
                  isSelected={selectedEntity?.id === agent.id}
                  onClick={() => setSelectedEntity(agent, 'ai_agent')}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 2. ROOM: SERVIDORES & DATACENTER 42U RACKS */}
        <div 
          className={`absolute rounded-3xl p-5 border transition-all duration-300 ${
            isEmergency 
              ? 'bg-[#180914]/90 border-rose-500/70 shadow-2xl shadow-rose-950/60' 
              : 'bg-[#060c1c]/90 border-blue-500/30 shadow-2xl backdrop-blur-md'
          }`}
          style={{ left: '440px', top: '40px', width: '510px', height: '300px' }}
        >
          {/* Room Header */}
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-blue-950 text-blue-400 border border-blue-500/40">
                <Server className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-black font-mono text-white tracking-wider uppercase">
                  DATACENTER & RACKS 42U
                </h3>
                <span className="text-[9px] text-slate-400 font-mono">Infraestrutura Física & Virtualizada</span>
              </div>
            </div>
            <button
              onClick={() => setActiveOverlayModal('datacenter_racks')}
              className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-500/40 interactive-node cursor-pointer transition-colors"
            >
              Ver Racks 42U →
            </button>
          </div>

          {/* 3 Physical Animated Server Racks */}
          <div className="flex items-center justify-between gap-3">
            {servers.slice(0, 3).map(srv => (
              <div key={srv.id} className="interactive-node">
                <ServerRackSprite
                  server={srv}
                  isSelected={selectedEntity?.id === srv.id}
                  onClick={() => setSelectedEntity(srv, 'server')}
                  onDoubleClick={() => openTerminalForTarget({ id: srv.id, name: srv.name, type: 'server' })}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 3. ROOM: KUBERNETES & MICROSERVICES CLUSTER */}
        <div 
          className={`absolute rounded-3xl p-5 border transition-all duration-300 ${
            isEmergency 
              ? 'bg-[#1c0a1a]/95 border-rose-500/80 shadow-2xl shadow-rose-950/70' 
              : 'bg-[#0c081e]/90 border-violet-500/30 shadow-2xl backdrop-blur-md'
          }`}
          style={{ left: '970px', top: '40px', width: '520px', height: '300px' }}
        >
          {/* Room Header */}
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-violet-950 text-violet-400 border border-violet-500/40">
                <Layers className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-black font-mono text-white tracking-wider uppercase">
                  KUBERNETES & PODS (CLUSTER PROD)
                </h3>
                <span className="text-[9px] text-slate-400 font-mono">k8s-prod-brazil • 3 Nodes • 48 Pods</span>
              </div>
            </div>
            <button
              onClick={() => setActiveOverlayModal('k8s_explorer')}
              className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-violet-950 hover:bg-violet-900 text-violet-300 border border-violet-500/40 interactive-node cursor-pointer transition-colors"
            >
              K8s Explorer →
            </button>
          </div>

          {/* Pods Grid (payment-55fd with CrashLoop & Auto-Heal animation) */}
          <div className="flex items-center justify-between gap-3 mb-2">
            {k8sClusters[0]?.pods.slice(0, 3).map(pod => (
              <div key={pod.id} className="interactive-node">
                <K8sPodSprite
                  pod={pod}
                  isSelected={selectedEntity?.id === pod.id}
                  onClick={() => setSelectedEntity(pod, 'k8s_pod')}
                  onDoubleClick={() => openTerminalForTarget({ id: pod.id, name: pod.name, type: 'k8s_pod' })}
                />
              </div>
            ))}
          </div>

          {/* K8s Engineer Station (Juliana Rossi) */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            {employees.filter(e => e.departmentId === 'kubernetes').map(emp => (
              <div key={emp.id} className="interactive-node">
                <HumanCharacterSprite
                  employee={emp}
                  isSelected={selectedEntity?.id === emp.id}
                  hasIncidentNearby={isEmergency}
                  onClick={() => setSelectedEntity(emp, 'technician')}
                />
              </div>
            ))}
            <div className="text-[10px] font-mono text-slate-400">
              Auto-Scaling HPA: <span className="text-emerald-400 font-bold">Ativo (1-10)</span>
            </div>
          </div>
        </div>

        {/* 4. ROOM: NETWORK & BGP ROUTING CORE */}
        <div 
          className="absolute rounded-3xl p-5 border bg-[#06120d]/90 border-emerald-500/30 shadow-2xl backdrop-blur-md"
          style={{ left: '40px', top: '360px', width: '380px', height: '280px' }}
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                <Radio className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-black font-mono text-white tracking-wider uppercase">
                  NETWORK & BGP EDGE
                </h3>
                <span className="text-[9px] text-slate-400 font-mono">Uplinks 10Gbps • Telxius & Level3</span>
              </div>
            </div>
            <button
              onClick={() => setActiveOverlayModal('topology')}
              className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 interactive-node cursor-pointer transition-colors"
            >
              Topologia →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {networks.map(net => (
              <div key={net.id} className="interactive-node">
                <NetworkDeviceSprite
                  device={net}
                  isSelected={selectedEntity?.id === net.id}
                  onClick={() => setSelectedEntity(net, 'router')}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 5. ROOM: DATABASE & CACHE CLUSTER */}
        <div 
          className="absolute rounded-3xl p-5 border bg-[#140e06]/90 border-amber-500/30 shadow-2xl backdrop-blur-md"
          style={{ left: '440px', top: '360px', width: '510px', height: '280px' }}
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-950 text-amber-400 border border-amber-500/40">
                <Database className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-black font-mono text-white tracking-wider uppercase">
                  DATABASE & STREAM CORE
                </h3>
                <span className="text-[9px] text-slate-400 font-mono">PostgreSQL HA • Redis • Kafka</span>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40">
              0ms Replication Lag
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            {databases.map(db => (
              <div key={db.id} className="interactive-node">
                <DatabaseSprite
                  database={db}
                  isSelected={selectedEntity?.id === db.id}
                  onClick={() => setSelectedEntity(db, 'database')}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 6. ROOM: DEVOPS & CI/CD HUB */}
        <div 
          className="absolute rounded-3xl p-5 border bg-[#160814]/90 border-pink-500/30 shadow-2xl backdrop-blur-md"
          style={{ left: '970px', top: '360px', width: '250px', height: '280px' }}
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-pink-950 text-pink-400 border border-pink-500/40">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-black font-mono text-white tracking-wider uppercase">
                  DEVOPS & CI/CD
                </h3>
                <span className="text-[9px] text-slate-400 font-mono">Runners & Pipelines</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-[9px] font-mono">
            <div className="p-2 rounded-xl bg-black/60 border border-emerald-500/30">
              <div className="flex justify-between font-bold text-white mb-0.5">
                <span>company/core-api</span>
                <span className="text-emerald-400">PASSED</span>
              </div>
              <div className="text-slate-400">branch: main (77bd21a)</div>
            </div>

            <div className="p-2 rounded-xl bg-black/60 border border-purple-500/40">
              <div className="flex justify-between font-bold text-white mb-0.5">
                <span>payment-service</span>
                <span className="text-purple-300 animate-pulse">BUILDING</span>
              </div>
              <div className="text-slate-400">Hotfix memory limit</div>
            </div>
          </div>
        </div>

        {/* 7. ROOM: SECURITY SOC & RADAR */}
        <div 
          className="absolute rounded-3xl p-5 border bg-[#18060c]/90 border-rose-500/30 shadow-2xl backdrop-blur-md"
          style={{ left: '1240px', top: '360px', width: '250px', height: '280px' }}
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-rose-950 text-rose-400 border border-rose-500/40">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-black font-mono text-white tracking-wider uppercase">
                  SOC DEFENSE RADAR
                </h3>
                <span className="text-[9px] text-slate-400 font-mono">WAF & SIEM Protection</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-black/70 border border-rose-500/30 mb-2">
            {/* Radar Sonar Visual */}
            <div className="relative w-16 h-16 rounded-full border border-rose-500/40 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-rose-500/20 animate-ping" />
              <ShieldCheck className="w-6 h-6 text-rose-400" />
            </div>
            <span className="text-[10px] font-mono font-bold text-rose-300 mt-1">18,420 Ameaças Bloqueadas</span>
          </div>

          <div className="flex justify-center">
            {employees.filter(e => e.departmentId === 'security').map(emp => (
              <div key={emp.id} className="interactive-node">
                <HumanCharacterSprite
                  employee={emp}
                  isSelected={selectedEntity?.id === emp.id}
                  onClick={() => setSelectedEntity(emp, 'technician')}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 8. ROOM: SRE WAR ROOM & INCIDENT COMMAND */}
        <div 
          className={`absolute rounded-3xl p-5 border transition-all duration-300 ${
            isEmergency
              ? 'bg-[#200918]/95 border-rose-500 shadow-2xl shadow-rose-950/80'
              : 'bg-[#090b1c]/90 border-indigo-500/30 shadow-2xl backdrop-blur-md'
          }`}
          style={{ left: '200px', top: '660px', width: '520px', height: '260px' }}
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-indigo-950 text-indigo-400 border border-indigo-500/40">
                <Flame className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-black font-mono text-white tracking-wider uppercase">
                  SRE WAR ROOM & INCIDENT COMMAND
                </h3>
                <span className="text-[9px] text-slate-400 font-mono">Gestão de Crises e Auto-Remediação</span>
              </div>
            </div>
            <button
              onClick={() => setActiveOverlayModal('incidents')}
              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border interactive-node cursor-pointer transition-colors ${
                isEmergency ? 'bg-rose-950 text-rose-200 border-rose-500 animate-bounce' : 'bg-indigo-950 text-indigo-300 border-indigo-500/40'
              }`}
            >
              {isEmergency ? '🚨 Abrir War Room Ativa' : 'War Room →'}
            </button>
          </div>

          <div className="flex items-center justify-around">
            {employees.filter(e => e.departmentId === 'suporte').map(emp => (
              <div key={emp.id} className="interactive-node">
                <HumanCharacterSprite
                  employee={emp}
                  isSelected={selectedEntity?.id === emp.id}
                  hasIncidentNearby={isEmergency}
                  onClick={() => setSelectedEntity(emp, 'technician')}
                />
              </div>
            ))}

            <div className="p-3 rounded-2xl bg-black/70 border border-indigo-500/30 max-w-[280px]">
              <div className="text-[10px] font-mono font-bold text-indigo-300 mb-1">
                STATUS DA RESPOSTA A INCIDENTES:
              </div>
              <p className="text-[9px] text-slate-300 font-sans leading-relaxed">
                {isEmergency 
                  ? 'DevOps Agent 🤖 mobilizado no cluster Kubernetes para diagnosticar CrashLoopBackOff no pod payment-55fd.' 
                  : 'Nenhum incidente crítico ativo. Todos os SLOs de produção em 99.98%.'}
              </p>
            </div>
          </div>
        </div>

        {/* 9. ROOM: AI AGENTS & NEURAL AUTOMATION LAB */}
        <div 
          className="absolute rounded-3xl p-5 border bg-[#12061e]/90 border-purple-500/30 shadow-2xl backdrop-blur-md"
          style={{ left: '750px', top: '660px', width: '520px', height: '260px' }}
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-purple-950 text-purple-400 border border-purple-500/40">
                <Bot className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-black font-mono text-white tracking-wider uppercase">
                  AI AGENTS & AUTONOMOUS AUTO-HEAL LAB
                </h3>
                <span className="text-[9px] text-slate-400 font-mono">Gemini 2.5 Autonomous Orchestrators</span>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40">
              99.2% Precisão
            </span>
          </div>

          <div className="flex items-center justify-around">
            {aiAgents.filter(a => a.departmentId === 'automation' || a.id === 'ai-db-01').map(agent => (
              <div key={agent.id} className="interactive-node">
                <AIAgentSprite
                  agent={agent}
                  isSelected={selectedEntity?.id === agent.id}
                  onClick={() => setSelectedEntity(agent, 'ai_agent')}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DYNAMIC MOVING AGENT LAYER: DevOps Agent Moving to Node 03 During Alert   */}
        {/* ========================================================================= */}
        <div
          className="absolute transition-all duration-1000 ease-in-out pointer-events-auto interactive-node z-20"
          style={{
            left: `${agentCoords['ai-devops-01'].x}px`,
            top: `${agentCoords['ai-devops-01'].y}px`
          }}
        >
          <AIAgentSprite
            agent={aiAgents.find(a => a.id === 'ai-devops-01') || aiAgents[0]}
            isSelected={selectedEntity?.id === 'ai-devops-01'}
            isInvestigating={agentCoords['ai-devops-01'].isInvestigating}
            onClick={() => setSelectedEntity(aiAgents.find(a => a.id === 'ai-devops-01'), 'ai_agent')}
          />
        </div>

        {/* Holographic Scanning Laser Beam from Agent to Server/Pod */}
        {isEmergency && (
          <svg className="absolute inset-0 pointer-events-none w-full h-full z-15">
            <line
              x1={agentCoords['ai-devops-01'].x + 70}
              y1={agentCoords['ai-devops-01'].y + 50}
              x2="990"
              y2="150"
              stroke="#a855f7"
              strokeWidth="2.5"
              strokeDasharray="4 2"
              className="animate-pulse"
            />
          </svg>
        )}
      </div>

      {/* Floating Bottom Quick Camera & Focus Bar */}
      <div className="absolute bottom-6 left-6 z-30 flex items-center gap-1.5 bg-[#080d1c]/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-2 shadow-2xl">
        <span className="text-[10px] font-mono font-bold text-slate-400 px-2 flex items-center gap-1">
          <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
          CÂMERA:
        </span>
        <button
          onClick={() => focusOn(180, 160)}
          className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors text-[11px] font-mono font-semibold cursor-pointer"
        >
          NOC
        </button>
        <button
          onClick={() => focusOn(680, 160)}
          className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-blue-500/20 text-slate-300 hover:text-blue-300 transition-colors text-[11px] font-mono font-semibold cursor-pointer"
        >
          Datacenter
        </button>
        <button
          onClick={() => focusOn(1200, 160)}
          className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-violet-500/20 text-slate-300 hover:text-violet-300 transition-colors text-[11px] font-mono font-semibold cursor-pointer"
        >
          Kubernetes
        </button>
        <button
          onClick={() => focusOn(680, 480)}
          className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 transition-colors text-[11px] font-mono font-semibold cursor-pointer"
        >
          Databases
        </button>
        {isEmergency && (
          <button
            onClick={() => focusOn(1050, 160, 1.2)}
            className="px-2.5 py-1 rounded-xl bg-rose-950 text-rose-300 border border-rose-500 animate-bounce transition-colors text-[11px] font-mono font-bold cursor-pointer flex items-center gap-1"
          >
            🚨 Focar Incidente
          </button>
        )}
      </div>

      {/* Floating Zoom Controls & Reset */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2 bg-[#080d1c]/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-2 shadow-2xl">
        <button
          onClick={() => setZoom(prev => Math.min(1.6, prev + 0.1))}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-mono font-bold"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono text-cyan-300 px-1">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom(prev => Math.max(0.45, prev - 0.1))}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-mono font-bold"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Resetar Câmera"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
