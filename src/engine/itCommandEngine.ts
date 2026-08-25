import { 
  CommandActionType, 
  UserCommand, 
  ApprovalRequest, 
  AutomationRule, 
  ITServerNode,
  K8sCluster,
  ITDatabaseNode,
  ITCommandAudit
} from '../types';

export interface TerminalExecutionResult {
  exitCode: number;
  output: string;
  durationMs: number;
  actionTaken?: CommandActionType;
  remediatedTarget?: string;
}

export class ITCommandEngine {
  public static executeTerminalCommand(
    commandStr: string, 
    contextTarget?: { id: string; name: string; type: string }
  ): TerminalExecutionResult {
    const start = performance.now();
    const cmd = commandStr.trim();
    const lower = cmd.toLowerCase();

    if (!cmd) {
      return { exitCode: 0, output: '', durationMs: 2 };
    }

    if (lower === 'clear') {
      return { exitCode: 0, output: '__CLEAR__', durationMs: 2 };
    }

    if (lower === 'help') {
      return {
        exitCode: 0,
        output: [
          '╔════════════════════════════════════════════════════════════════════╗',
          '║               COMPANY OS - IT TERMINAL ENGINE (CLI v4.2)           ║',
          '╚════════════════════════════════════════════════════════════════════╝',
          '',
          'Comandos disponíveis:',
          '  • systemctl [status|restart|stop] <service>   - Controla serviços do sistema',
          '  • kubectl get pods [-A|-n <namespace>]        - Lista pods do Kubernetes',
          '  • kubectl get nodes                           - Lista status dos nós do cluster',
          '  • kubectl describe pod <pod_name>             - Detalhes de eventos e cgroups',
          '  • kubectl logs <pod_name> [--tail=N]          - Exibe logs em tempo real',
          '  • kubectl restart pod <pod_name>              - Reinicia pod e limpa CrashLoop',
          '  • docker ps                                   - Lista containers em execução',
          '  • docker restart <container_id>               - Reinicia container',
          '  • ping <hostname|ip>                          - Testa latência e pacotes',
          '  • traceroute <hostname|ip>                    - Rastreia saltos de rede',
          '  • top / htop / ps aux                         - Monitora processos e CPU',
          '  • df -h / free -m                             - Espaço em disco e memória RAM',
          '  • psql -c <sql>                               - Executa consulta no PostgreSQL',
          '  • redis-cli [ping|info]                       - Inspeciona cluster de cache Redis',
          '  • ai-investigate [target]                     - Aciona diagnóstico autônomo de IA',
          '  • auto-remediate [incident_id]                - Aplica correção e resolve incidente',
          '  • clear                                       - Limpa o terminal'
        ].join('\n'),
        durationMs: 12
      };
    }

    // AI Investigation Command
    if (lower.startsWith('ai-investigate') || lower.startsWith('diagnose')) {
      const target = cmd.split(' ')[1] || contextTarget?.name || 'node-03';
      return {
        exitCode: 0,
        output: [
          `[🤖 DevOps Agent] Iniciando diagnóstico neural profundo em: ${target}...`,
          '────────────────────────────────────────────────────────────────────────────',
          ' [✓] 1. Coleta de telemetria em tempo real (CPU, RAM, cgroups, I/O)',
          '     • Host: 10.0.1.13 | CPU: 93.8% | RAM: 91.2% | Load: 14.8 (Crítico)',
          ' [✓] 2. Inspeção de logs de Pods:',
          '     • Pod: payment-service-55fd90aa-qp89z (Namespace: production)',
          '     • Erro capturado: java.lang.OutOfMemoryError: Java heap space',
          '     • Causa-raiz identificada: Cgroup memory limit (2048Mi) insuficiente.',
          ' [!] 3. Ação recomendada:',
          '     • Execute: "kubectl set resources deployment payment-api --limits=memory=4096Mi"',
          '     • Ou execute o comando rápido: "auto-remediate inc-2026-001"',
          '────────────────────────────────────────────────────────────────────────────',
          'Diagnóstico concluído com 99.4% de confiança.'
        ].join('\n'),
        durationMs: 840,
        actionTaken: 'ai_investigate'
      };
    }

    // Auto-remediation command
    if (lower.startsWith('auto-remediate')) {
      return {
        exitCode: 0,
        output: [
          '⚡ Executando auto-remediação autônoma para Incidente inc-2026-001...',
          '• [1/4] Ajustando limites de memória cgroup para 4096Mi... [OK]',
          '• [2/4] Executando rollout restart no deployment payment-api... [OK]',
          '• [3/4] Aguardando liveness probe HTTP 200 no /healthz... [OK (12ms)]',
          '• [4/4] Normalizando métricas do nó node-03... [OK (CPU 36%, RAM 58%)]',
          '',
          '🎉 SUCESSO: Incidente resolvido. Todos os sistemas em estado HEALTHY 🟢.'
        ].join('\n'),
        durationMs: 1200,
        actionTaken: 'ai_auto_remediate',
        remediatedTarget: 'inc-2026-001'
      };
    }

    // systemctl commands
    if (lower.startsWith('systemctl')) {
      const parts = cmd.split(' ');
      const sub = parts[1] || 'status';
      const svc = parts[2] || 'nginx';

      if (sub === 'status') {
        const isFailed = svc === 'payment-worker' || (svc === 'nginx' && contextTarget?.name === 'server-prod-03');
        return {
          exitCode: isFailed ? 3 : 0,
          output: isFailed
            ? [
                `● ${svc}.service - ${svc} Application Service`,
                `     Loaded: loaded (/etc/systemd/system/${svc}.service; enabled)`,
                `     Active: failed (Result: exit-code) since ${new Date().toLocaleTimeString()}`,
                `    Process: 9842 ExecStart=/usr/bin/${svc} (code=exited, status=1/FAILURE)`,
                `   Main PID: 9842 (code=exited, status=1/FAILURE)`,
                '',
                `systemd[1]: ${svc}.service: Main process exited, code=exited, status=1/FAILURE`,
                `systemd[1]: ${svc}.service: Failed with result 'exit-code'.`
              ].join('\n')
            : [
                `● ${svc}.service - ${svc} Daemon`,
                `     Loaded: loaded (/etc/systemd/system/${svc}.service; enabled; vendor preset: enabled)`,
                `     Active: active (running) since Mon 2026-08-24 10:00:00 UTC; 24h ago`,
                `   Main PID: 1420 (${svc})`,
                `      Tasks: 8 (limit: 4915)`,
                `     Memory: 48.2M (limit: 512.0M)`,
                `        CPU: 1.284s`,
                `     CGroup: /system.slice/${svc}.service`,
                `             └─1420 /usr/sbin/${svc} -g daemon on;`
              ].join('\n'),
          durationMs: 85
        };
      }

      if (sub === 'restart') {
        return {
          exitCode: 0,
          output: `[OK] Serviço ${svc}.service reiniciado com sucesso via systemd.`,
          durationMs: 420,
          actionTaken: 'restart_service'
        };
      }

      if (sub === 'stop') {
        return {
          exitCode: 0,
          output: `[OK] Serviço ${svc}.service parado.`,
          durationMs: 210,
          actionTaken: 'stop_service'
        };
      }
    }

    // kubectl commands
    if (lower.startsWith('kubectl')) {
      if (lower.includes('get pods')) {
        return {
          exitCode: 0,
          output: [
            'NAME                               READY   STATUS             RESTARTS   AGE     IP            NODE',
            'api-gateway-7d8f4bc9-xk21p         1/1     Running            0          14d     10.244.1.42   k8s-node-01',
            'worker-queue-92ab81ef-mz44c        1/1     Running            1          6d      10.244.2.18   k8s-node-02',
            'payment-service-55fd90aa-qp89z     0/1     CrashLoopBackOff   14         3h      10.244.3.99   k8s-node-03',
            'auth-service-33ba11de-ll90k        1/1     Running            0          21d     10.244.2.66   k8s-node-02'
          ].join('\n'),
          durationMs: 95
        };
      }

      if (lower.includes('get nodes')) {
        return {
          exitCode: 0,
          output: [
            'NAME          STATUS     ROLES           AGE   VERSION   INTERNAL-IP   OS-IMAGE',
            'k8s-node-01   Ready      control-plane   97d   v1.30.2   10.0.1.11     Ubuntu 24.04 LTS',
            'k8s-node-02   Ready      worker          97d   v1.30.2   10.0.1.12     Ubuntu 24.04 LTS',
            'k8s-node-03   Ready      worker          97d   v1.30.2   10.0.1.13     Ubuntu 24.04 LTS (High Load)'
          ].join('\n'),
          durationMs: 80
        };
      }

      if (lower.includes('describe pod')) {
        return {
          exitCode: 0,
          output: [
            'Name:         payment-service-55fd90aa-qp89z',
            'Namespace:    production',
            'Node:         k8s-node-03/10.0.1.13',
            'Status:       Running (CrashLoopBackOff)',
            'Containers:',
            '  payment-api:',
            '    Image:          registry.internal/payment-svc:v4.1.2',
            '    State:          Waiting (CrashLoopBackOff)',
            '      Reason:       CrashLoopBackOff',
            '    Last State:     Terminated',
            '      Reason:       OOMKilled',
            '      Exit Code:    137',
            '    Limits:',
            '      cpu:     2',
            '      memory:  2048Mi',
            'Events:',
            '  Type     Reason     Age                  From               Message',
            '  ----     ------     ----                 ----               -------',
            '  Warning  BackOff    2m (x14 over 3h)     kubelet            Back-off restarting failed container payment-api',
            '  Warning  OOMKilled  2m (x14 over 3h)     cgroup-controller  Container payment-api exceeded memory limit (2048Mi)'
          ].join('\n'),
          durationMs: 110
        };
      }

      if (lower.includes('logs')) {
        return {
          exitCode: 0,
          output: [
            '2026-08-25T10:42:30.142Z [INFO] Initializing PaymentProcessorWorker thread pool (pool_size=128)',
            '2026-08-25T10:42:31.890Z [INFO] Connected to PostgreSQL Primary (10.0.1.20:5432)',
            '2026-08-25T10:42:32.411Z [WARN] JVM Old Generation memory threshold exceeded: 94.2% used',
            '2026-08-25T10:42:34.002Z [FATAL] java.lang.OutOfMemoryError: Java heap space',
            '    at com.company.payment.processor.BatchReconciliation.execute(BatchReconciliation.java:184)',
            '    at com.company.payment.worker.WorkerThread.run(WorkerThread.java:42)',
            '2026-08-25T10:42:34.100Z [SYSTEM] Signal 9 (SIGKILL) received from kernel (OOMKilled)'
          ].join('\n'),
          durationMs: 90
        };
      }

      if (lower.includes('restart pod')) {
        return {
          exitCode: 0,
          output: 'pod "payment-service-55fd90aa-qp89z" deleted (recreating new pod replica)... [OK]',
          durationMs: 650,
          actionTaken: 'k8s_restart_pod'
        };
      }
    }

    // docker commands
    if (lower.startsWith('docker')) {
      if (lower.includes('ps')) {
        return {
          exitCode: 0,
          output: [
            'CONTAINER ID   IMAGE                                COMMAND                  CREATED        STATUS                    PORTS                    NAMES',
            '9a8f1b2c3d4e   registry.internal/api-gw:v3.2        "/app/gateway"           14 days ago    Up 14 days                0.0.0.0:8080->8080/tcp   api-gateway',
            '1f2e3d4c5b6a   registry.internal/payment-svc:v4.1   "java -jar app.jar"      3 hours ago    Restarting (137) 20s ago                           payment-api',
            '8c7b6a5d4e3f   redis:7.2-alpine                     "docker-entrypoint.s…"   20 days ago    Up 20 days                0.0.0.0:6379->6379/tcp   redis-cache'
          ].join('\n'),
          durationMs: 70
        };
      }
      if (lower.includes('restart')) {
        return {
          exitCode: 0,
          output: 'Container restarted successfully.',
          durationMs: 400
        };
      }
    }

    // Network utilities: ping, traceroute, curl
    if (lower.startsWith('ping')) {
      const host = cmd.split(' ')[1] || '10.0.1.13';
      const isBad = host.includes('03') || host.includes('payment');
      return {
        exitCode: 0,
        output: isBad
          ? [
              `PING ${host} (${host}) 56(84) bytes of data.`,
              `64 bytes from ${host}: icmp_seq=1 ttl=64 time=94.2 ms`,
              `64 bytes from ${host}: icmp_seq=2 ttl=64 time=102.8 ms (HIGH JITTER)`,
              `64 bytes from ${host}: icmp_seq=3 ttl=64 time=88.4 ms`,
              `64 bytes from ${host}: icmp_seq=4 ttl=64 time=91.0 ms`,
              `--- ${host} ping statistics ---`,
              `4 packets transmitted, 4 received, 0% packet loss, time 3004ms`,
              `rtt min/avg/max/mdev = 88.4/94.1/102.8/5.2 ms`
            ].join('\n')
          : [
              `PING ${host} (${host}) 56(84) bytes of data.`,
              `64 bytes from ${host}: icmp_seq=1 ttl=64 time=1.21 ms`,
              `64 bytes from ${host}: icmp_seq=2 ttl=64 time=1.18 ms`,
              `64 bytes from ${host}: icmp_seq=3 ttl=64 time=1.24 ms`,
              `--- ${host} ping statistics ---`,
              `3 packets transmitted, 3 received, 0% packet loss, time 2002ms`,
              `rtt min/avg/max/mdev = 1.18/1.21/1.24/0.02 ms`
            ].join('\n'),
        durationMs: 140,
        actionTaken: 'ping_target'
      };
    }

    if (lower.startsWith('traceroute')) {
      const host = cmd.split(' ')[1] || 'api.internal';
      return {
        exitCode: 0,
        output: [
          `traceroute to ${host} (10.0.1.13), 30 hops max, 60 byte packets`,
          ' 1  router-core-bgp-01.infra (10.0.0.1)  0.842 ms  0.780 ms  0.812 ms',
          ' 2  firewall-paloalto-ngfw (10.0.0.2)   1.210 ms  1.190 ms  1.205 ms',
          ' 3  loadbalancer-traefik (10.0.0.10)   1.840 ms  1.820 ms  1.835 ms',
          ' 4  k8s-node-03.infra (10.0.1.13)       92.410 ms 94.120 ms 89.840 ms'
        ].join('\n'),
        durationMs: 180,
        actionTaken: 'traceroute_target'
      };
    }

    if (lower === 'free -m' || lower === 'free') {
      return {
        exitCode: 0,
        output: [
          '               total        used        free      shared  buff/cache   available',
          'Mem:          262144      238420       12410        4210       11314       18420',
          'Swap:          32768        8192       24576'
        ].join('\n'),
        durationMs: 30
      };
    }

    if (lower === 'df -h') {
      return {
        exitCode: 0,
        output: [
          'Filesystem      Size  Used Avail Use% Mounted on',
          '/dev/nvme0n1p2  3.8T  3.2T  580G  85% /',
          'tmpfs           128G  4.2G  124G   4% /dev/shm',
          '/dev/nvme1n1    1.9T  420G  1.5T  22% /var/lib/docker'
        ].join('\n'),
        durationMs: 35
      };
    }

    if (lower === 'uptime') {
      return {
        exitCode: 0,
        output: ' 10:45:00 up 97 days,  4:12,  2 users,  load average: 14.82, 12.19, 9.74',
        durationMs: 20
      };
    }

    // Default simulated output
    return {
      exitCode: 0,
      output: `[SIMULATED EXECUTION] Command executed successfully on target ${contextTarget?.name || 'localhost'}.\nExit status: 0`,
      durationMs: 60
    };
  }

  // Natural Language Parser for Ctrl+K
  public static parseNaturalCommand(rawText: string): {
    action: CommandActionType;
    targetName?: string;
    targetType?: string;
    requiresConfirmation: boolean;
    riskLevel: 'safe' | 'medium' | 'high' | 'critical';
    confirmationMessage?: string;
    suggestedExecution: string;
  } {
    const lower = rawText.toLowerCase();

    // Dangerous / High Risk commands
    if (
      lower.includes('reiniciar servidor') ||
      lower.includes('reboot server') ||
      lower.includes('restart server') ||
      lower.includes('derrubar') ||
      lower.includes('drop database')
    ) {
      const match = rawText.match(/(\d+|node-\w+|server-[\w-]+)/i);
      const target = match ? match[0] : 'server-prod-03';
      return {
        action: 'reboot_node',
        targetName: target.includes('server') ? target : `server-prod-03`,
        targetType: 'server',
        riskLevel: 'critical',
        requiresConfirmation: true,
        confirmationMessage: `⚠️ AÇÃO DE ALTO RISCO: Você solicitou o reboot forçado do servidor '${target}'. Isso causará queda momentânea de conexões ativas. Deseja confirmar?`,
        suggestedExecution: `reboot target ${target}`
      };
    }

    // Auto-fix / Resolve incident
    if (lower.includes('resolva') || lower.includes('corrija') || lower.includes('auto-remediar') || lower.includes('remediar')) {
      return {
        action: 'ai_auto_remediate',
        targetName: 'inc-2026-001',
        targetType: 'incident',
        riskLevel: 'medium',
        requiresConfirmation: false,
        suggestedExecution: 'auto-remediate inc-2026-001'
      };
    }

    // Pods / Kubernetes
    if (lower.includes('pod') || lower.includes('k8s') || lower.includes('crashloop')) {
      return {
        action: 'k8s_get_pods',
        targetName: 'K8S-PROD-BRAZIL',
        targetType: 'k8s_pod',
        riskLevel: 'safe',
        requiresConfirmation: false,
        suggestedExecution: 'kubectl get pods -A --field-selector status.phase!=Running'
      };
    }

    // Investigation / AI Diagnosis
    if (lower.includes('investigue') || lower.includes('analise') || lower.includes('por que') || lower.includes('lenta') || lower.includes('erro')) {
      const match = rawText.match(/(node-\w+|server-[\w-]+|\d+|api|pagamento|banco)/i);
      const target = match ? match[0] : 'node-03';
      return {
        action: 'ai_investigate',
        targetName: target,
        targetType: 'server',
        riskLevel: 'safe',
        requiresConfirmation: false,
        suggestedExecution: `ai-investigate ${target}`
      };
    }

    // Database health
    if (lower.includes('banco') || lower.includes('database') || lower.includes('postgres') || lower.includes('sql')) {
      return {
        action: 'db_check_connections',
        targetName: 'postgresql-primary-ha',
        targetType: 'database',
        riskLevel: 'safe',
        requiresConfirmation: false,
        suggestedExecution: 'psql -c "SELECT count(*) FROM pg_stat_activity;"'
      };
    }

    // Latency / Network
    if (lower.includes('latência') || lower.includes('ping') || lower.includes('rede') || lower.includes('tráfego')) {
      return {
        action: 'ping_target',
        targetName: 'server-prod-03',
        targetType: 'server',
        riskLevel: 'safe',
        requiresConfirmation: false,
        suggestedExecution: 'ping server-prod-03'
      };
    }

    // Default safe inspection
    return {
      action: 'health_check',
      targetName: 'Infraestrutura Global',
      targetType: 'server',
      riskLevel: 'safe',
      requiresConfirmation: false,
      suggestedExecution: 'kubectl get nodes && systemctl status'
    };
  }
}
