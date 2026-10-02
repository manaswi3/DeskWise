import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagination, onChange, noun = 'results' }) {
  if (!pagination || pagination.total === 0) return null;
  const { page, pages, total, limit } = pagination;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <nav className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row" aria-label="Pagination">
      <p className="text-sm text-ink-soft">
        Showing {from} to {to} of {total} {noun}
      </p>
      {pages > 1 && (
        <div className="flex items-center gap-2">
          <button type="button" className="btn btn-secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Previous
          </button>
          <span className="min-w-[88px] text-center text-sm font-medium">
            Page {page} of {pages}
          </span>
          <button type="button" className="btn btn-secondary" disabled={page >= pages} onClick={() => onChange(page + 1)}>
            Next
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </nav>
  );
}
