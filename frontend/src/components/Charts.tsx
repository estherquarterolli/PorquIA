'use client';

import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Area, AreaChart,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const COLORS = [
  '#3b82f6', '#f43f5e', '#f59e0b', '#10b981',
  '#8b5cf6', '#06b6d4', '#f97316', '#ec4899',
  '#14b8a6', '#6366f1',
];

const tooltipStyle = {
  borderRadius: '16px',
  border: 'none',
  boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
  fontSize: '13px',
};

function brl(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

// --- Pie: despesas por categoria ---

interface CategoriesChartProps {
  data: Record<string, number>;
}

export function CategoriesChart({ data }: CategoriesChartProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: parseFloat(value.toFixed(2)),
  }));

  if (chartData.length === 0) {
    return <p className="text-slate-500 text-center py-8">Sem dados para exibir</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
          outerRadius={90}
          innerRadius={28}
          paddingAngle={2}
          dataKey="value"
          strokeWidth={0}
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: any) => brl(Number(value))} contentStyle={tooltipStyle} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

// --- Bar: receitas (blue) vs despesas (coral) por mês ---

export interface MonthlyData {
  month: string;
  label: string;
  despesas: number;
  receitas: number;
}

interface MonthlyChartProps {
  data: MonthlyData[];
}

export function MonthlyBarChart({ data }: MonthlyChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-slate-500 text-center py-8">Sem dados para exibir</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `R$${v}`} tickLine={false} axisLine={false} />
        <Tooltip formatter={(value: any) => brl(Number(value))} contentStyle={tooltipStyle} />
        <Legend />
        <Bar dataKey="receitas" name="Receitas" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        <Bar dataKey="despesas" name="Despesas" fill="#f43f5e" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// --- Area: evolução diária do saldo (always blue gradient) ---

export interface DailyBalance {
  day: string;
  saldo: number;
}

interface DailyBalanceChartProps {
  data: DailyBalance[];
}

export function DailyBalanceChart({ data }: DailyBalanceChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-slate-500 text-center py-8">Sem transações este mês</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
        <defs>
          <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.22} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `R$${v}`} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(value: any) => brl(Number(value))}
          labelFormatter={(l) => `Dia ${l}`}
          contentStyle={tooltipStyle}
        />
        <Area
          type="monotone"
          dataKey="saldo"
          name="Saldo"
          stroke="#3b82f6"
          fill="url(#balanceGrad)"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// --- Activity: donut receitas vs despesas ---

interface ActivityChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export function ActivityChart({ data }: ActivityChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-slate-500 text-center py-8">Sem dados</p>;
  }

  const validData = data.filter(d => d.value > 0);

  if (validData.length === 0) {
    return <p className="text-slate-500 text-center py-8">Sem atividade</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={validData}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {validData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex gap-6">
        {validData.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
              {item.name} · {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Mini bar: investment history (gold) ---

export interface InvestmentMonth {
  month: string;
  label: string;
  total: number;
}

interface InvestmentBarChartProps {
  data: InvestmentMonth[];
}

export function InvestmentBarChart({ data }: InvestmentBarChartProps) {
  if (!data || data.length === 0 || data.every(d => d.total === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <TrendingUp className="w-10 h-10 mb-3 text-slate-300 dark:text-slate-600" />
        <p className="text-sm font-medium">Nenhum aporte registrado</p>
        <p className="text-xs mt-1">Adicione transações com categoria &quot;investimento&quot;</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `R$${v}`} tickLine={false} axisLine={false} />
        <Tooltip formatter={(v: any) => brl(Number(v))} contentStyle={tooltipStyle} />
        <Bar dataKey="total" name="Aportado" fill="#f59e0b" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
