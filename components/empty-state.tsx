import Link from "next/link";

export function EmptyState({
  icon = "📭",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="card" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{icon}</div>
      <h3 style={{ fontWeight: 600, fontSize: "1.125rem", marginBottom: "0.5rem" }}>{title}</h3>
      {description && (
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>
          {description}
        </p>
      )}
      {action && (
        <Link href={action.href} className="btn btn-primary" style={{ display: "inline-flex" }}>
          {action.label}
        </Link>
      )}
    </div>
  );
}
