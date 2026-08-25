import {
  ITServerNode,
  K8sCluster,
  ITDatabaseNode,
  ITNetworkDevice,
  ITSecurityNode,
  ITDevOpsPipeline,
  ITIncident,
  ITLog,
  ITEmployee,
  ITAIAgent,
  LiveEvent,
  AlertItem,
  ITMacroStats,
  ITDepartment,
  ITCommandAudit
} from '../src/types';

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
} from '../src/mock/initialData';

export interface ITBackendState {
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
  auditLogs: ITCommandAudit[];
}

export class InMemoryDataStore {
  private state: ITBackendState;
  private sseClients: Set<(data: string) => void> = new Set();

  constructor() {
    this.state = this.createInitialState();
  }

  private createInitialState(): ITBackendState {
    return {
      macroStats: JSON.parse(JSON.stringify(INITIAL_MACRO_STATS)),
      departments: JSON.parse(JSON.stringify(INITIAL_DEPARTMENTS)),
      servers: JSON.parse(JSON.stringify(INITIAL_SERVERS)),
      k8sClusters: JSON.parse(JSON.stringify(INITIAL_K8S_CLUSTERS)),
      databases: JSON.parse(JSON.stringify(INITIAL_DATABASES)),
      networks: JSON.parse(JSON.stringify(INITIAL_NETWORKS)),
      security: JSON.parse(JSON.stringify(INITIAL_SECURITY)),
      pipelines: JSON.parse(JSON.stringify(INITIAL_PIPELINES)),
      incidents: JSON.parse(JSON.stringify(INITIAL_INCIDENTS)),
      logs: JSON.parse(JSON.stringify(INITIAL_LOGS)),
      events: JSON.parse(JSON.stringify(INITIAL_EVENTS)),
      alerts: JSON.parse(JSON.stringify(INITIAL_ALERTS)),
      employees: JSON.parse(JSON.stringify(INITIAL_EMPLOYEES)),
      aiAgents: JSON.parse(JSON.stringify(INITIAL_AI_AGENTS)),
      auditLogs: JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS))
    };
  }

  public resetState(): ITBackendState {
    this.state = this.createInitialState();
    this.broadcastSSE('state.reset', { message: 'Database reset to initial IT monitoring state' });
    return this.getState();
  }

  public getState(): ITBackendState {
    return this.state;
  }

  // SSE STREAMING
  public addSSEClient(clientSender: (data: string) => void): () => void {
    this.sseClients.add(clientSender);
    return () => {
      this.sseClients.delete(clientSender);
    };
  }

  public broadcastSSE(eventType: string, payload: any) {
    const message = JSON.stringify({ type: eventType, payload, timestamp: new Date().toISOString() });
    for (const send of this.sseClients) {
      try {
        send(message);
      } catch (err) {
        // Client might have disconnected
      }
    }
  }

  public pushEvent(event: Omit<LiveEvent, 'id' | 'timestamp' | 'timeFormatted'> & Partial<Pick<LiveEvent, 'id' | 'timestamp' | 'timeFormatted'>>): LiveEvent {
    const fullEvent: LiveEvent = {
      id: event.id || `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: event.timestamp || new Date().toISOString(),
      timeFormatted: event.timeFormatted || 'Agora',
      type: event.type,
      title: event.title,
      description: event.description,
      severity: event.severity,
      departmentId: event.departmentId,
      targetName: event.targetName,
      metadata: event.metadata
    };

    this.state.events.unshift(fullEvent);
    if (this.state.events.length > 200) {
      this.state.events.pop();
    }

    this.broadcastSSE('event', fullEvent);
    return fullEvent;
  }

  // SERVERS
  public getServers(): ITServerNode[] {
    return this.state.servers;
  }

  public updateServer(id: string, patch: Partial<ITServerNode>): ITServerNode | null {
    const idx = this.state.servers.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.state.servers[idx] = { ...this.state.servers[idx], ...patch };
    this.broadcastSSE('server.updated', this.state.servers[idx]);
    return this.state.servers[idx];
  }

  // INCIDENTS
  public getIncidents(): ITIncident[] {
    return this.state.incidents;
  }

  public resolveIncident(id: string): ITIncident | null {
    const idx = this.state.incidents.findIndex(i => i.id === id);
    if (idx === -1) return null;
    this.state.incidents[idx].status = 'resolved';
    this.state.incidents[idx].resolvedAt = new Date().toTimeString().split(' ')[0];
    this.broadcastSSE('incident.resolved', this.state.incidents[idx]);
    return this.state.incidents[idx];
  }
}

export const dataStore = new InMemoryDataStore();
