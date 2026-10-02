const STATUS_STYLES = {
  Open: { pill: 'bg-slate-100 text-slate-700 ring-slate-300', dot: 'bg-slate-500' },
  'In Progress': { pill: 'bg-blue-50 text-blue-800 ring-blue-200', dot: 'bg-blue-600' },
  Resolved: { pill: 'bg-emerald-50 text-emerald-800 ring-emerald-200', dot: 'bg-emerald-600' },
};

const PRIORITY_STYLES = {
  Low: { bars: 1, fill: 'bg-emerald-600' },
  Medium: { bars: 2, fill: 'bg-amber-500' },
  High: { bars: 3, fill: 'bg-red-600' },
};

export const priorityStripe = {
  Low: 'border-l-emerald-600',
  Medium: 'border-l-amber-500',
  High: 'border-l-red-600',
};

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${style.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

export function PriorityMark({ priority }) {
  const { bars, fill } = PRIORITY_STYLES[priority];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft">
      <span className="flex items-end gap-0.5" aria-hidden="true">
        {[8, 12, 16].map((h, i) => (
          <span key={h} style={{ height: h }} className={`w-1 rounded-sm ${i < bars ? fill : 'bg-line'}`} />
        ))}
      </span>
      {priority}
    </span>
  );
}
