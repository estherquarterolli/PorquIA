import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 lg:ml-20 flex flex-col min-h-screen pb-20 lg:pb-0">
        <Header />
        <main className="flex-1 px-4 lg:px-10 pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
