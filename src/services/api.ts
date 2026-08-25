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
  AlertItem,
  LiveEvent,
  ITMacroStats,
  ITDepartment,
  ITCommandAudit
} from '../types';

const API_BASE = '/api';

class ITMonitoringApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(`Timeout ao conectar com a API em ${endpoint}`);
      }
      throw err;
    }
  }

  // HEALTH & STATE
  public async checkHealth(): Promise<{ status: string; uptime: number; mode: string }> {
    return this.request('/health');
  }

  public async getFullState(): Promise<{
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
  }> {
    return this.request('/state');
  }

  public async resetState(): Promise<void> {
    return this.request('/state/reset', { method: 'POST' });
  }

  // REALTIME SSE STREAM
  public subscribeToEvents(
    onMessage: (type: string, payload: any) => void,
    onStatusChange?: (status: 'connected' | 'disconnected' | 'connecting') => void
  ): () => void {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: any = null;
    let isClosed = false;

    const connect = () => {
      if (isClosed) return;
      onStatusChange?.('connecting');

      try {
        eventSource = new EventSource('/api/events/stream');

        eventSource.onopen = () => {
          onStatusChange?.('connected');
        };

        eventSource.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data.type) {
              onMessage(data.type, data.payload);
            }
          } catch (err) {
            console.warn('[CompanyOS SSE] Failed to parse SSE message:', err);
          }
        };

        eventSource.onerror = () => {
          onStatusChange?.('disconnected');
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          if (!isClosed) {
            reconnectTimeout = setTimeout(connect, 3000);
          }
        };
      } catch (err) {
        onStatusChange?.('disconnected');
        if (!isClosed) {
          reconnectTimeout = setTimeout(connect, 4000);
        }
      }
    };

    connect();

    return () => {
      isClosed = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (eventSource) {
        eventSource.close();
      }
    };
  }

  // SERVERS
  public async getServers(): Promise<ITServerNode[]> {
    return this.request('/servers');
  }

  public async updateServer(id: string, patch: Partial<ITServerNode>): Promise<ITServerNode> {
    return this.request(`/servers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch)
    });
  }

  // INCIDENTS
  public async getIncidents(): Promise<ITIncident[]> {
    return this.request('/incidents');
  }

  public async resolveIncident(id: string): Promise<ITIncident> {
    return this.request(`/incidents/${id}/resolve`, {
      method: 'POST'
    });
  }
}

export const itApi = new ITMonitoringApiService();
