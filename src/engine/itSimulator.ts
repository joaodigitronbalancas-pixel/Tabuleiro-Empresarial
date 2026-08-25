import { 
  ITServerNode, 
  K8sCluster, 
  ITDatabaseNode, 
  ITNetworkDevice, 
  ITSecurityNode, 
  ITIncident, 
  ITLog, 
  LiveEvent, 
  AlertItem, 
  ITAIAgent, 
  ITMacroStats 
} from '../types';

export interface TelemetryDelta {
  servers: ITServerNode[];
  k8sClusters: K8sCluster[];
  databases: ITDatabaseNode[];
  networks: ITNetworkDevice[];
  security: ITSecurityNode[];
  incidents: ITIncident[];
  logs: ITLog[];
  events: LiveEvent[];
  alerts: AlertItem[];
  aiAgents: ITAIAgent[];
  macroStats: ITMacroStats;
}

class ITSimulator {
  private isRunning: boolean = false;
  private intervalId: any = null;
  private logSeq: number = 100;
  private listeners: ((delta: TelemetryDelta) => void)[] = [];

  // Current working state inside simulator
  private servers: ITServerNode[] = [];
  private k8sClusters: K8sCluster[] = [];
  private databases: ITDatabaseNode[] = [];
  private networks: ITNetworkDevice[] = [];
  private security: ITSecurityNode[] = [];
  private incidents: ITIncident[] = [];
  private logs: ITLog[] = [];
  private events: LiveEvent[] = [];
  private alerts: AlertItem[] = [];
  private aiAgents: ITAIAgent[] = [];
  private macroStats: ITMacroStats | null = null;

  public init(initial: {
    servers: ITServerNode[];
    k8sClusters: K8sCluster[];
    databases: ITDatabaseNode[];
    networks: ITNetworkDevice[];
    security: ITSecurityNode[];
    incidents: ITIncident[];
    logs: ITLog[];
    events: LiveEvent[];
    alerts: AlertItem[];
    aiAgents: ITAIAgent[];
    macroStats: ITMacroStats;
  }) {
    this.servers = JSON.parse(JSON.stringify(initial.servers));
    this.k8sClusters = JSON.parse(JSON.stringify(initial.k8sClusters));
    this.databases = JSON.parse(JSON.stringify(initial.databases));
    this.networks = JSON.parse(JSON.stringify(initial.networks));
    this.security = JSON.parse(JSON.stringify(initial.security));
    this.incidents = JSON.parse(JSON.stringify(initial.incidents));
    this.logs = JSON.parse(JSON.stringify(initial.logs));
    this.events = JSON.parse(JSON.stringify(initial.events));
    this.alerts = JSON.parse(JSON.stringify(initial.alerts));
    this.aiAgents = JSON.parse(JSON.stringify(initial.aiAgents));
    this.macroStats = JSON.parse(JSON.stringify(initial.macroStats));
  }

  public subscribe(callback: (delta: TelemetryDelta) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;

    this.intervalId = setInterval(() => {
      this.tick();
    }, 1800);
  }

  public stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tick() {
    const now = new Date();
    const timeFormatted = now.toTimeString().split(' ')[0];

    // 1. Oscillate Server Metrics
    this.servers = this.servers.map(server => {
      const isCrit = server.status === 'critical';
      const isWarn = server.status === 'warning';

      // Fluctuations
      const cpuDelta = (Math.random() - 0.48) * 3.5;
      const ramDelta = (Math.random() - 0.48) * 1.5;
      const netDelta = (Math.random() - 0.5) * 40;
      const reqDelta = (Math.random() - 0.5) * 120;

      let newCpu = Math.max(10, Math.min(99.5, server.metrics.cpuUsage + cpuDelta));
      let newRam = Math.max(20, Math.min(98.0, server.metrics.ramUsage + ramDelta));
      let newNet = Math.max(80, server.metrics.networkThroughputMbps + netDelta);
      let newReq = Math.max(100, Math.round(server.metrics.requestsPerSec + reqDelta));
      let newLat = isCrit ? Math.round(85 + Math.random() * 25) : isWarn ? Math.round(12 + Math.random() * 8) : Math.round(4 + Math.random() * 6);

      if (isCrit) {
        newCpu = Math.max(90, Math.min(99.4, newCpu));
        newRam = Math.max(88, Math.min(96.0, newRam));
      } else if (isWarn) {
        newCpu = Math.max(72, Math.min(84.0, newCpu));
      }

      return {
        ...server,
        lastUpdated: 'agora',
        metrics: {
          ...server.metrics,
          cpuUsage: Number(newCpu.toFixed(1)),
          ramUsage: Number(newRam.toFixed(1)),
          networkThroughputMbps: Number(newNet.toFixed(0)),
          requestsPerSec: newReq,
          latencyMs: newLat
        }
      };
    });

    // 2. Oscillate Database Metrics
    this.databases = this.databases.map(db => {
      const qpsDelta = (Math.random() - 0.5) * 200;
      const connDelta = Math.floor((Math.random() - 0.5) * 6);
      return {
        ...db,
        qps: Math.max(100, Math.round(db.qps + qpsDelta)),
        activeConnections: Math.max(10, Math.min(db.maxConnections, db.activeConnections + connDelta)),
        metrics: {
          ...db.metrics,
          cpuUsage: Number((db.metrics.cpuUsage + (Math.random() - 0.5) * 2).toFixed(1)),
          ramUsage: Number((db.metrics.ramUsage + (Math.random() - 0.5) * 1).toFixed(1))
        }
      };
    });

    // 3. Oscillate Network Throughput
    this.networks = this.networks.map(net => {
      const tpDelta = (Math.random() - 0.5) * 150;
      return {
        ...net,
        throughputMbps: Math.max(500, Math.round(net.throughputMbps + tpDelta)),
        activeSockets: Math.max(1000, Math.round(net.activeSockets + (Math.random() - 0.5) * 50))
      };
    });

    // 4. Periodically Generate IT Telemetry Logs
    const logCandidates = [
      { level: 'INFO', source: 'srv-prod-01', service: 'nginx', msg: `HTTP 200 GET /api/v2/telemetry ${(Math.random() * 3 + 1).toFixed(1)}ms` },
      { level: 'DEBUG', source: 'db-pg-primary', service: 'PostgreSQL', msg: `Query latency avg ${(Math.random() * 1.5 + 0.8).toFixed(2)}ms across 184 conns` },
      { level: 'INFO', source: 'net-router-core', service: 'BGP', msg: `BGP prefix sync healthy: 48,219 routes active across uplinks` },
      { level: 'INFO', source: 'node-02', service: 'worker-queue', msg: `Job batch completed: ${Math.floor(Math.random() * 50 + 10)} tasks dispatched` },
      { level: 'WARN', source: 'node-03', service: 'payment-api', msg: `High thread contention in JVM pool (node-03 memory > 90%)` },
      { level: 'INFO', source: 'sec-waf-cloudflare', service: 'WAF', msg: `Blocked scanner bot probe on /api/v1/.env [Rule 4091]` }
    ];

    const randomLog = logCandidates[Math.floor(Math.random() * logCandidates.length)];
    this.logSeq++;
    const newLogItem: ITLog = {
      id: `log-${this.logSeq}`,
      timestamp: timeFormatted,
      level: randomLog.level as any,
      source: randomLog.source,
      service: randomLog.service,
      message: randomLog.msg
    };

    this.logs = [newLogItem, ...this.logs.slice(0, 80)];

    // 5. Update Macro Statistics
    if (this.macroStats) {
      const activeCrits = this.incidents.filter(i => i.status !== 'resolved' && i.severity === 'critical').length;
      const activeWarns = this.alerts.filter(a => a.status === 'active' && a.severity === 'warning').length;
      const totalNetGbps = Number((this.networks.reduce((acc, n) => acc + n.throughputMbps, 0) / 1000).toFixed(2));
      const avgLat = Math.round(this.servers.reduce((acc, s) => acc + s.metrics.latencyMs, 0) / this.servers.length);

      this.macroStats = {
        ...this.macroStats,
        activeCriticalIncidents: activeCrits,
        activeWarnings: activeWarns,
        totalNetworkThroughputGbps: totalNetGbps,
        averageLatencyMs: avgLat,
        healthyServers: this.servers.filter(s => s.status === 'healthy').length
      };
    }

    // 6. Notify subscribers
    const delta: TelemetryDelta = {
      servers: this.servers,
      k8sClusters: this.k8sClusters,
      databases: this.databases,
      networks: this.networks,
      security: this.security,
      incidents: this.incidents,
      logs: this.logs,
      events: this.events,
      alerts: this.alerts,
      aiAgents: this.aiAgents,
      macroStats: this.macroStats!
    };

    this.listeners.forEach(cb => cb(delta));
  }

  // Action: Resolve Incident
  public resolveIncident(incidentId: string) {
    const timeFormatted = new Date().toTimeString().split(' ')[0];
    this.incidents = this.incidents.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'resolved',
          resolvedAt: timeFormatted,
          investigationSteps: [
            ...inc.investigationSteps,
            { step: '5. Remediação executada e validada com sucesso', status: 'completed', result: 'Serviço restabelecido 100%', timestamp: timeFormatted }
          ]
        };
      }
      return inc;
    });

    // Heal server-prod-03 if it was the target
    this.servers = this.servers.map(srv => {
      if (srv.id === 'srv-prod-03' || srv.name === 'server-prod-03') {
        return {
          ...srv,
          status: 'healthy',
          activeAlerts: [],
          metrics: {
            ...srv.metrics,
            cpuUsage: 36.4,
            ramUsage: 58.2,
            latencyMs: 6,
            errorRate: 0.0
          }
        };
      }
      return srv;
    });

    // Heal pod payment-55fd
    this.k8sClusters = this.k8sClusters.map(cluster => ({
      ...cluster,
      status: 'healthy',
      pods: cluster.pods.map(pod => {
        if (pod.id === 'pod-payment-55fd' || pod.name.includes('payment')) {
          return {
            ...pod,
            status: 'healthy',
            phase: 'Running',
            restarts: pod.restarts,
            metrics: { cpuMillicores: 120, memoryMb: 740 },
            lastLogSnippet: '200 POST /v1/checkout/charge - 22ms [Healthy]'
          };
        }
        return pod;
      }),
      nodes: cluster.nodes.map(node => {
        if (node.id === 'node-03') {
          return {
            ...node,
            status: 'healthy',
            metrics: {
              ...node.metrics,
              cpuUsage: 36.4,
              ramUsage: 58.2,
              latencyMs: 6,
              errorRate: 0.0
            }
          };
        }
        return node;
      })
    }));

    // Resolve alerts
    this.alerts = this.alerts.map(a => {
      if (a.targetId === 'srv-prod-03' || a.title.includes('payment-55fd')) {
        return { ...a, status: 'resolved' };
      }
      return a;
    });

    // Emit event
    const newEvt: LiveEvent = {
      id: `evt-${Date.now()}`,
      timestamp: timeFormatted,
      timeFormatted,
      type: 'incident_resolved',
      title: 'Incidente de Pagamentos Resolvido!',
      description: 'Nó node-03 e Pod payment restabelecidos em estado HEALTHY.',
      severity: 'success',
      departmentId: 'kubernetes',
      targetName: 'server-prod-03'
    };
    this.events = [newEvt, ...this.events];

    // Push log
    this.logs = [
      {
        id: `log-${Date.now()}`,
        timestamp: timeFormatted,
        level: 'INFO',
        source: 'SRE-Autopilot',
        service: 'Orchestrator',
        message: `Incident ${incidentId} resolved successfully. Telemetry back to nominal.`
      },
      ...this.logs
    ];

    this.tick();
  }
}

export const itSimulator = new ITSimulator();
