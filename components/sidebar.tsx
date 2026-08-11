"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FolderKey,
  LayoutDashboard,
  LogOut,
  Mail,
  ScrollText,
  Settings,
  Tags,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/emails", label: "Email", Icon: Mail },
  { href: "/labels", label: "Label", Icon: Tags },
  { href: "/audit", label: "Audit Log", Icon: ScrollText },
  { href: "/settings", label: "Keamanan", Icon: Settings },
];

export function Sidebar() {
  const path = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <FolderKey size={22} aria-hidden="true" />
        <span className="text-xl font-bold">Vault</span>
      </div>
      <nav className="sidebar-nav" aria-label="Navigasi utama">
        {NAV.map(({ href, label, Icon }) => {
          const active = path === href || (href !== "/dashboard" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-link${active ? " sidebar-link-active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <button type="button" className="btn btn-ghost w-full justify-center" onClick={logout}>
          <LogOut size={16} aria-hidden="true" />
          Logout
        </button>
      </div>

      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 14rem;
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--sidebar-bg);
          border-right: 1px solid var(--border);
          padding: 1.25rem 0.75rem;
          z-index: 30;
        }
        .sidebar-brand {
          padding: 0 0.5rem 1.25rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 1rem;
        }
        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-muted);
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .sidebar-link:hover {
          background: var(--sidebar-active);
          color: var(--text);
          text-decoration: none;
        }
        .sidebar-link-active {
          background: var(--sidebar-active);
          color: var(--accent);
          font-weight: 600;
        }
        .sidebar-footer {
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }

        @media (max-width: 768px) {
          .sidebar {
            position: relative;
            width: 100%;
            height: auto;
            flex-direction: row;
            align-items: center;
            padding: 0.5rem;
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
          .sidebar-brand {
            padding: 0 0.5rem;
            border-bottom: none;
            margin-bottom: 0;
          }
          .sidebar-nav {
            flex-direction: row;
            gap: 0.125rem;
            overflow-x: auto;
          }
          .sidebar-link span:last-child {
            display: none;
          }
          .sidebar-link {
            padding: 0.5rem;
          }
          .sidebar-footer {
            padding-top: 0;
            border-top: none;
            margin-left: auto;
          }
          .sidebar-footer button {
            padding: 0.375rem 0.75rem;
            font-size: 0.8125rem;
          }
        }
      `}</style>
    </aside>
  );
}
