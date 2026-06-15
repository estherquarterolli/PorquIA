import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-20 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 px-10 pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
