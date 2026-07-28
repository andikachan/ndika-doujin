function Shimmer({ className = "" }) {
  return (
    <div
      className={`animate-shimmer rounded-md bg-border-light bg-[length:400px_100%] bg-gradient-to-r from-border-light via-white/60 to-border-light dark:bg-border-dark dark:from-border-dark dark:via-white/5 dark:to-border-dark ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border-light dark:border-border-dark">
      <Shimmer className="aspect-[3/4] w-full rounded-none" />
      <div className="space-y-2 p-3">
        <Shimmer className="h-3.5 w-full" />
        <Shimmer className="h-3.5 w-2/3" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TextLineSkeleton({ className = "h-4 w-full" }) {
  return <Shimmer className={className} />;
}

export default function LoadingSkeleton({ variant = "grid", count }) {
  if (variant === "card") return <CardSkeleton />;
  return <GridSkeleton count={count} />;
}
