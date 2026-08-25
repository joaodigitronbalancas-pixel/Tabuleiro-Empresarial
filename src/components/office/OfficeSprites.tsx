import React from 'react';
import { ITServerNode, K8sPod, ITDatabaseNode, ITNetworkDevice, ITSecurityNode, ITEmployee, ITAIAgent, ITHealthStatus } from '../../types';

// ==========================================
// 1. DATACENTER 42U SERVER RACK SPRITE
// ==========================================
export const ServerRackSprite: React.FC<{
  server: ITServerNode;
  isSelected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
}> = ({ server, isSelected, onClick, onDoubleClick }) => {
  const isCrit = server.status === 'critical';
  const isWarn = server.status === 'warning';
  const isHealthy = server.status === 'healthy';

  const cpu = server.metrics.cpuUsage;
  const ram = server.metrics.ramUsage;
  const temp = server.metrics.temperatureC || 42;

  // Fan speed tied to CPU (faster rotation on high CPU)
  const fanDuration = isCrit ? '0.25s' : isWarn ? '0.5s' : '1.2s';

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick();
      }}
      className={`relative group cursor-pointer transition-all duration-200 rounded-xl p-2.5 flex flex-col justify-between select-none ${
        isSelected
          ? 'ring-2 ring-cyan-400 bg-[#0c1830] shadow-lg shadow-cyan-500/30'
          : isCrit
          ? 'bg-[#200b14] border-2 border-rose-500 shadow-xl shadow-rose-950/60 animate-pulse'
          : isWarn
          ? 'bg-[#1e1708] border border-amber-500/70 shadow-md shadow-amber-950/40'
          : 'bg-[#0a1020]/90 border border-cyan-500/30 hover:border-cyan-400 hover:bg-[#0e172a]'
      }`}
      style={{ width: '150px', height: '185px' }}
      title={`${server.name} (${server.ip}) - Clique para detalhes, duplo-clique para Terminal`}
    >
      {/* 42U Rack Header */}
      <div className="flex items-center justify-between pb-1 border-b border-white/10 text-[10px] font-mono">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
          <span className="font-bold text-white truncate max-w-[85px]">{server.name}</span>
        </div>
        <span className="text-slate-400 text-[9px] font-semibold">{server.rackId}</span>
      </div>

      {/* Rack Interior Blade Units (3 Blades representation) */}
      <div className="space-y-1.5 my-1">
        {/* Blade Unit 1: CPU & Fans */}
        <div className="p-1 rounded bg-black/60 border border-white/5 flex items-center justify-between text-[9px] font-mono">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[8px]">CPU</span>
            <span className={`font-bold ${isCrit ? 'text-rose-400' : isWarn ? 'text-amber-400' : 'text-cyan-300'}`}>
              {cpu}%
            </span>
          </div>
          {/* Animated Fan Rotor */}
          <div className="flex items-center gap-1 text-[8px] text-slate-400">
            <svg 
              className="w-3.5 h-3.5 text-cyan-400 animate-spin"
              style={{ animationDuration: fanDuration }}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            <span>{temp}°C</span>
          </div>
        </div>

        {/* Blade Unit 2: RAM Bar */}
        <div className="p-1 rounded bg-black/60 border border-white/5 text-[8px] font-mono">
          <div className="flex justify-between text-slate-300 mb-0.5">
            <span>RAM</span>
            <span className={ram > 85 ? 'text-rose-400 font-bold' : 'text-purple-300'}>{ram}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${isCrit ? 'bg-rose-500' : isWarn ? 'bg-amber-500' : 'bg-purple-500'}`}
              style={{ width: `${ram}%` }}
            />
          </div>
        </div>

        {/* Blade Unit 3: LED Server Matrix */}
        <div className="p-1 rounded bg-black/70 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${isCrit ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[8px] font-mono text-slate-400">{server.slotUnit}</span>
        </div>
      </div>

      {/* Rack Footer / Quick Status */}
      <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[9px] font-mono">
        <span className={`px-1.5 py-0.2 rounded font-bold ${
          isCrit ? 'bg-rose-950 text-rose-300 border border-rose-500/50' :
          isWarn ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
        }`}>
          {server.status.toUpperCase()}
        </span>
        <span className="text-[8px] text-cyan-400 hover:underline">CLI SSH</span>
      </div>

      {/* Heat / Critical Alert Spark overlay */}
      {isCrit && (
        <div className="absolute -top-2 -right-2 bg-rose-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-lg animate-bounce">
          CRIT
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. KUBERNETES POD SPRITE (ISOMETRIC & ANIMATED)
// ==========================================
export const K8sPodSprite: React.FC<{
  pod: K8sPod;
  isSelected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
}> = ({ pod, isSelected, onClick, onDoubleClick }) => {
  const isCrash = pod.phase === 'CrashLoopBackOff' || pod.status === 'critical';
  const isPending = pod.phase === 'Pending';
  const isRunning = pod.phase === 'Running';

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick();
      }}
      className={`relative group cursor-pointer transition-all duration-200 rounded-xl p-2.5 flex flex-col justify-between select-none ${
        isSelected
          ? 'ring-2 ring-violet-400 bg-[#160d2e] shadow-lg shadow-violet-500/30'
          : isCrash
          ? 'bg-[#220a16] border-2 border-rose-500 shadow-xl shadow-rose-950/60 animate-pulse'
          : 'bg-[#0d091e]/90 border border-violet-500/30 hover:border-violet-400 hover:bg-[#130d2a]'
      }`}
      style={{ width: '150px', height: '135px' }}
      title={`${pod.name} (${pod.namespace}) - Clique para detalhes, duplo-clique para Logs`}
    >
      {/* Pod Top Bar */}
      <div className="flex items-center justify-between pb-1 border-b border-white/10 text-[10px] font-mono">
        <div className="flex items-center gap-1 overflow-hidden">
          {/* Kubernetes Hex Pod Icon */}
          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] font-bold ${
            isCrash ? 'bg-rose-950 text-rose-400 border border-rose-500' : 'bg-violet-950 text-violet-300 border border-violet-500/40'
          }`}>
            ☸
          </div>
          <span className="font-bold text-white truncate max-w-[85px]">{pod.name}</span>
        </div>
      </div>

      {/* Pod Metrics & Container Status */}
      <div className="space-y-1 my-1 text-[9px] font-mono">
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-500">Node:</span>
          <span className="text-slate-300 truncate max-w-[70px]">{pod.nodeName}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-500">Restarts:</span>
          <span className={pod.restarts > 0 ? 'text-amber-400 font-bold' : 'text-slate-300'}>{pod.restarts}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-500">CPU/Mem:</span>
          <span className="text-violet-300">{pod.metrics.cpuMillicores}m / {pod.metrics.memoryMb}M</span>
        </div>
      </div>

      {/* Pod Footer */}
      <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[8px] font-mono">
        <span className={`px-1.5 py-0.2 rounded font-bold ${
          isCrash ? 'bg-rose-950 text-rose-300 border border-rose-500/50' :
          isPending ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
        }`}>
          {pod.phase}
        </span>
        <span className="text-violet-400 hover:underline">kubectl</span>
      </div>

      {/* Smoke / Crash indicator */}
      {isCrash && (
        <div className="absolute -top-2 -right-2 bg-rose-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-lg animate-bounce">
          OOM
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. DATABASE CYLINDER STORAGE SPRITE
// ==========================================
export const DatabaseSprite: React.FC<{
  database: ITDatabaseNode;
  isSelected: boolean;
  onClick: () => void;
}> = ({ database, isSelected, onClick }) => {
  const isWarn = database.status === 'warning';
  const isCrit = database.status === 'critical';

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`relative group cursor-pointer transition-all duration-200 rounded-xl p-2.5 flex flex-col justify-between select-none ${
        isSelected
          ? 'ring-2 ring-amber-400 bg-[#241708] shadow-lg shadow-amber-500/30'
          : isCrit
          ? 'bg-[#220a16] border-2 border-rose-500 animate-pulse'
          : isWarn
          ? 'bg-[#1f1506] border border-amber-500/70'
          : 'bg-[#120d06]/90 border border-amber-500/30 hover:border-amber-400 hover:bg-[#1a1309]'
      }`}
      style={{ width: '160px', height: '145px' }}
      title={`${database.name} (${database.engine}) - Clique para métricas SQL`}
    >
      <div className="flex items-center justify-between pb-1 border-b border-white/10 text-[10px] font-mono">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="text-amber-400 text-xs">🗄️</span>
          <span className="font-bold text-amber-300 truncate max-w-[95px]">{database.name}</span>
        </div>
        <span className={`w-2 h-2 rounded-full ${isCrit ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
      </div>

      <div className="space-y-1 my-1 text-[9px] font-mono text-slate-300">
        <div className="flex justify-between">
          <span className="text-slate-500">Engine:</span>
          <span className="text-white font-bold">{database.engine}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">QPS:</span>
          <b className="text-amber-400">{database.qps} req/s</b>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Conexões:</span>
          <b>{database.activeConnections} / {database.maxConnections}</b>
        </div>
      </div>

      <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[8px] font-mono">
        <span className="text-emerald-400 bg-emerald-950/60 px-1 py-0.2 rounded">
          Lag: {database.replicationLagMs}ms
        </span>
        <span className="text-slate-400">Hit {database.cacheHitRatio}%</span>
      </div>
    </div>
  );
};

// ==========================================
// 4. NETWORK SWITCH & ROUTER SPRITE
// ==========================================
export const NetworkDeviceSprite: React.FC<{
  device: ITNetworkDevice;
  isSelected: boolean;
  onClick: () => void;
}> = ({ device, isSelected, onClick }) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`relative group cursor-pointer transition-all duration-200 rounded-xl p-2.5 flex flex-col justify-between select-none ${
        isSelected
          ? 'ring-2 ring-emerald-400 bg-[#091a14] shadow-lg shadow-emerald-500/30'
          : 'bg-[#06140f]/90 border border-emerald-500/30 hover:border-emerald-400 hover:bg-[#0a1f18]'
      }`}
      style={{ width: '160px', height: '140px' }}
      title={`${device.name} - ${device.throughputMbps} Mbps`}
    >
      <div className="flex items-center justify-between pb-1 border-b border-white/10 text-[10px] font-mono">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="text-emerald-400 text-xs">🌐</span>
          <span className="font-bold text-emerald-300 truncate max-w-[95px]">{device.name}</span>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      {/* Ethernet Port Blinking LEDs */}
      <div className="my-1 p-1 bg-black/60 rounded border border-white/5">
        <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 mb-1">
          <span>PORTAS 10G/25G</span>
          <span className="text-emerald-300 font-bold">UP</span>
        </div>
        <div className="grid grid-cols-6 gap-1">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <span
              key={i}
              className={`h-2 rounded-xs ${i % 2 === 0 ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>

      <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[8px] font-mono">
        <span className="text-slate-300 font-bold">{device.throughputMbps} Mbps</span>
        <span className="text-emerald-400">{device.latencyMs}ms ping</span>
      </div>
    </div>
  );
};

// ==========================================
// 5. HUMAN OPERATOR / ENGINEER CHARACTER SPRITE
// ==========================================
export const HumanCharacterSprite: React.FC<{
  employee: ITEmployee;
  isSelected: boolean;
  hasIncidentNearby?: boolean;
  onClick: () => void;
}> = ({ employee, isSelected, hasIncidentNearby, onClick }) => {
  const isWorking = employee.status === 'working';
  
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`relative group cursor-pointer transition-all duration-300 flex flex-col items-center select-none ${
        isSelected ? 'scale-105' : 'hover:scale-105'
      }`}
      style={{ width: '130px' }}
      title={`${employee.name} (${employee.role}) - Clique para inspecionar`}
    >
      {/* Speech / Activity Bubble */}
      <div className={`mb-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold max-w-[125px] truncate border shadow-md ${
        hasIncidentNearby
          ? 'bg-rose-950 text-rose-300 border-rose-500 animate-bounce'
          : 'bg-black/80 text-cyan-300 border-cyan-500/40 backdrop-blur-xs'
      }`}>
        {hasIncidentNearby ? '⚠️ War Room!' : employee.statusMessage || 'Monitorando...'}
      </div>

      {/* Desk & Multi-Monitor Setup */}
      <div className="relative p-2 rounded-2xl bg-[#0a1122]/90 border border-cyan-500/30 hover:border-cyan-400 shadow-xl flex flex-col items-center">
        {/* Curved Monitors */}
        <div className="flex items-center gap-1 mb-1.5">
          <div className="w-5 h-3.5 rounded-xs bg-cyan-950 border border-cyan-400/60 flex items-center justify-center">
            <span className="w-2.5 h-1 bg-cyan-400/80 animate-pulse rounded-xs" />
          </div>
          <div className={`w-7 h-4 rounded-xs border flex items-center justify-center ${
            hasIncidentNearby ? 'bg-rose-950 border-rose-500 animate-pulse' : 'bg-slate-950 border-cyan-400'
          }`}>
            <span className={`w-4 h-1.5 rounded-xs ${hasIncidentNearby ? 'bg-rose-400' : 'bg-emerald-400 animate-pulse'}`} />
          </div>
          <div className="w-5 h-3.5 rounded-xs bg-cyan-950 border border-cyan-400/60 flex items-center justify-center">
            <span className="w-2.5 h-1 bg-purple-400/80 rounded-xs" />
          </div>
        </div>

        {/* Character Avatar / Typing Figure */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400/60 overflow-hidden bg-slate-800 shadow-inner">
            <img 
              src={employee.avatarUrl} 
              alt={employee.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          {/* Status Dot */}
          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
            hasIncidentNearby ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'
          }`} />
        </div>

        {/* Character Name & Role */}
        <div className="mt-1 text-center">
          <div className="text-[10px] font-bold font-mono text-white truncate max-w-[105px]">
            {employee.name}
          </div>
          <div className="text-[8px] text-slate-400 font-sans truncate max-w-[105px]">
            {employee.role}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. AI ROBOT AGENT SPRITE (AUTONOMOUS & ANIMATED)
// ==========================================
export const AIAgentSprite: React.FC<{
  agent: ITAIAgent;
  isSelected: boolean;
  isInvestigating?: boolean;
  targetCoords?: { x: number; y: number };
  onClick: () => void;
}> = ({ agent, isSelected, isInvestigating, targetCoords, onClick }) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`relative group cursor-pointer transition-all duration-300 flex flex-col items-center select-none ${
        isSelected ? 'scale-110' : 'hover:scale-105'
      }`}
      style={{ width: '140px' }}
      title={`${agent.name} (${agent.role}) - Clique para logs do Agente IA`}
    >
      {/* Floating Status / Scanning Bubble */}
      <div className={`mb-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold max-w-[135px] truncate border shadow-lg ${
        isInvestigating
          ? 'bg-purple-950 text-purple-200 border-purple-400 animate-bounce'
          : 'bg-black/80 text-purple-300 border-purple-500/40 backdrop-blur-xs'
      }`}>
        {isInvestigating ? '⚡ Auto-Heal Ativo' : agent.statusMessage || 'Vigilância IA'}
      </div>

      {/* Autonomous Robot Body */}
      <div className={`relative p-2.5 rounded-2xl border shadow-2xl flex flex-col items-center ${
        isInvestigating 
          ? 'bg-[#1b0a2a]/95 border-purple-400 shadow-purple-900/60 ring-2 ring-purple-400/50' 
          : 'bg-[#10061e]/90 border-purple-500/30 hover:border-purple-400 shadow-purple-950/40'
      }`}>
        {/* Robot Visor / Neural Core Glowing Orb */}
        <div className="relative mb-1">
          <div className="w-10 h-10 rounded-2xl bg-purple-950 border-2 border-purple-400 flex items-center justify-center text-lg shadow-inner">
            🤖
          </div>
          {/* Animated Scanning Laser Dot */}
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
        </div>

        {/* Agent Info */}
        <div className="text-center">
          <div className="text-[10px] font-bold font-mono text-purple-300 truncate max-w-[115px]">
            {agent.name}
          </div>
          <div className="text-[8px] text-emerald-400 font-mono">
            {agent.accuracyRate}% precisão
          </div>
        </div>

        {/* Scanning Laser Beam Effect when investigating */}
        {isInvestigating && (
          <div className="absolute -bottom-6 w-12 h-6 pointer-events-none flex items-center justify-center">
            <span className="w-10 h-1 bg-cyan-400 shadow-lg shadow-cyan-400 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};
