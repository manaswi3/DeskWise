import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';

export const Spinner = ({ className = 'h-5 w-5' }) => <Loader2 className={`animate-spin ${className}`} aria-hidden="true" />;

export function PageLoader({ label = 'Loading' }) {
  return (
    <div className="grid min-h-[50vh] place-items-center text-ink-mute" role="status">
      <div className="flex items-center gap-3 text-sm">
        <Spinner />
        {label}
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="panel animate-pulse border-l-4 border-l-line p-4">
          <div className="h-4 w-2/5 rounded bg-line" />
          <div className="mt-3 h-3 w-4/5 rounded bg-line/70" />
          <div className="mt-3 h-3 w-1/4 rounded bg-line/70" />
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry, children }) {
  return (
    <div className="panel px-6 py-10 text-center" role="alert">
      <AlertTriangle className="mx-auto h-8 w-8 text-red-600" aria-hidden="true" />
      <h2 className="mt-3 text-lg font-semibold">We couldn't load this</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-ink-soft">{message}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn btn-primary">
            Try again
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="panel px-6 py-12 text-center">
      <Inbox className="mx-auto h-8 w-8 text-ink-mute" aria-hidden="true" />
      <h2 className="mt-3 text-lg font-semibold">{title}</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-ink-soft">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
