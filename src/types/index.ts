export type ITHealthStatus = 'healthy' | 'warning' | 'degraded' | 'critical' | 'offline' | 'maintenance';

export type ITDepartmentId = 
  | 'noc'
  | 'servers'
  | 'cloud'
  | 'kubernetes'
  | 'network'
  | 'database'
  | 'devops'
  | 'security'
  | 'suporte'
  | 'automation';

export type DepartmentId = ITDepartmentId;

export type ITResourceType = 
  | 'server'
  | 'cloud_node'
  | 'k8s_node'
  | 'k8s_pod'
  | 'container'
  | 'database'
  | 'router'
  | 'switch'
  | 'firewall'
  | 'load_balancer'
  | 'storage'
  | 'service'
  | 'pipeline'
  | 'ai_agent'
  | 'technician';

export interface ITDepartment {
  id: ITDepartmentId;
  name: string;
  code: string;
  color: string;
  leadName: string;
  leadRole: string;
  activeResourcesCount: number;
  healthScore: number; // 0 - 100
  headcount: number;
  aiAgentsCount: number;
  description: string;
  criticalAlerts: number;
  roomCoordinates: { x: number; y: number; width: number; height: number };
}

export type Department = ITDepartment;

export interface ITMetrics {
  cpuUsage: number; // % (0-100)
  ramUsage: number; // % (0-100)
  diskUsage: number; // % (0-100)
  networkThroughputMbps: number;
  latencyMs: number;
  packetsPerSec: number;
  requestsPerSec: number;
  errorRate: number; // %
  uptimePercentage: number;
  temperatureC?: number;
  load1m?: number;
  load5m?: number;
  load15m?: number;
  connectionsCount?: number;
  queueDepth?: number;
}

export interface ITServerNode {
  id: string;
  name: string;
  hostname: string;
  ip: string;
  rackId: string;
  slotUnit: string; // e.g. "U12-U14"
  os: string;
  environment: 'production' | 'staging' | 'edge' | 'dr';
  status: ITHealthStatus;
  metrics: ITMetrics;
  cores: number;
  totalRamGb: number;
  totalDiskGb: number;
  runningServices: string[];
  activeAlerts: string[];
  version: string;
  uptimeSeconds: number;
  lastUpdated: string;
  departmentId: ITDepartmentId;
}

export type ServerNode = ITServerNode;

export interface K8sContainer {
  name: string;
  image: string;
  ready: boolean;
  restartCount: number;
  state: 'running' | 'waiting' | 'terminated';
  memoryLimitMb: number;
  cpuLimitCores: number;
}

export interface K8sPod {
  id: string;
  name: string;
  namespace: string;
  nodeName: string;
  ip: string;
  status: ITHealthStatus;
  phase: 'Running' | 'Pending' | 'CrashLoopBackOff' | 'Failed' | 'Completed';
  restarts: number;
  age: string;
  containers: K8sContainer[];
  metrics: {
    cpuMillicores: number;
    memoryMb: number;
  };
  labels: Record<string, string>;
  lastLogSnippet?: string;
}

export interface K8sNode {
  id: string;
  name: string;
  cluster: string;
  ip: string;
  role: 'control-plane' | 'worker';
  status: ITHealthStatus;
  metrics: ITMetrics;
  podsCount: number;
  maxPods: number;
  kubeletVersion: string;
  osImage: string;
}

export interface K8sCluster {
  id: string;
  name: string;
  region: string;
  version: string;
  status: ITHealthStatus;
  nodes: K8sNode[];
  pods: K8sPod[];
  namespaces: string[];
}

export interface ITDatabaseNode {
  id: string;
  name: string;
  engine: 'PostgreSQL' | 'Redis Cluster' | 'MongoDB Shard' | 'Apache Kafka' | 'RabbitMQ';
  role: 'primary' | 'replica' | 'cluster_node' | 'broker';
  host: string;
  port: number;
  status: ITHealthStatus;
  metrics: ITMetrics;
  activeConnections: number;
  maxConnections: number;
  cacheHitRatio: number; // %
  replicationLagMs: number;
  qps: number;
  storageUsedGb: number;
  storageTotalGb: number;
  slowQueriesCount: number;
  lastBackupTime: string;
}

export interface ITNetworkDevice {
  id: string;
  name: string;
  type: 'router' | 'switch' | 'firewall' | 'load_balancer' | 'gateway' | 'dns';
  ip: string;
  macAddress: string;
  status: ITHealthStatus;
  throughputMbps: number;
  maxThroughputMbps: number;
  packetLossRate: number; // %
  activeSockets: number;
  latencyMs: number;
  interfaces: { name: string; status: 'up' | 'down'; speedGbps: number }[];
  rulesCount: number;
  blockedAttacksToday: number;
}

export interface ITSecurityNode {
  id: string;
  name: string;
  type: 'WAF' | 'SIEM' | 'IDS/IPS' | 'SSL_Manager' | 'Vault' | 'Threat_Hunter';
  status: ITHealthStatus;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  blockedThreatsToday: number;
  vulnerabilitiesDetected: number;
  activeIncidents: number;
  sslCertDaysRemaining: number;
  lastScanTimestamp: string;
  recentAttacks: { type: string; sourceIp: string; timestamp: string; action: 'blocked' | 'flagged' }[];
}

export interface ITDevOpsPipeline {
  id: string;
  name: string;
  repository: string;
  branch: string;
  commitHash: string;
  commitAuthor: string;
  runner: string;
  status: 'running' | 'success' | 'failed' | 'queued' | 'canceled';
  durationSeconds: number;
  stages: { name: string; status: 'success' | 'running' | 'failed' | 'pending'; duration: string }[];
  deployedToEnv?: string;
  lastDeployedAt: string;
}

export interface ITIncident {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'degraded' | 'info';
  detectedAt: string;
  impact: 'high' | 'medium' | 'low';
  service: string;
  nodeId: string;
  nodeName: string;
  departmentId: ITDepartmentId;
  assignedAgentId?: string;
  assignedAgentName?: string;
  status: 'open' | 'investigating' | 'remediating' | 'resolved';
  rootCause?: string;
  investigationSteps: {
    step: string;
    status: 'completed' | 'in_progress' | 'pending';
    result?: string;
    timestamp: string;
  }[];
  runbookRecommended?: string;
  suggestedAction?: string;
  resolvedAt?: string;
}

export interface ITLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'AUDIT';
  source: string;
  service: string;
  message: string;
  nodeId?: string;
  metadata?: Record<string, any>;
}

export type EntityStatus = 
  | 'working' 
  | 'walking'
  | 'idle' 
  | 'meeting' 
  | 'thinking' 
  | 'completed' 
  | 'warning' 
  | 'error' 
  | 'offline';

export interface ITEmployee {
  id: string;
  name: string;
  role: string;
  departmentId: ITDepartmentId;
  status: EntityStatus;
  avatarUrl: string;
  isAI: false;
  email: string;
  specialty: string;
  onCallStatus: 'active' | 'standby' | 'off';
  currentTask: string;
  activeIncidentsAssigned: string[];
  productivity: number; // 0 - 100
  lastActivityTime: string;
  skills: string[];
  location: string;
  workload: number; // percentage
  statusMessage?: string;
  officePosition?: { x: number; y: number; deskId?: string };
}

export type Employee = ITEmployee;

export interface ITAIAgent {
  id: string;
  name: string;
  role: string;
  departmentId: ITDepartmentId;
  status: EntityStatus;
  avatarUrl: string;
  isAI: true;
  model: string;
  monitoredSystem: string;
  currentTask: string;
  currentInvestigation?: string;
  activeIncidentId?: string;
  tasksCompletedToday: number;
  autonomousRemediations: number;
  lastActivityTime: string;
  accuracyRate: number; // percentage
  statusMessage: string;
  metrics: {
    label1: string;
    value1: number | string;
    label2: string;
    value2: number | string;
    label3: string;
    value3: number | string;
  };
  recentLogs: {
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'success';
    message: string;
  }[];
  recentCommandsExecuted: {
    command: string;
    target: string;
    timestamp: string;
    result: string;
  }[];
  officePosition?: { x: number; y: number; deskId?: string };
}

export type AIAgent = ITAIAgent;
export type Personnel = Employee | AIAgent;

export interface ITCommandAudit {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  command: string;
  targetId: string;
  targetName: string;
  targetType: ITResourceType;
  result: 'success' | 'failed' | 'cancelled' | 'pending_confirmation';
  exitCode: number;
  outputSummary: string;
  durationMs: number;
}

export interface ITMacroStats {
  totalServers: number;
  healthyServers: number;
  totalServices: number;
  healthyServices: number;
  k8sClustersCount: number;
  k8sPodsCount: number;
  k8sPodsHealthy: number;
  activeCriticalIncidents: number;
  activeWarnings: number;
  averageLatencyMs: number;
  globalUptimePercentage: number;
  activeAiAgents: number;
  totalNetworkThroughputGbps: number;
}

export type UserRole = 'NOC_DIRECTOR' | 'SRE_LEAD' | 'DEVOPS_ENG' | 'SECOPS_ANALYST' | 'DBA_ADMIN' | 'SUPPORT_TECH' | 'VIEWER';

export interface ViewTabSettings {
  currentTab: 'virtual_noc' | 'servers_datacenter' | 'k8s_explorer' | 'network_topology' | 'databases' | 'incidents' | 'terminal' | 'logs' | 'audit';
}

export * from './events';
export * from './commands';
