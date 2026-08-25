import React from 'react';
import { MiniSparkline } from './MiniSparkline';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  icon?: LucideIcon;
  sparklineData?: number[];
  sparklineColor?: string;
  badge?: string;
  onClick?: () => void;
  accentColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  subtitle,
  icon: Icon,
  sparklineData,
  sparklineColor = '#3b82f6',
  badge,
  onClick,
  accentColor
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative bg-[#0d121f] border border-white/[0.08] rounded-xl p-4.5 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-blue-500/40 hover:bg-[#111728]' : ''
      }`}
      style={{
        borderTopColor: accentColor ? accentColor : undefined,
        borderTopWidth: accentColor ? '2px' : undefined
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-300">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        </div>

        {badge && (
          <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25 whitespace-nowrap">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-3 mt-1">
        <div>
          <div className="text-2xl font-bold text-slate-100 tracking-tight">{value}</div>
          
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {change && (
              <span
                className={`inline-flex items-center text-xs font-semibold whitespace-nowrap ${
                  changeType === 'positive'
                    ? 'text-emerald-400'
                    : changeType === 'negative'
                    ? 'text-rose-400'
                    : 'text-slate-400'
                }`}
              >
                {changeType === 'positive' ? (
                  <TrendingUp className="w-3.5 h-3.5 mr-1 inline" />
                ) : changeType === 'negative' ? (
                  <TrendingDown className="w-3.5 h-3.5 mr-1 inline" />
                ) : null}
                {change}
              </span>
            )}
            {subtitle && <span className="text-xs text-slate-400 truncate max-w-[170px]">{subtitle}</span>}
          </div>
        </div>

        {sparklineData && (
          <div className="shrink-0 mb-1">
            <MiniSparkline data={sparklineData} color={sparklineColor} width={80} height={32} />
          </div>
        )}
      </div>
    </div>
  );
};
