import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ITDepartment,
  ITServerNode,
  K8sCluster,
  K8sPod,
  ITDatabaseNode,
  ITNetworkDevice,
  ITSecurityNode,
  ITDevOpsPipeline,
  ITIncident,
  ITLog,
  ITEmployee,
  ITAIAgent,
  Personnel,
  LiveEvent,
  AlertItem,
  ITMacroStats,
  ITCommandAudit,
  UserRole,
  CommandActionType,
  DirectEntityCommandPayload,
  ApprovalRequest,
  AutomationRule,
  UserCommand,
  ITDepartmentId,
  ITResourceType
} from '../types';
import { 
  INITIAL_DEPARTMENTS,
  INITIAL_SERVERS,
  INITIAL_K8S_CLUSTERS,
  INITIAL_DATABASES,
  INITIAL_NETWORKS,
  INITIAL_SECURITY,
  INITIAL_PIPELINES,
  INITIAL_INCIDENTS,
  INITIAL_LOGS,
  INITIAL_EMPLOYEES,
  INITIAL_AI_AGENTS,
  INITIAL_EVENTS,
  INITIAL_ALERTS,
  INITIAL_MACRO_STATS,
  INITIAL_AUDIT_LOGS
} from '../mock/initialData';
import { itSimulator } from '../engine/itSimulator';
import { ITCommandEngine, TerminalExecutionResult } from '../engine/itCommandEngine';
import { soundManager } from '../utils/soundEffects';

interface ITContextType {
  // Global IT Telemetry & Macro Stats
  macroStats: ITMacroStats;
  departments: ITDepartment[];
  servers: ITServerNode[];
  k8sClusters: K8sCluster[];
  databases: ITDatabaseNode[];
  networks: ITNetworkDevice[];
  security: ITSecurityNode[];
  pipelines: ITDevOpsPipeline[];
  incidents: ITIncident[];
  logs: ITLog[];
  events: LiveEvent[];
  alerts: AlertItem[];
  employees: ITEmployee[];
  aiAgents: ITAIAgent[];
  allPersonnel: Personnel[];
  auditLogs: ITCommandAudit[];

  // RBAC Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Selected Target / Entity Inspector
  selectedEntity: any | null;
  selectedEntityType: ITResourceType | null;
  setSelectedEntity: (entity: any | null, type?: ITResourceType | null) => void;
  clearSelection: () => void;

  // Terminal Modal state & Execution
  isTerminalOpen: boolean;
  setIsTerminalOpen: (open: boolean) => void;
  terminalTarget: { id: string; name: string; type: string } | null;
  openTerminalForTarget: (target: { id: string; name: string; type: string }) => void;
  executeTerminalCommand: (cmd: string) => TerminalExecutionResult;

  // Modals & Navigation Overlays
  activeOverlayModal: 'none' | 'topology' | 'k8s_explorer' | 'datacenter_racks' | 'incidents' | 'logs' | 'audit' | 'command_center';
  setActiveOverlayModal: (modal: 'none' | 'topology' | 'k8s_explorer' | 'datacenter_racks' | 'incidents' | 'logs' | 'audit' | 'command_center') => void;

  // Natural Language Command Execution (Ctrl+K)
  executeNaturalCommand: (rawText: string, confirm?: boolean) => Promise<{
    success: boolean;
    message: string;
    requiresConfirmation?: boolean;
    confirmationMessage?: string;
    suggestedExecution?: string;
  }>;

  // Quick Action Triggers
  resolveIncident: (incidentId: string) => void;
  rebootServer: (serverId: string) => Promise<string>;
  restartPod: (podId: string) => Promise<string>;
  runAiInvestigation: (targetName: string) => Promise<string>;
  pingTarget: (targetIp: string) => Promise<string>;
  toggleSirenAlert: () => void;
  isSirenActive: boolean;

  // Sound settings
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const ITContext = createContext<ITContextType | undefined>(undefined);

export const CompanyOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Core State
  const [macroStats, setMacroStats] = useState<ITMacroStats>(INITIAL_MACRO_STATS);
  const [departments, setDepartments] = useState<ITDepartment[]>(INITIAL_DEPARTMENTS);
  const [servers, setServers] = useState<ITServerNode[]>(INITIAL_SERVERS);
  const [k8sClusters, setK8sClusters] = useState<K8sCluster[]>(INITIAL_K8S_CLUSTERS);
  const [databases, setDatabases] = useState<ITDatabaseNode[]>(INITIAL_DATABASES);
  const [networks, setNetworks] = useState<ITNetworkDevice[]>(INITIAL_NETWORKS);
  const [security, setSecurity] = useState<ITSecurityNode[]>(INITIAL_SECURITY);
  const [pipelines, setPipelines] = useState<ITDevOpsPipeline[]>(INITIAL_PIPELINES);
  const [incidents, setIncidents] = useState<ITIncident[]>(INITIAL_INCIDENTS);
  const [logs, setLogs] = useState<ITLog[]>(INITIAL_LOGS);
  const [events, setEvents] = useState<LiveEvent[]>(INITIAL_EVENTS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [employees, setEmployees] = useState<ITEmployee[]>(INITIAL_EMPLOYEES);
  const [aiAgents, setAiAgents] = useState<ITAIAgent[]>(INITIAL_AI_AGENTS);
  const [auditLogs, setAuditLogs] = useState<ITCommandAudit[]>(INITIAL_AUDIT_LOGS);

  // RBAC
  const [currentRole, setCurrentRole] = useState<UserRole>('NOC_DIRECTOR');

  // Selected Entity
  const [selectedEntity, setSelectedEntityState] = useState<any | null>(null);
  const [selectedEntityType, setSelectedEntityType] = useState<ITResourceType | null>(null);

  // Terminal
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [terminalTarget, setTerminalTarget] = useState<{ id: string; name: string; type: string } | null>(null);

  // Active Overlay Modal
  const [activeOverlayModal, setActiveOverlayModal] = useState<'none' | 'topology' | 'k8s_explorer' | 'datacenter_racks' | 'incidents' | 'logs' | 'audit' | 'command_center'>('none');

  // Emergency Siren
  const [isSirenActive, setIsSirenActive] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Combine Personnel
  const allPersonnel = useMemo(() => [...employees, ...aiAgents], [employees, aiAgents]);

  // Init and run Simulator
  useEffect(() => {
    itSimulator.init({
      servers,
      k8sClusters,
      databases,
      networks,
      security,
      incidents,
      logs,
      events,
      alerts,
      aiAgents,
      macroStats
    });

    const unsubscribe = itSimulator.subscribe(delta => {
      setServers(delta.servers);
      setK8sClusters(delta.k8sClusters);
      setDatabases(delta.databases);
      setNetworks(delta.networks);
      setSecurity(delta.security);
      setIncidents(delta.incidents);
      setLogs(delta.logs);
      setEvents(delta.events);
      setAlerts(delta.alerts);
      setAiAgents(delta.aiAgents);
      setMacroStats(delta.macroStats);
    });

    itSimulator.start();
    return () => {
      unsubscribe();
      itSimulator.stop();
    };
  }, []);

  const setSelectedEntity = useCallback((entity: any | null, type?: ITResourceType | null) => {
    setSelectedEntityState(entity);
    setSelectedEntityType(type || null);
    if (entity && soundEnabled) {
      soundManager.playClick();
    }
  }, [soundEnabled]);

  const clearSelection = useCallback(() => {
    setSelectedEntityState(null);
    setSelectedEntityType(null);
  }, []);

  const openTerminalForTarget = useCallback((target: { id: string; name: string; type: string }) => {
    setTerminalTarget(target);
    setIsTerminalOpen(true);
    if (soundEnabled) soundManager.playOpenModal();
  }, [soundEnabled]);

  // Execute terminal CLI command
  const executeTerminalCommand = useCallback((cmd: string): TerminalExecutionResult => {
    const res = ITCommandEngine.executeTerminalCommand(cmd, terminalTarget || undefined);
    
    // Log to audit
    const timeFormatted = new Date().toTimeString().split(' ')[0];
    const newAudit: ITCommandAudit = {
      id: `aud-${Date.now()}`,
      timestamp: timeFormatted,
      user: 'admin',
      userRole: currentRole,
      command: cmd,
      targetId: terminalTarget?.id || 'localhost',
      targetName: terminalTarget?.name || 'localhost',
      targetType: (terminalTarget?.type as any) || 'server',
      result: res.exitCode === 0 ? 'success' : 'failed',
      exitCode: res.exitCode,
      outputSummary: res.output.slice(0, 100),
      durationMs: res.durationMs
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    if (res.actionTaken === 'ai_auto_remediate' && res.remediatedTarget) {
      itSimulator.resolveIncident(res.remediatedTarget);
    }

    return res;
  }, [terminalTarget, currentRole]);

  // Resolve Incident
  const resolveIncident = useCallback((incidentId: string) => {
    itSimulator.resolveIncident(incidentId);
    if (soundEnabled) soundManager.playTaskComplete();
  }, [soundEnabled]);

  // Quick Action: Reboot Server
  const rebootServer = useCallback(async (serverId: string): Promise<string> => {
    const srv = servers.find(s => s.id === serverId || s.name === serverId);
    const targetName = srv ? srv.name : serverId;
    
    // Push audit
    const timeFormatted = new Date().toTimeString().split(' ')[0];
    const newAudit: ITCommandAudit = {
      id: `aud-${Date.now()}`,
      timestamp: timeFormatted,
      user: 'admin',
      userRole: currentRole,
      command: `systemctl reboot (Graceful)`,
      targetId: serverId,
      targetName,
      targetType: 'server',
      result: 'success',
      exitCode: 0,
      outputSummary: `Broadcast message from root@${targetName}: The system is going down for reboot NOW!`,
      durationMs: 450
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    // Heal server in simulation
    setServers(prev => prev.map(s => {
      if (s.id === serverId || s.name === serverId) {
        return {
          ...s,
          status: 'healthy',
          activeAlerts: [],
          metrics: { ...s.metrics, cpuUsage: 24.0, ramUsage: 45.0, latencyMs: 5 }
        };
      }
      return s;
    }));

    return `Servidor ${targetName} reiniciado com sucesso. Status restabelecido para HEALTHY 🟢.`;
  }, [servers, currentRole]);

  // Quick Action: Restart Pod
  const restartPod = useCallback(async (podId: string): Promise<string> => {
    itSimulator.resolveIncident('inc-2026-001');
    return `Pod ${podId} reiniciado com novas alocações de memória. Status: Running 🟢.`;
  }, []);

  // Quick Action: AI Investigation
  const runAiInvestigation = useCallback(async (targetName: string): Promise<string> => {
    const res = ITCommandEngine.executeTerminalCommand(`ai-investigate ${targetName}`);
    return res.output;
  }, []);

  // Quick Action: Ping Target
  const pingTarget = useCallback(async (targetIp: string): Promise<string> => {
    const res = ITCommandEngine.executeTerminalCommand(`ping ${targetIp}`);
    return res.output;
  }, []);

  // Natural language command handler
  const executeNaturalCommand = useCallback(async (rawText: string, confirm: boolean = false) => {
    const parsed = ITCommandEngine.parseNaturalCommand(rawText);
    
    if (parsed.requiresConfirmation && !confirm) {
      return {
        success: false,
        message: 'Ação requer confirmação de segurança.',
        requiresConfirmation: true,
        confirmationMessage: parsed.confirmationMessage,
        suggestedExecution: parsed.suggestedExecution
      };
    }

    // Execute the action
    if (parsed.action === 'ai_auto_remediate') {
      itSimulator.resolveIncident('inc-2026-001');
      return {
        success: true,
        message: '🎉 Incidente inc-2026-001 auto-remediado com sucesso. Todos os nós estão saudáveis.'
      };
    }

    if (parsed.action === 'reboot_node') {
      await rebootServer(parsed.targetName || 'server-prod-03');
      return {
        success: true,
        message: `Servidor ${parsed.targetName} reiniciado e telemetria restabelecida.`
      };
    }

    const termRes = ITCommandEngine.executeTerminalCommand(parsed.suggestedExecution);
    return {
      success: true,
      message: `Executado: ${parsed.suggestedExecution}\n\n${termRes.output}`
    };
  }, [rebootServer]);

  const toggleSirenAlert = useCallback(() => {
    setIsSirenActive(prev => !prev);
  }, []);

  return (
    <ITContext.Provider
      value={{
        macroStats,
        departments,
        servers,
        k8sClusters,
        databases,
        networks,
        security,
        pipelines,
        incidents,
        logs,
        events,
        alerts,
        employees,
        aiAgents,
        allPersonnel,
        auditLogs,

        currentRole,
        setCurrentRole,

        selectedEntity,
        selectedEntityType,
        setSelectedEntity,
        clearSelection,

        isTerminalOpen,
        setIsTerminalOpen,
        terminalTarget,
        openTerminalForTarget,
        executeTerminalCommand,

        activeOverlayModal,
        setActiveOverlayModal,

        executeNaturalCommand,
        resolveIncident,
        rebootServer,
        restartPod,
        runAiInvestigation,
        pingTarget,
        toggleSirenAlert,
        isSirenActive,

        soundEnabled,
        setSoundEnabled
      }}
    >
      {children}
    </ITContext.Provider>
  );
};

export const useCompanyOS = () => {
  const context = useContext(ITContext);
  if (!context) {
    throw new Error('useCompanyOS must be used within a CompanyOSProvider');
  }
  return context;
};
