import { 
  ITDepartment, 
  ITServerNode, 
  K8sCluster,
  K8sPod,
  K8sNode,
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
  ITCommandAudit
} from '../types';

export const INITIAL_DEPARTMENTS: ITDepartment[] = [
  {
    id: 'noc',
    name: 'NOC / Monitoramento',
    code: 'NOC-01',
    color: '#06b6d4', // Cyan
    leadName: 'Marcio Tanaka',
    leadRole: 'NOC Operations Director',
    activeResourcesCount: 42,
    healthScore: 94,
    headcount: 5,
    aiAgentsCount: 2,
    description: 'Centro de Operações de Rede, observabilidade 24/7, telemetria e gestão de incidentes críticos.',
    criticalAlerts: 1,
    roomCoordinates: { x: 50, y: 50, width: 340, height: 260 }
  },
  {
    id: 'servers',
    name: 'Datacenter & Servidores',
    code: 'DC-RACKS',
    color: '#3b82f6', // Blue
    leadName: 'Roberto Albuquerque',
    leadRole: 'Chief Systems Architect',
    activeResourcesCount: 28,
    healthScore: 89,
    headcount: 4,
    aiAgentsCount: 1,
    description: 'Racks bare-metal, virtualizadores Proxmox/VMware, blade servers e storage SAN.',
    criticalAlerts: 1,
    roomCoordinates: { x: 420, y: 50, width: 360, height: 260 }
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes & Containers',
    code: 'K8S-MESH',
    color: '#8b5cf6', // Violet
    leadName: 'Juliana Rossi',
    leadRole: 'Kubernetes Lead Engineer',
    activeResourcesCount: 36,
    healthScore: 86,
    headcount: 3,
    aiAgentsCount: 2,
    description: 'Orquestração de clusters multi-region, service mesh Istio, pods, deployments e helm charts.',
    criticalAlerts: 1,
    roomCoordinates: { x: 810, y: 50, width: 340, height: 260 }
  },
  {
    id: 'cloud',
    name: 'Cloud Infrastructure',
    code: 'CLOUD-OPS',
    color: '#0ea5e9', // Sky
    leadName: 'Fernando Ramos',
    leadRole: 'Cloud Infrastructure Lead',
    activeResourcesCount: 24,
    healthScore: 98,
    headcount: 3,
    aiAgentsCount: 1,
    description: 'Clusters híbridos AWS (us-east-1, sa-east-1), GCP Compute Engine e Cloud Run.',
    criticalAlerts: 0,
    roomCoordinates: { x: 1180, y: 50, width: 320, height: 260 }
  },
  {
    id: 'network',
    name: 'Network & Topology',
    code: 'NET-CORE',
    color: '#10b981', // Emerald
    leadName: 'Carlos Mendonça',
    leadRole: 'Principal Network Engineer',
    activeResourcesCount: 18,
    healthScore: 95,
    headcount: 3,
    aiAgentsCount: 1,
    description: 'Roteamento BGP, switches Spine-Leaf 100G, balanceadores Traefik e tuneis SD-WAN.',
    criticalAlerts: 0,
    roomCoordinates: { x: 50, y: 340, width: 340, height: 260 }
  },
  {
    id: 'database',
    name: 'Database & Streams',
    code: 'DBA-OPS',
    color: '#f59e0b', // Amber
    leadName: 'Aline Vasconcelos',
    leadRole: 'Lead DBA & Data Infra',
    activeResourcesCount: 16,
    healthScore: 91,
    headcount: 3,
    aiAgentsCount: 1,
    description: 'PostgreSQL High Availability, Redis Clusters, Kafka message brokers e backups contínuos.',
    criticalAlerts: 0,
    roomCoordinates: { x: 420, y: 340, width: 360, height: 260 }
  },
  {
    id: 'devops',
    name: 'DevOps & CI/CD',
    code: 'DEVOPS-HUB',
    color: '#ec4899', // Pink
    leadName: 'Guilherme Prado',
    leadRole: 'DevOps & GitOps Lead',
    activeResourcesCount: 22,
    healthScore: 97,
    headcount: 4,
    aiAgentsCount: 1,
    description: 'Pipelines GitHub Actions, ArgoCD GitOps, repositórios de imagens e Terraform runners.',
    criticalAlerts: 0,
    roomCoordinates: { x: 810, y: 340, width: 340, height: 260 }
  },
  {
    id: 'security',
    name: 'Security & SOC',
    code: 'SOC-SEC',
    color: '#ef4444', // Red
    leadName: 'Beatriz Duarte',
    leadRole: 'SecOps & SOC Lead',
    activeResourcesCount: 19,
    healthScore: 96,
    headcount: 3,
    aiAgentsCount: 1,
    description: 'SIEM em tempo real, WAF Cloudflare, IDS/IPS Snort, auditoria de vulnerabilidades e certificados.',
    criticalAlerts: 0,
    roomCoordinates: { x: 1180, y: 340, width: 320, height: 260 }
  },
  {
    id: 'suporte',
    name: 'SRE & War Room',
    code: 'SRE-COMMAND',
    color: '#6366f1', // Indigo
    leadName: 'Lucas Ferraz',
    leadRole: 'Staff SRE Incident Commander',
    activeResourcesCount: 15,
    healthScore: 93,
    headcount: 4,
    aiAgentsCount: 1,
    description: 'Engenharia de Confiabilidade de Sites, gestão on-call, runbooks e post-mortems.',
    criticalAlerts: 0,
    roomCoordinates: { x: 230, y: 630, width: 500, height: 240 }
  },
  {
    id: 'automation',
    name: 'AI Agents & Automation Lab',
    code: 'AI-CORE',
    color: '#a855f7', // Purple
    leadName: 'NOC Autopilot Core',
    leadRole: 'Autonomous IT Orchestrator',
    activeResourcesCount: 12,
    healthScore: 99,
    headcount: 1,
    aiAgentsCount: 7,
    description: 'Núcleo neural de diagnóstico autônomo, resolução automática de incidentes e auto-healing.',
    criticalAlerts: 0,
    roomCoordinates: { x: 770, y: 630, width: 500, height: 240 }
  }
];

export const INITIAL_SERVERS: ITServerNode[] = [
  {
    id: 'srv-prod-01',
    name: 'server-prod-01',
    hostname: 'srv-prod-01.infra.internal',
    ip: '10.0.1.11',
    rackId: 'RACK-01',
    slotUnit: 'U01-U02',
    os: 'Ubuntu 24.04 LTS (Kernel 6.8)',
    environment: 'production',
    status: 'healthy',
    cores: 64,
    totalRamGb: 256,
    totalDiskGb: 3840,
    runningServices: ['nginx', 'docker', 'kubelet', 'node-exporter'],
    activeAlerts: [],
    version: 'v2.4.1',
    uptimeSeconds: 8421900, // 97 days
    lastUpdated: 'agora',
    departmentId: 'servers',
    metrics: {
      cpuUsage: 41.2,
      ramUsage: 64.5,
      diskUsage: 51.8,
      networkThroughputMbps: 380,
      latencyMs: 8,
      packetsPerSec: 14200,
      requestsPerSec: 2450,
      errorRate: 0.01,
      uptimePercentage: 99.99,
      temperatureC: 44,
      load1m: 2.1,
      load5m: 1.9,
      load15m: 1.8
    }
  },
  {
    id: 'srv-prod-02',
    name: 'server-prod-02',
    hostname: 'srv-prod-02.infra.internal',
    ip: '10.0.1.12',
    rackId: 'RACK-01',
    slotUnit: 'U03-U04',
    os: 'Ubuntu 24.04 LTS (Kernel 6.8)',
    environment: 'production',
    status: 'warning',
    cores: 64,
    totalRamGb: 256,
    totalDiskGb: 3840,
    runningServices: ['docker', 'kubelet', 'redis-cache', 'promtail'],
    activeAlerts: ['Alta ocupação de memória RAM (88.4%)'],
    version: 'v2.4.1',
    uptimeSeconds: 4120000,
    lastUpdated: 'agora',
    departmentId: 'servers',
    metrics: {
      cpuUsage: 78.4,
      ramUsage: 88.4,
      diskUsage: 72.1,
      networkThroughputMbps: 720,
      latencyMs: 14,
      packetsPerSec: 26400,
      requestsPerSec: 4120,
      errorRate: 0.12,
      uptimePercentage: 99.95,
      temperatureC: 56,
      load1m: 6.4,
      load5m: 5.8,
      load15m: 4.9
    }
  },
  {
    id: 'srv-prod-03',
    name: 'server-prod-03',
    hostname: 'srv-prod-03.infra.internal',
    ip: '10.0.1.13',
    rackId: 'RACK-01',
    slotUnit: 'U05-U06',
    os: 'Ubuntu 24.04 LTS (Kernel 6.8)',
    environment: 'production',
    status: 'critical',
    cores: 64,
    totalRamGb: 256,
    totalDiskGb: 3840,
    runningServices: ['kubelet', 'containerd', 'payment-worker'],
    activeAlerts: ['CPU > 92% e Pod payment-55fd em CrashLoopBackOff'],
    version: 'v2.4.1',
    uptimeSeconds: 1204000,
    lastUpdated: 'agora',
    departmentId: 'servers',
    metrics: {
      cpuUsage: 93.8,
      ramUsage: 91.2,
      diskUsage: 84.6,
      networkThroughputMbps: 910,
      latencyMs: 94,
      packetsPerSec: 48900,
      requestsPerSec: 1820,
      errorRate: 4.85,
      uptimePercentage: 98.40,
      temperatureC: 68,
      load1m: 14.8,
      load5m: 12.2,
      load15m: 9.7
    }
  },
  {
    id: 'srv-prod-04',
    name: 'server-prod-04',
    hostname: 'srv-prod-04.infra.internal',
    ip: '10.0.1.14',
    rackId: 'RACK-02',
    slotUnit: 'U01-U02',
    os: 'Debian 12 Bookworm',
    environment: 'production',
    status: 'healthy',
    cores: 32,
    totalRamGb: 128,
    totalDiskGb: 1920,
    runningServices: ['traefik', 'keepalived', 'prometheus'],
    activeAlerts: [],
    version: 'v1.9.0',
    uptimeSeconds: 9840000,
    lastUpdated: 'agora',
    departmentId: 'servers',
    metrics: {
      cpuUsage: 28.5,
      ramUsage: 45.1,
      diskUsage: 39.2,
      networkThroughputMbps: 420,
      latencyMs: 5,
      packetsPerSec: 18900,
      requestsPerSec: 3200,
      errorRate: 0.00,
      uptimePercentage: 100.0,
      temperatureC: 41,
      load1m: 1.2,
      load5m: 1.1,
      load15m: 0.9
    }
  },
  {
    id: 'srv-edge-01',
    name: 'server-edge-sa-east',
    hostname: 'srv-edge-sa.infra.internal',
    ip: '10.0.3.21',
    rackId: 'RACK-03',
    slotUnit: 'U10-U11',
    os: 'Alpine Linux 3.20',
    environment: 'edge',
    status: 'healthy',
    cores: 16,
    totalRamGb: 64,
    totalDiskGb: 960,
    runningServices: ['envoy', 'waf-agent', 'coredns'],
    activeAlerts: [],
    version: 'v3.1.2',
    uptimeSeconds: 5120000,
    lastUpdated: 'agora',
    departmentId: 'servers',
    metrics: {
      cpuUsage: 34.0,
      ramUsage: 52.8,
      diskUsage: 28.4,
      networkThroughputMbps: 540,
      latencyMs: 11,
      packetsPerSec: 31000,
      requestsPerSec: 5100,
      errorRate: 0.02,
      uptimePercentage: 99.98,
      temperatureC: 39,
      load1m: 1.4,
      load5m: 1.3,
      load15m: 1.2
    }
  }
];

export const INITIAL_K8S_CLUSTERS: K8sCluster[] = [
  {
    id: 'k8s-prod-cluster',
    name: 'K8S-PROD-BRAZIL (v1.30.2)',
    region: 'sa-east-1',
    version: 'v1.30.2',
    status: 'warning',
    namespaces: ['default', 'production', 'observability', 'kube-system'],
    nodes: [
      {
        id: 'node-01',
        name: 'k8s-node-01',
        cluster: 'k8s-prod-cluster',
        ip: '10.0.1.11',
        role: 'control-plane',
        status: 'healthy',
        podsCount: 14,
        maxPods: 110,
        kubeletVersion: 'v1.30.2',
        osImage: 'Ubuntu 24.04',
        metrics: {
          cpuUsage: 38.2,
          ramUsage: 54.0,
          diskUsage: 48.1,
          networkThroughputMbps: 290,
          latencyMs: 4,
          packetsPerSec: 12000,
          requestsPerSec: 1900,
          errorRate: 0.0,
          uptimePercentage: 99.99
        }
      },
      {
        id: 'node-02',
        name: 'k8s-node-02',
        cluster: 'k8s-prod-cluster',
        ip: '10.0.1.12',
        role: 'worker',
        status: 'healthy',
        podsCount: 19,
        maxPods: 110,
        kubeletVersion: 'v1.30.2',
        osImage: 'Ubuntu 24.04',
        metrics: {
          cpuUsage: 59.4,
          ramUsage: 71.2,
          diskUsage: 64.0,
          networkThroughputMbps: 450,
          latencyMs: 7,
          packetsPerSec: 18000,
          requestsPerSec: 3200,
          errorRate: 0.02,
          uptimePercentage: 99.96
        }
      },
      {
        id: 'node-03',
        name: 'k8s-node-03',
        cluster: 'k8s-prod-cluster',
        ip: '10.0.1.13',
        role: 'worker',
        status: 'critical',
        podsCount: 22,
        maxPods: 110,
        kubeletVersion: 'v1.30.2',
        osImage: 'Ubuntu 24.04',
        metrics: {
          cpuUsage: 93.8,
          ramUsage: 91.2,
          diskUsage: 84.6,
          networkThroughputMbps: 910,
          latencyMs: 94,
          packetsPerSec: 48900,
          requestsPerSec: 1820,
          errorRate: 4.85,
          uptimePercentage: 98.40
        }
      }
    ],
    pods: [
      {
        id: 'pod-api-7d8f',
        name: 'api-gateway-7d8f4bc9-xk21p',
        namespace: 'production',
        nodeName: 'k8s-node-01',
        ip: '10.244.1.42',
        status: 'healthy',
        phase: 'Running',
        restarts: 0,
        age: '14d',
        metrics: { cpuMillicores: 140, memoryMb: 512 },
        labels: { app: 'api-gateway', tier: 'backend', env: 'production' },
        containers: [
          { name: 'gateway', image: 'registry.internal/api-gw:v3.2', ready: true, restartCount: 0, state: 'running', memoryLimitMb: 1024, cpuLimitCores: 2 }
        ],
        lastLogSnippet: '200 GET /api/v1/healthz - 1.2ms'
      },
      {
        id: 'pod-worker-92ab',
        name: 'worker-queue-92ab81ef-mz44c',
        namespace: 'production',
        nodeName: 'k8s-node-02',
        ip: '10.244.2.18',
        status: 'healthy',
        phase: 'Running',
        restarts: 1,
        age: '6d',
        metrics: { cpuMillicores: 310, memoryMb: 890 },
        labels: { app: 'queue-consumer', tier: 'worker', env: 'production' },
        containers: [
          { name: 'worker', image: 'registry.internal/queue-worker:v2.8', ready: true, restartCount: 1, state: 'running', memoryLimitMb: 2048, cpuLimitCores: 2 }
        ],
        lastLogSnippet: 'Processed job #89421 in 42ms'
      },
      {
        id: 'pod-payment-55fd',
        name: 'payment-service-55fd90aa-qp89z',
        namespace: 'production',
        nodeName: 'k8s-node-03',
        ip: '10.244.3.99',
        status: 'critical',
        phase: 'CrashLoopBackOff',
        restarts: 14,
        age: '3h',
        metrics: { cpuMillicores: 1850, memoryMb: 2040 },
        labels: { app: 'payment-api', tier: 'backend', env: 'production' },
        containers: [
          { name: 'payment-api', image: 'registry.internal/payment-svc:v4.1.2', ready: false, restartCount: 14, state: 'waiting', memoryLimitMb: 2048, cpuLimitCores: 2 }
        ],
        lastLogSnippet: 'FATAL: java.lang.OutOfMemoryError: Java heap space [Limit: 2048MB]'
      },
      {
        id: 'pod-auth-33ba',
        name: 'auth-service-33ba11de-ll90k',
        namespace: 'production',
        nodeName: 'k8s-node-02',
        ip: '10.244.2.66',
        status: 'healthy',
        phase: 'Running',
        restarts: 0,
        age: '21d',
        metrics: { cpuMillicores: 80, memoryMb: 380 },
        labels: { app: 'auth-svc', tier: 'security', env: 'production' },
        containers: [
          { name: 'auth-svc', image: 'registry.internal/auth-svc:v1.9', ready: true, restartCount: 0, state: 'running', memoryLimitMb: 1024, cpuLimitCores: 1 }
        ],
        lastLogSnippet: 'JWT token validated for user #4912'
      }
    ]
  }
];

export const INITIAL_DATABASES: ITDatabaseNode[] = [
  {
    id: 'db-pg-primary',
    name: 'postgresql-primary-ha',
    engine: 'PostgreSQL',
    role: 'primary',
    host: 'pg-master.db.internal',
    port: 5432,
    status: 'healthy',
    activeConnections: 184,
    maxConnections: 500,
    cacheHitRatio: 99.4,
    replicationLagMs: 0,
    qps: 1840,
    storageUsedGb: 640,
    storageTotalGb: 2000,
    slowQueriesCount: 2,
    lastBackupTime: 'Hoje às 04:00 (Sucesso)',
    metrics: {
      cpuUsage: 44.5,
      ramUsage: 68.2,
      diskUsage: 32.0,
      networkThroughputMbps: 210,
      latencyMs: 2.1,
      packetsPerSec: 15400,
      requestsPerSec: 1840,
      errorRate: 0.0,
      uptimePercentage: 99.99
    }
  },
  {
    id: 'db-redis-cluster',
    name: 'redis-cache-cluster',
    engine: 'Redis Cluster',
    role: 'cluster_node',
    host: 'redis.cache.internal',
    port: 6379,
    status: 'healthy',
    activeConnections: 420,
    maxConnections: 10000,
    cacheHitRatio: 97.8,
    replicationLagMs: 1,
    qps: 8400,
    storageUsedGb: 18.5,
    storageTotalGb: 64,
    slowQueriesCount: 0,
    lastBackupTime: 'Hoje às 05:00 (Sucesso)',
    metrics: {
      cpuUsage: 22.0,
      ramUsage: 48.0,
      diskUsage: 28.9,
      networkThroughputMbps: 340,
      latencyMs: 0.8,
      packetsPerSec: 32000,
      requestsPerSec: 8400,
      errorRate: 0.0,
      uptimePercentage: 100.0
    }
  },
  {
    id: 'db-kafka-stream',
    name: 'kafka-broker-eventstream',
    engine: 'Apache Kafka',
    role: 'broker',
    host: 'kafka-01.stream.internal',
    port: 9092,
    status: 'warning',
    activeConnections: 92,
    maxConnections: 1000,
    cacheHitRatio: 95.0,
    replicationLagMs: 24,
    qps: 3400,
    storageUsedGb: 1420,
    storageTotalGb: 3000,
    slowQueriesCount: 0,
    lastBackupTime: 'Ontem às 23:00 (Sucesso)',
    metrics: {
      cpuUsage: 68.4,
      ramUsage: 79.5,
      diskUsage: 47.3,
      networkThroughputMbps: 480,
      latencyMs: 18,
      packetsPerSec: 28000,
      requestsPerSec: 3400,
      errorRate: 0.05,
      uptimePercentage: 99.95,
      queueDepth: 4280
    }
  }
];

export const INITIAL_NETWORKS: ITNetworkDevice[] = [
  {
    id: 'net-router-core',
    name: 'Router-Core-BGP-01',
    type: 'router',
    ip: '10.0.0.1',
    macAddress: '00:1A:2B:3C:4D:5E',
    status: 'healthy',
    throughputMbps: 4850,
    maxThroughputMbps: 10000,
    packetLossRate: 0.001,
    activeSockets: 8420,
    latencyMs: 1.2,
    rulesCount: 142,
    blockedAttacksToday: 3820,
    interfaces: [
      { name: 'eth0 (Uplink Level3)', status: 'up', speedGbps: 10 },
      { name: 'eth1 (Uplink Telxius)', status: 'up', speedGbps: 10 },
      { name: 'eth2 (LAN Core)', status: 'up', speedGbps: 25 }
    ]
  },
  {
    id: 'net-firewall-edge',
    name: 'Firewall-PaloAlto-NGFW',
    type: 'firewall',
    ip: '10.0.0.2',
    macAddress: '00:1A:2B:3C:4D:5F',
    status: 'healthy',
    throughputMbps: 3120,
    maxThroughputMbps: 10000,
    packetLossRate: 0.0,
    activeSockets: 6100,
    latencyMs: 2.4,
    rulesCount: 520,
    blockedAttacksToday: 14290,
    interfaces: [
      { name: 'wan0 (External)', status: 'up', speedGbps: 10 },
      { name: 'dmz0 (DMZ Mesh)', status: 'up', speedGbps: 10 }
    ]
  },
  {
    id: 'net-lb-traefik',
    name: 'LoadBalancer-Traefik-Ingress',
    type: 'load_balancer',
    ip: '10.0.0.10',
    macAddress: '00:1A:2B:3C:4D:60',
    status: 'healthy',
    throughputMbps: 2450,
    maxThroughputMbps: 5000,
    packetLossRate: 0.0,
    activeSockets: 4890,
    latencyMs: 1.8,
    rulesCount: 88,
    blockedAttacksToday: 890,
    interfaces: [
      { name: 'ingress-pub', status: 'up', speedGbps: 10 },
      { name: 'k8s-pod-network', status: 'up', speedGbps: 10 }
    ]
  }
];

export const INITIAL_SECURITY: ITSecurityNode[] = [
  {
    id: 'sec-waf-cloudflare',
    name: 'Cloudflare Enterprise WAF',
    type: 'WAF',
    status: 'healthy',
    threatLevel: 'low',
    blockedThreatsToday: 18420,
    vulnerabilitiesDetected: 0,
    activeIncidents: 0,
    sslCertDaysRemaining: 184,
    lastScanTimestamp: '10:45:00',
    recentAttacks: [
      { type: 'SQL Injection attempt', sourceIp: '185.220.101.4', timestamp: '10:38:12', action: 'blocked' },
      { type: 'DDoS SYN Flood (8 Gbps)', sourceIp: 'Botnet Cluster', timestamp: '09:12:44', action: 'blocked' },
      { type: 'Path Traversal /etc/passwd', sourceIp: '45.154.255.8', timestamp: '08:44:02', action: 'blocked' }
    ]
  },
  {
    id: 'sec-siem-wazuh',
    name: 'SIEM Wazuh / Elastic SOC',
    type: 'SIEM',
    status: 'healthy',
    threatLevel: 'medium',
    blockedThreatsToday: 240,
    vulnerabilitiesDetected: 3,
    activeIncidents: 1,
    sslCertDaysRemaining: 92,
    lastScanTimestamp: '10:40:00',
    recentAttacks: [
      { type: 'SSH Brute Force on port 22', sourceIp: '194.26.29.112', timestamp: '10:14:22', action: 'flagged' }
    ]
  }
];

export const INITIAL_PIPELINES: ITDevOpsPipeline[] = [
  {
    id: 'pipe-backend-main',
    name: 'ci-backend-api-pipeline',
    repository: 'github.com/company/core-backend',
    branch: 'main',
    commitHash: 'a89c1f2',
    commitAuthor: 'Juliana Rossi',
    runner: 'github-runner-k8s-04',
    status: 'success',
    durationSeconds: 194,
    lastDeployedAt: '10:15:30',
    stages: [
      { name: 'Lint & Unit Tests', status: 'success', duration: '45s' },
      { name: 'SonarQube SAST Scan', status: 'success', duration: '32s' },
      { name: 'Docker Build & Push', status: 'success', duration: '68s' },
      { name: 'ArgoCD Sync (Prod)', status: 'success', duration: '49s' }
    ]
  },
  {
    id: 'pipe-payment-hotfix',
    name: 'hotfix-payment-leak-patch',
    repository: 'github.com/company/payment-service',
    branch: 'fix/memory-leak-jvm',
    commitHash: '77bd21a',
    commitAuthor: 'DevOps Agent 🤖',
    runner: 'github-runner-k8s-02',
    status: 'running',
    durationSeconds: 82,
    lastDeployedAt: 'em andamento',
    stages: [
      { name: 'Lint & Unit Tests', status: 'success', duration: '38s' },
      { name: 'Memory Profile Check', status: 'running', duration: '44s' },
      { name: 'Docker Multi-stage Build', status: 'pending', duration: '-' },
      { name: 'Canary Rollout', status: 'pending', duration: '-' }
    ]
  }
];

export const INITIAL_INCIDENTS: ITIncident[] = [
  {
    id: 'inc-2026-001',
    title: '🔴 INCIDENTE CRÍTICO: API de Pagamentos em CrashLoopBackOff no node-03',
    severity: 'critical',
    detectedAt: '10:42:13',
    impact: 'high',
    service: 'payment-api',
    nodeId: 'node-03',
    nodeName: 'k8s-node-03 (10.0.1.13)',
    departmentId: 'kubernetes',
    assignedAgentId: 'ai-devops-01',
    assignedAgentName: '🤖 DevOps Agent',
    status: 'investigating',
    rootCause: 'Vazamento de memória na thread JVM do worker de liquidação. O container excedeu o limite cgroup de 2048Mi.',
    runbookRecommended: 'RUNBOOK-K8S-042: JVM Heap Dump & CGroup Memory Limit Expansion',
    suggestedAction: 'kubectl set resources deployment payment-api --limits=memory=4096Mi && kubectl rollout restart deployment payment-api',
    investigationSteps: [
      { step: '1. Detectada falha de liveness probe e reinicializações consecutivas (>14 restarts)', status: 'completed', result: 'Liveness probe HTTP 500 no /healthz', timestamp: '10:42:15' },
      { step: '2. DevOps Agent coletou logs do Pod payment-55fd', status: 'completed', result: 'java.lang.OutOfMemoryError detectado', timestamp: '10:42:22' },
      { step: '3. Verificação de métricas do host node-03', status: 'completed', result: 'Host CPU 93.8%, RAM 91.2%', timestamp: '10:42:30' },
      { step: '4. Geração de Hotfix e Proposta de Auto-Remediação', status: 'in_progress', timestamp: '10:42:45' }
    ]
  },
  {
    id: 'inc-2026-002',
    title: '🟡 ALERTA DE LATÊNCIA: Fila Kafka acumulando mensagens no tópico #order-events',
    severity: 'warning',
    detectedAt: '10:35:00',
    impact: 'medium',
    service: 'kafka-broker-eventstream',
    nodeId: 'db-kafka-stream',
    nodeName: 'kafka-01.stream.internal',
    departmentId: 'database',
    assignedAgentId: 'ai-db-01',
    assignedAgentName: '🤖 Database Agent',
    status: 'investigating',
    rootCause: 'Consumidores do worker-queue desacelerados por contenção de I/O em disco.',
    suggestedAction: 'Escalar réplicas do deployment worker-queue de 2 para 6 pods.',
    investigationSteps: [
      { step: '1. Monitoramento de lag de partição detectou 4,280 mensagens pendentes', status: 'completed', result: 'Lag > 3,000 threshold', timestamp: '10:35:05' },
      { step: '2. Database Agent inspecionando locks no PostgreSQL', status: 'completed', result: 'Nenhum deadlock ativo, apenas throughput saturado', timestamp: '10:35:20' }
    ]
  }
];

export const INITIAL_LOGS: ITLog[] = [
  { id: 'log-01', timestamp: '10:42:31', level: 'INFO', source: 'srv-prod-01', service: 'nginx', message: 'HTTP 200 GET /api/v1/telemetry 1.8ms - 10.0.0.10' },
  { id: 'log-02', timestamp: '10:42:32', level: 'INFO', source: 'node-02', service: 'worker-queue', message: 'Worker processed async dispatch in 28ms [queue: emails]' },
  { id: 'log-03', timestamp: '10:42:33', level: 'WARN', source: 'node-03', service: 'kubelet', message: 'ResourceUsageWarning: node-03 CPU utilization sustained at 93.8%' },
  { id: 'log-04', timestamp: '10:42:34', level: 'ERROR', source: 'node-03', service: 'payment-api', message: 'java.lang.OutOfMemoryError: Java heap space (limit 2048Mi exceeded) container killed by OOMKilled' },
  { id: 'log-05', timestamp: '10:42:35', level: 'INFO', source: 'ai-devops-01', service: 'DevOps Agent', message: 'Auto-diagnosis initiated for Pod payment-service-55fd90aa-qp89z' },
  { id: 'log-06', timestamp: '10:42:38', level: 'AUDIT', source: 'admin', service: 'terminal', message: 'User root executed: "kubectl describe pod payment-55fd" -> Exit 0' },
  { id: 'log-07', timestamp: '10:42:40', level: 'INFO', source: 'net-firewall-edge', service: 'PaloAlto', message: 'Threat blocked: SQL Injection from 185.220.101.4 on URI /login' },
  { id: 'log-08', timestamp: '10:42:44', level: 'DEBUG', source: 'db-pg-primary', service: 'PostgreSQL', message: 'Checkpoint starting: time 300s, wal 12 files' }
];

export const INITIAL_EMPLOYEES: ITEmployee[] = [
  {
    id: 'emp-noc-01',
    name: 'Marcio Tanaka',
    role: 'NOC Operations Director',
    departmentId: 'noc',
    status: 'working',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    isAI: false,
    email: 'marcio.tanaka@infra.corp',
    specialty: 'Telemetria, SLOs, Resposta a Incidentes Globais',
    onCallStatus: 'active',
    currentTask: 'Supervisionando War Room do Incidente payment-api',
    activeIncidentsAssigned: ['inc-2026-001'],
    productivity: 98,
    lastActivityTime: 'agora',
    skills: ['NOC Ops', 'Grafana', 'Prometheus', 'Incident Command', 'SLO/SLA'],
    location: 'NOC Main Desk #01',
    workload: 85,
    statusMessage: 'Coordenando contenção do nó 03',
    officePosition: { x: 90, y: 120, deskId: 'desk-noc-1' }
  },
  {
    id: 'emp-devops-01',
    name: 'Juliana Rossi',
    role: 'Staff Kubernetes & SRE Lead',
    departmentId: 'kubernetes',
    status: 'working',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    isAI: false,
    email: 'juliana.rossi@infra.corp',
    specialty: 'Kubernetes Multi-Cluster, Istio, CGroup Tuning',
    onCallStatus: 'active',
    currentTask: 'Aplicando patch de memória JVM nos nós K8s',
    activeIncidentsAssigned: ['inc-2026-001'],
    productivity: 96,
    lastActivityTime: 'agora',
    skills: ['Kubernetes', 'Helm', 'Go', 'Linux Cgroups', 'ArgoCD'],
    location: 'K8s Cluster Pod Desk #01',
    workload: 92,
    statusMessage: 'Validando release v4.1.3 com aumento de heap',
    officePosition: { x: 860, y: 120, deskId: 'desk-k8s-1' }
  },
  {
    id: 'emp-sec-01',
    name: 'Beatriz Duarte',
    role: 'Principal SecOps Analyst',
    departmentId: 'security',
    status: 'working',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    isAI: false,
    email: 'beatriz.duarte@infra.corp',
    specialty: 'WAF Rule Tuning, Threat Hunting, SIEM Forensics',
    onCallStatus: 'standby',
    currentTask: 'Analisando assinaturas de botnets nas bordas WAF',
    activeIncidentsAssigned: [],
    productivity: 94,
    lastActivityTime: 'agora',
    skills: ['SIEM', 'Cloudflare WAF', 'Wazuh', 'Snort', 'Forensics'],
    location: 'SOC Defense Station #01',
    workload: 65,
    statusMessage: 'Nenhum vazamento detectado na borda externa',
    officePosition: { x: 1230, y: 390, deskId: 'desk-soc-1' }
  },
  {
    id: 'emp-dba-01',
    name: 'Aline Vasconcelos',
    role: 'Lead Database Administrator',
    departmentId: 'database',
    status: 'working',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    isAI: false,
    email: 'aline.vasconcelos@infra.corp',
    specialty: 'PostgreSQL HA, Patroni, Redis In-Memory, Kafka Stream Tuning',
    onCallStatus: 'standby',
    currentTask: 'Otimizando índices e conexões no pool de banco',
    activeIncidentsAssigned: ['inc-2026-002'],
    productivity: 95,
    lastActivityTime: 'agora',
    skills: ['PostgreSQL', 'Redis', 'Kafka', 'pgBouncer', 'WAL Archiving'],
    location: 'DBA Ops Station #01',
    workload: 74,
    statusMessage: 'Replicação síncrona com 0ms de lag',
    officePosition: { x: 470, y: 390, deskId: 'desk-db-1' }
  },
  {
    id: 'emp-sre-01',
    name: 'Lucas Ferraz',
    role: 'Senior SRE Incident Commander',
    departmentId: 'suporte',
    status: 'working',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    isAI: false,
    email: 'lucas.ferraz@infra.corp',
    specialty: 'Chaos Engineering, Failover Automático, Runbooks',
    onCallStatus: 'active',
    currentTask: 'Monitorando SLO de pagamentos na War Room',
    activeIncidentsAssigned: ['inc-2026-001'],
    productivity: 97,
    lastActivityTime: 'agora',
    skills: ['SRE', 'Chaos Mesh', 'OpenTelemetry', 'Runbooks', 'Disaster Recovery'],
    location: 'War Room Command Table',
    workload: 88,
    statusMessage: 'Plano de contenção ativo',
    officePosition: { x: 380, y: 690, deskId: 'desk-sre-1' }
  }
];

export const INITIAL_AI_AGENTS: ITAIAgent[] = [
  {
    id: 'ai-noc-01',
    name: '🤖 NOC Agent',
    role: 'Autonomous Observability Agent',
    departmentId: 'noc',
    status: 'thinking',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    isAI: true,
    model: 'Gemini 2.5 Flash Telemetry Engine',
    monitoredSystem: 'Todos os nós e serviços de produção',
    currentTask: 'Correlacionando anomalias de latência e telemetria',
    currentInvestigation: 'Picos de erro HTTP 500 no endpoint /v1/checkout',
    tasksCompletedToday: 1420,
    autonomousRemediations: 48,
    lastActivityTime: 'agora',
    accuracyRate: 99.4,
    statusMessage: 'Vigilância contínua em 45 servidores e 130 serviços',
    metrics: {
      label1: 'Logs/sec Analisados',
      value1: '14.8k',
      label2: 'Tempo Médio Diagnóstico',
      value2: '1.2s',
      label3: 'Precisão de Causa-Raiz',
      value3: '99.4%'
    },
    recentLogs: [
      { timestamp: '10:42:35', level: 'info', message: 'Alerta emitido para Incidente inc-2026-001' },
      { timestamp: '10:42:10', level: 'warn', message: 'Degradação de latência no nó node-03 (+86ms)' },
      { timestamp: '10:40:00', level: 'success', message: 'Healthcheck de rotina em 130 serviços: 129 OK' }
    ],
    recentCommandsExecuted: [
      { command: 'curl -I http://10.0.1.13:8080/healthz', target: 'srv-prod-03', timestamp: '10:42:14', result: 'HTTP 500' },
      { command: 'promql rate(http_requests_total{status=~"5.."}[1m])', target: 'prometheus', timestamp: '10:42:18', result: 'Spike detected: 4.85%' }
    ],
    officePosition: { x: 190, y: 120, deskId: 'desk-noc-ai' }
  },
  {
    id: 'ai-devops-01',
    name: '🤖 DevOps Agent',
    role: 'Autonomous Kubernetes & Infrastructure Agent',
    departmentId: 'devops',
    status: 'working',
    avatarUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=150',
    isAI: true,
    model: 'Gemini 2.5 Flash DevOps Specialist',
    monitoredSystem: 'Kubernetes Nodes, Containers & CI/CD Pipelines',
    currentTask: 'Investigando CrashLoopBackOff no pod payment-55fd',
    currentInvestigation: 'OOMKilled na JVM - propondo escalonamento de memória cgroup',
    activeIncidentId: 'inc-2026-001',
    tasksCompletedToday: 890,
    autonomousRemediations: 34,
    lastActivityTime: 'agora',
    accuracyRate: 98.9,
    statusMessage: 'Executando diagnóstico de pods e cgroups',
    metrics: {
      label1: 'Pods Auto-Recuperados',
      value1: '19 hoje',
      label2: 'Builds Acelerados',
      value2: '44%',
      label3: 'Taxa de Sucesso Auto-Fix',
      value3: '98.9%'
    },
    recentLogs: [
      { timestamp: '10:42:45', level: 'info', message: 'Proposta de remediação gerada para aprovação do operador' },
      { timestamp: '10:42:22', level: 'warn', message: 'Capturado OOMKilled no container payment-api' },
      { timestamp: '10:41:00', level: 'success', message: 'Deploy canary v3.2.1 validado com sucesso no cluster' }
    ],
    recentCommandsExecuted: [
      { command: 'kubectl logs payment-55fd -n production --tail=50', target: 'k8s-prod-cluster', timestamp: '10:42:20', result: 'java.lang.OutOfMemoryError' },
      { command: 'kubectl top node node-03', target: 'k8s-prod-cluster', timestamp: '10:42:25', result: 'CPU: 93%, Memory: 91%' }
    ],
    officePosition: { x: 860, y: 390, deskId: 'desk-devops-ai' }
  },
  {
    id: 'ai-sec-01',
    name: '🤖 Security Agent',
    role: 'Autonomous SOC & Threat Hunter',
    departmentId: 'security',
    status: 'working',
    avatarUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=150',
    isAI: true,
    model: 'Gemini 2.5 Flash Cyber Defense',
    monitoredSystem: 'Cloudflare WAF, Palo Alto NGFW, SIEM Wazuh',
    currentTask: 'Bloqueando IPs maliciosos e monitorando scans de portas',
    tasksCompletedToday: 18420,
    autonomousRemediations: 18420,
    lastActivityTime: 'agora',
    accuracyRate: 99.98,
    statusMessage: '18,420 ataques bloqueados hoje automaticamente',
    metrics: {
      label1: 'Ataques Bloqueados',
      value1: '18.4k',
      label2: 'Tempo Médio Bloqueio',
      value2: '< 80ms',
      label3: 'Zero Falsos Positivos',
      value3: '99.98%'
    },
    recentLogs: [
      { timestamp: '10:42:40', level: 'info', message: 'IP 185.220.101.4 adicionado à blacklist por 24h' },
      { timestamp: '10:35:12', level: 'success', message: 'Certificados SSL verificados: todos válidos > 90 dias' }
    ],
    recentCommandsExecuted: [
      { command: 'iptables -A INPUT -s 185.220.101.4 -j DROP', target: 'net-firewall-edge', timestamp: '10:42:40', result: 'Rule appended' }
    ],
    officePosition: { x: 1330, y: 390, deskId: 'desk-sec-ai' }
  },
  {
    id: 'ai-db-01',
    name: '🤖 Database Agent',
    role: 'Autonomous Database & Cache Optimizer',
    departmentId: 'database',
    status: 'working',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    isAI: true,
    model: 'Gemini 2.5 Flash DBA AI',
    monitoredSystem: 'PostgreSQL Primary/Replicas, Redis Cluster, Kafka',
    currentTask: 'Monitorando lag de replicação e consumo de buffer cache',
    tasksCompletedToday: 620,
    autonomousRemediations: 12,
    lastActivityTime: 'agora',
    accuracyRate: 99.2,
    statusMessage: 'Buffer cache hit ratio em 99.4%',
    metrics: {
      label1: 'Queries Otimizadas',
      value1: '142 hoje',
      label2: 'Buffer Hit Ratio',
      value2: '99.4%',
      label3: 'Replication Lag',
      value3: '< 2ms'
    },
    recentLogs: [
      { timestamp: '10:35:20', level: 'info', message: 'Análise de slow queries concluída: 0 deadlocks' },
      { timestamp: '10:30:00', level: 'success', message: 'WAL vacuum automático concluído com liberação de 4.2GB' }
    ],
    recentCommandsExecuted: [
      { command: 'SELECT count(*) FROM pg_stat_activity WHERE state = "active"', target: 'db-pg-primary', timestamp: '10:40:00', result: '184 active' }
    ],
    officePosition: { x: 570, y: 390, deskId: 'desk-db-ai' }
  },
  {
    id: 'ai-k8s-01',
    name: '🤖 Kubernetes Agent',
    role: 'Autonomous Pod & Cluster Healer',
    departmentId: 'kubernetes',
    status: 'working',
    avatarUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=150',
    isAI: true,
    model: 'Gemini 2.5 Flash K8s Healer',
    monitoredSystem: 'Cluster K8S-PROD-BRAZIL (3 Nodes, 48 Pods)',
    currentTask: 'Supervisionando auto-scaling horizontal de pods (HPA)',
    tasksCompletedToday: 480,
    autonomousRemediations: 22,
    lastActivityTime: 'agora',
    accuracyRate: 99.6,
    statusMessage: 'Pronto para reinicialização e auto-rollout de deployments',
    metrics: {
      label1: 'Pods Ativos',
      value1: '48 pods',
      label2: 'Clusters Vigiados',
      value2: '3 clusters',
      label3: 'Tempo Auto-Heal',
      value3: '< 3s'
    },
    recentLogs: [
      { timestamp: '10:42:00', level: 'warn', message: 'Detectado restart count anômalo no pod payment-55fd' },
      { timestamp: '10:20:00', level: 'success', message: 'HPA aumentou réplicas do api-gateway de 3 para 5' }
    ],
    recentCommandsExecuted: [
      { command: 'kubectl get pods -A --field-selector status.phase!=Running', target: 'k8s-prod-cluster', timestamp: '10:42:15', result: 'payment-55fd CrashLoopBackOff' }
    ],
    officePosition: { x: 960, y: 120, deskId: 'desk-k8s-ai' }
  },
  {
    id: 'ai-net-01',
    name: '🤖 Network Agent',
    role: 'Autonomous SDN & BGP Traffic Optimizer',
    departmentId: 'network',
    status: 'working',
    avatarUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=150',
    isAI: true,
    model: 'Gemini 2.5 Flash NetCore',
    monitoredSystem: 'Roteadores BGP, Switches 100G, Traefik LB',
    currentTask: 'Balanceando tráfego entre uplinks Level3 e Telxius',
    tasksCompletedToday: 3200,
    autonomousRemediations: 15,
    lastActivityTime: 'agora',
    accuracyRate: 99.9,
    statusMessage: 'Tráfego global em 4.85 Gbps sem perdas de pacotes',
    metrics: {
      label1: 'Taxa de Perda',
      value1: '0.001%',
      label2: 'Throughput',
      value2: '4.85 Gbps',
      label3: 'Latência WAN',
      value3: '1.2ms'
    },
    recentLogs: [
      { timestamp: '10:30:00', level: 'success', message: 'Rebalanceamento de rotas BGP concluído' }
    ],
    recentCommandsExecuted: [
      { command: 'ping -c 4 10.0.0.1', target: 'net-router-core', timestamp: '10:40:00', result: '0% packet loss, avg 1.1ms' }
    ],
    officePosition: { x: 190, y: 390, deskId: 'desk-net-ai' }
  },
  {
    id: 'ai-sre-01',
    name: '🤖 SRE Agent',
    role: 'Autonomous Site Reliability & Runbook Executor',
    departmentId: 'suporte',
    status: 'working',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    isAI: true,
    model: 'Gemini 2.5 Flash SRE Orchestrator',
    monitoredSystem: 'SLOs, Error Budgets, War Room Runbooks',
    currentTask: 'Coordenando plano de rollback e remediação',
    tasksCompletedToday: 115,
    autonomousRemediations: 18,
    lastActivityTime: 'agora',
    accuracyRate: 99.1,
    statusMessage: 'Orquestrando runbooks de contingência',
    metrics: {
      label1: 'MTTD (Detecção)',
      value1: '1.8s',
      label2: 'MTTR (Resolução)',
      value2: '42s',
      label3: 'Uptime Global',
      value3: '99.98%'
    },
    recentLogs: [
      { timestamp: '10:42:30', level: 'info', message: 'Alerta disparado para equipe on-call via PagerDuty' }
    ],
    recentCommandsExecuted: [
      { command: 'runbook-executor --id RUNBOOK-K8S-042 --dry-run', target: 'sre-engine', timestamp: '10:42:35', result: 'Dry run successful' }
    ],
    officePosition: { x: 500, y: 690, deskId: 'desk-sre-ai' }
  }
];

export const INITIAL_MACRO_STATS: ITMacroStats = {
  totalServers: 45,
  healthyServers: 42,
  totalServices: 130,
  healthyServices: 128,
  k8sClustersCount: 3,
  k8sPodsCount: 48,
  k8sPodsHealthy: 47,
  activeCriticalIncidents: 1,
  activeWarnings: 2,
  averageLatencyMs: 28,
  globalUptimePercentage: 99.98,
  activeAiAgents: 7,
  totalNetworkThroughputGbps: 4.85
};

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-01',
    title: '🔴 Pod payment-55fd em CrashLoopBackOff no node-03',
    description: 'OutOfMemoryError detectado. Consumo de CPU atingiu 93.8% no nó.',
    severity: 'critical',
    departmentId: 'kubernetes',
    targetId: 'srv-prod-03',
    targetName: 'server-prod-03',
    timestamp: '10:42:13',
    status: 'active',
    source: 'Kubelet & DevOps Agent',
    actionRequired: 'Aumentar limite de memória cgroup ou reiniciar deployment'
  },
  {
    id: 'alt-02',
    title: '🟡 Uso de memória elevado no server-prod-02 (88.4%)',
    description: 'Cache do Redis consumindo 88.4% da memória alocada.',
    severity: 'warning',
    departmentId: 'servers',
    targetId: 'srv-prod-02',
    targetName: 'server-prod-02',
    timestamp: '10:38:00',
    status: 'active',
    source: 'Node Exporter',
    actionRequired: 'Executar flush de chaves expiradas no Redis'
  },
  {
    id: 'alt-03',
    title: '🟡 Lag crescente de partição no Kafka (4,280 msgs)',
    description: 'Consumidores de pedidos com atraso no processamento.',
    severity: 'warning',
    departmentId: 'database',
    targetId: 'db-kafka-stream',
    targetName: 'kafka-broker-eventstream',
    timestamp: '10:35:00',
    status: 'active',
    source: 'Database Agent',
    actionRequired: 'Escalar réplicas de workers'
  }
];

export const INITIAL_EVENTS: LiveEvent[] = [
  {
    id: 'evt-01',
    timestamp: '10:42:45',
    timeFormatted: '10:42:45',
    type: 'incident_investigating',
    title: 'DevOps Agent investigando CrashLoopBackOff',
    description: 'DevOps Agent coletou logs da JVM e gerou proposta de correção.',
    severity: 'warning',
    departmentId: 'kubernetes',
    targetId: 'node-03',
    targetName: 'k8s-node-03'
  },
  {
    id: 'evt-02',
    timestamp: '10:42:40',
    timeFormatted: '10:42:40',
    type: 'ddos_attack_blocked',
    title: 'Ataque SQL Injection Bloqueado pelo WAF',
    description: 'Origem IP 185.220.101.4 bloqueada com sucesso.',
    severity: 'success',
    departmentId: 'security',
    targetName: 'Cloudflare WAF'
  },
  {
    id: 'evt-03',
    timestamp: '10:42:13',
    timeFormatted: '10:42:13',
    type: 'incident_detected',
    title: 'Falha detectada no Pod payment-55fd',
    description: 'Liveness probe falhou no container payment-api.',
    severity: 'critical',
    departmentId: 'kubernetes',
    targetId: 'srv-prod-03',
    targetName: 'server-prod-03'
  }
];

export const INITIAL_AUDIT_LOGS: ITCommandAudit[] = [
  {
    id: 'aud-01',
    timestamp: '10:42:38',
    user: 'admin',
    userRole: 'NOC_DIRECTOR',
    command: 'kubectl describe pod payment-55fd -n production',
    targetId: 'node-03',
    targetName: 'k8s-node-03',
    targetType: 'k8s_pod',
    result: 'success',
    exitCode: 0,
    outputSummary: 'Exit code 0 (Output 42 lines)',
    durationMs: 140
  },
  {
    id: 'aud-02',
    timestamp: '10:35:10',
    user: 'beatriz.duarte',
    userRole: 'SECOPS_ANALYST',
    command: 'iptables -A INPUT -s 185.220.101.4 -j DROP',
    targetId: 'net-firewall-edge',
    targetName: 'Firewall-PaloAlto-NGFW',
    targetType: 'firewall',
    result: 'success',
    exitCode: 0,
    outputSummary: 'Regra de bloqueio injetada com sucesso',
    durationMs: 45
  },
  {
    id: 'aud-03',
    timestamp: '10:15:20',
    user: 'juliana.rossi',
    userRole: 'DEVOPS_ENG',
    command: 'argocd app sync backend-api',
    targetId: 'k8s-prod-cluster',
    targetName: 'K8S-PROD-BRAZIL',
    targetType: 'k8s_node',
    result: 'success',
    exitCode: 0,
    outputSummary: 'Synced commit a89c1f2 to production namespace',
    durationMs: 2100
  }
];
