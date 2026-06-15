'use client';

import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityCard } from '@/components/dashboard/ActivityCard';
import { MainChartCard } from '@/components/dashboard/MainChartCard';
import { PaymentsCard } from '@/components/dashboard/PaymentsCard';
import { GoalsCard } from '@/components/dashboard/GoalsCard';

const sellsData = [
  { value: 20 }, { value: 40 }, { value: 30 }, { value: 70 }, { value: 50 }, { value: 90 }, { value: 80 }
];

const revenueData = [
  { value: 10 }, { value: 30 }, { value: 20 }, { value: 50 }, { value: 40 }, { value: 80 }, { value: 70 }
];

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 grid-flow-row-dense gap-6 h-full pb-10 lg:pb-0">
      
      {/* Main Chart spans large area */}
      <div className="md:col-span-2 lg:col-span-8 lg:row-span-2 min-h-[320px]">
        <MainChartCard />
      </div>

      {/* Stats Cards */}
      <div className="md:col-span-1 lg:col-span-4 min-h-[160px]">
        <StatCard 
          title="Sells" 
          value="$2,400.00" 
          data={sellsData} 
          color="#ec4899" 
          gradientId="sellsGradient" 
          gradientColors={['#fbcfe8', '#ec4899']} 
        />
      </div>
      <div className="md:col-span-1 lg:col-span-4 min-h-[160px]">
        <StatCard 
          title="Revenue" 
          value="$1,250.00" 
          data={revenueData} 
          color="#eab308" 
          gradientId="revenueGradient" 
          gradientColors={['#fef08a', '#eab308']} 
        />
      </div>

      {/* Balance Card */}
      <div className="md:col-span-2 lg:col-span-4 lg:row-span-1 min-h-[200px]">
        <BalanceCard />
      </div>

      {/* Activity */}
      <div className="md:col-span-1 lg:col-span-4 lg:row-span-1 min-h-[240px]">
         <ActivityCard />
      </div>

      {/* Payments */}
      <div className="md:col-span-1 lg:col-span-4 lg:row-span-1 min-h-[260px]">
         <PaymentsCard />
      </div>

      {/* Goals */}
      <div className="md:col-span-2 lg:col-span-4 lg:row-span-1 min-h-[260px]">
         <GoalsCard />
      </div>

    </div>
  );
}
