import { Sidebar } from "@/components/sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="app-main">{children}</main>
      <style>{`
        .app-main {
          margin-left: 14rem;
          min-height: 100vh;
          padding: 2rem 1.5rem;
          max-width: 960px;
        }
        @media (max-width: 768px) {
          .app-main {
            margin-left: 0;
            padding: 1.25rem 1rem;
          }
        }
      `}</style>
    </>
  );
}
