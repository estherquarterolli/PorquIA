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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      
      {/* Left Column (8 columns wide) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Top Row: Balance, Sells, Revenue */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[220px]">
          <div className="md:col-span-1 h-full">
            <BalanceCard />
          </div>
          <div className="md:col-span-1 h-full">
            <StatCard 
              title="Sells" 
              value="$2,400.00" 
              data={sellsData} 
              color="#ec4899" 
              gradientId="sellsGradient" 
              gradientColors={['#fbcfe8', '#ec4899']} 
            />
          </div>
          <div className="md:col-span-1 h-full">
            <StatCard 
              title="Revenue" 
              value="$1,250.00" 
              data={revenueData} 
              color="#eab308" 
              gradientId="revenueGradient" 
              gradientColors={['#fef08a', '#eab308']} 
            />
          </div>
        </div>

        {/* Bottom Row: Main Chart */}
        <div className="flex-1 min-h-[300px]">
          <MainChartCard />
        </div>
      </div>

      {/* Right Column (4 columns wide) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Activity */}
        <div className="h-[220px]">
           <ActivityCard />
        </div>

        {/* Payments */}
        <div className="h-[280px]">
           <PaymentsCard />
        </div>

        {/* Goals */}
        <div className="flex-1 min-h-[220px]">
           <GoalsCard />
        </div>

      </div>

    </div>
  );
}
