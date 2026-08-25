import { ITDepartmentId, ITHealthStatus, ITResourceType } from './index';

export type CommandActionType = 
  // Server & Node Actions
  | 'restart_service'
  | 'stop_service'
  | 'start_service'
  | 'reboot_node'
  | 'ping_target'
  | 'traceroute_target'
  | 'health_check'
  | 'enter_maintenance'
  | 'exit_maintenance'
  // K8s & Pod Actions
  | 'k8s_get_pods'
  | 'k8s_restart_pod'
  | 'k8s_describe_pod'
  | 'k8s_logs'
  | 'k8s_scale_deployment'
  // Database Actions
  | 'db_check_connections'
  | 'db_kill_slow_queries'
  | 'db_flush_cache'
  | 'db_backup_now'
  // Security & Network Actions
  | 'block_threat_ip'
  | 'flush_dns_cache'
  | 'renew_ssl_cert'
  | 'scan_vulnerabilities'
  // Incident & AI Agent Actions
  | 'ai_investigate'
  | 'ai_auto_remediate'
  | 'resolve_incident'
  | 'start_agent'
  | 'pause_agent'
  | 'stop_agent'
  | 'dispatch_task'
  // Custom CLI Command
  | 'run_terminal_command';

export interface UserCommand {
  id: string;
  timestamp: string;
  rawText: string;
  parsedAction: CommandActionType;
  targetId?: string;
  targetName?: string;
  targetType?: ITResourceType;
  departmentId?: ITDepartmentId;
  parameters?: Record<string, any>;
  riskLevel: 'safe' | 'medium' | 'high' | 'critical';
  requiresConfirmation: boolean;
  status: 'executed' | 'cancelled' | 'pending_confirmation' | 'failed';
  executedBy: string;
  executionOutput?: string;
  durationMs?: number;
}

export interface DirectEntityCommandPayload {
  entityId: string;
  action: CommandActionType;
  customCommand?: string;
  parameters?: Record<string, any>;
}

export interface ApprovalRequest {
  id: string;
  timestamp: string;
  requestedBy: {
    id: string;
    name: string;
    isAI: boolean;
    role: string;
  };
  title: string;
  description: string;
  riskLevel: 'high' | 'critical';
  impactSummary: string;
  affectedResource: {
    id: string;
    name: string;
    type: ITResourceType;
    environment: string;
  };
  suggestedAction: CommandActionType;
  actionPayload: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  triggerEvent: string;
  condition: string;
  targetAgent: string;
  automatedAction: CommandActionType;
  requiresHumanApproval: boolean;
  lastTriggeredAt?: string;
  executionsCount: number;
}
