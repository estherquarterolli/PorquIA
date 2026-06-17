'use client';

import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  trend?: number;
  /** true = subir é bom (receita); false = subir é ruim (despesa) */
  positiveIsGood?: boolean;
  data: { value: number }[];
  color: string;
  Icon: LucideIcon;
}

export function StatCard({ label, value, trend, positiveIsGood = true, data, color, Icon }: StatCardProps) {
  const id = `spark-${label.replace(/\s/g, '')}`;
  const good = trend === undefined ? true : positiveIsGood ? trend >= 0 : trend <= 0;

  return (
    <div className="card card-hover p-5 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <span
          className="w-10 h-10 rounded-xl grid place-items-center"
          style={{ backgroundColor: `${color}1f`, color }}
        >
          <Icon className="w-5 h-5" strokeWidth={2.2} />
        </span>
        {trend !== undefined && (
          <span
            className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${
              good
                ? 'text-emerald-600 bg-emerald-500/12 dark:text-emerald-400'
                : 'text-rose-600 bg-rose-500/12 dark:text-rose-400'
            }`}
          >
            {trend >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">{value}</h3>

      <div className="h-12 mt-auto -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 2, left: 2, bottom: 0 }}>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              fill={`url(#${id})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
