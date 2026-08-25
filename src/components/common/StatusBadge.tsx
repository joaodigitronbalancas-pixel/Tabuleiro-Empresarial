import React from 'react';
import { EntityStatus } from '../../types';

interface StatusBadgeProps {
  status: EntityStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  pulse?: boolean;
}

export const STATUS_CONFIG: Record<EntityStatus, {
  label: string;
  color: string;
  bg: string;
  border: string;
  dotColor: string;
  iconChar: string;
}> = {
  working: {
    label: 'Em Atividade',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/60',
    border: 'border-emerald-500/30',
    dotColor: 'bg-emerald-400',
    iconChar: '🟢'
  },
  walking: {
    label: 'Em Trânsito',
    color: 'text-cyan-300',
    bg: 'bg-cyan-950/60',
    border: 'border-cyan-500/30',
    dotColor: 'bg-cyan-400',
    iconChar: '🚶'
  },
  thinking: {
    label: 'Processando',
    color: 'text-amber-300',
    bg: 'bg-amber-950/60',
    border: 'border-amber-500/30',
    dotColor: 'bg-amber-400',
    iconChar: '🟡'
  },
  meeting: {
    label: 'Em Reunião',
    color: 'text-sky-400',
    bg: 'bg-sky-950/60',
    border: 'border-sky-500/30',
    dotColor: 'bg-sky-400',
    iconChar: '🔵'
  },
  idle: {
    label: 'Disponível',
    color: 'text-slate-300',
    bg: 'bg-slate-800/60',
    border: 'border-slate-600/30',
    dotColor: 'bg-slate-400',
    iconChar: '⚪'
  },
  completed: {
    label: 'Concluído',
    color: 'text-teal-300',
    bg: 'bg-teal-950/60',
    border: 'border-teal-500/30',
    dotColor: 'bg-teal-400',
    iconChar: '🟢'
  },
  warning: {
    label: 'Atenção',
    color: 'text-orange-400',
    bg: 'bg-orange-950/60',
    border: 'border-orange-500/30',
    dotColor: 'bg-orange-400',
    iconChar: '🟠'
  },
  error: {
    label: 'Erro / Falha',
    color: 'text-rose-400',
    bg: 'bg-rose-950/60',
    border: 'border-rose-500/30',
    dotColor: 'bg-rose-500',
    iconChar: '🔴'
  },
  offline: {
    label: 'Offline',
    color: 'text-zinc-400',
    bg: 'bg-zinc-900/80',
    border: 'border-zinc-700/30',
    dotColor: 'bg-zinc-600',
    iconChar: '⚫'
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showLabel = true,
  pulse = true
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.idle;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-2',
    lg: 'px-3.5 py-1.5 text-sm gap-2.5'
  }[size];

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${config.border} ${config.color} ${sizeClasses} whitespace-nowrap shrink-0 transition-colors`}
    >
      <span className="relative flex items-center justify-center">
        {pulse && (status === 'working' || status === 'thinking' || status === 'error') && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${config.dotColor}`}
          />
        )}
        <span className={`relative inline-flex rounded-full ${dotSizes} ${config.dotColor}`} />
      </span>
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};
