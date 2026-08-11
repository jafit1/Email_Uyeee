export function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`skeleton ${className}`} {...props} />;
}

export function TableSkeleton({ rows = 5, cols = 3 }: { rows?: number; cols?: number }) {
  return (
    <div className="card overflow-x-auto">
      <table>
        <thead>
          <tr>
            {Array.from({ length: cols }, (_, i) => (
              <th key={i}><Skeleton style={{ height: "0.75rem", width: "5rem" }} /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, i) => (
            <tr key={i}>
              {Array.from({ length: cols }, (_, j) => (
                <td key={j}><Skeleton style={{ height: "0.875rem", width: j === 0 ? "12rem" : "6rem" }} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card">
      <Skeleton style={{ height: "1rem", width: "8rem", marginBottom: "0.75rem" }} />
      <Skeleton style={{ height: "2.5rem", width: "4rem" }} />
    </div>
  );
}
