// O shell (sidebar, topbar, nav mobile e proteção de rota) é provido globalmente
// por <AppShell> no layout raiz. Aqui só repassamos o conteúdo.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
