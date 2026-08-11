import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import { ToastProvider } from "@/components/toast";
import { currentUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!(await currentUser())) redirect("/login");

  return (
    <ToastProvider>
      <AppShell>{children}</AppShell>
    </ToastProvider>
  );
}
