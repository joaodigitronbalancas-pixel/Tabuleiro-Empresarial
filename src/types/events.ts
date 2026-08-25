import { ITDepartmentId, ITHealthStatus, ITResourceType } from './index';

export type ITEventType = 
  | 'incident_detected'
  | 'incident_investigating'
  | 'incident_remediated'
  | 'incident_resolved'
  | 'server_high_cpu'
  | 'server_high_ram'
  | 'server_crashed'
  | 'server_rebooted'
  | 'k8s_pod_crashed'
  | 'k8s_pod_restarted'
  | 'k8s_node_degraded'
  | 'database_slow_query'
  | 'database_failover'
  | 'network_spike'
  | 'ddos_attack_blocked'
  | 'security_vulnerability_found'
  | 'pipeline_started'
  | 'pipeline_success'
  | 'pipeline_failed'
  | 'agent_action_executed'
  | 'terminal_command_executed'
  | 'siren_alert_toggled';

export type EventSeverity = 'info' | 'success' | 'warning' | 'critical';

export interface LiveEvent {
  id: string;
  timestamp: string;
  timeFormatted: string;
  type: ITEventType;
  title: string;
  description: string;
  severity: EventSeverity;
  departmentId?: ITDepartmentId;
  targetId?: string;
  targetName?: string;
  targetType?: ITResourceType;
  metadata?: Record<string, any>;
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  departmentId: ITDepartmentId;
  targetId?: string;
  targetName?: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  source: string;
  actionRequired?: string;
}

export type CompanyEventType = ITEventType;
export type CompanyEventPayloadMap = Record<string, any>;
export interface CompanyEvent {
  type: ITEventType;
  payload: any;
}
