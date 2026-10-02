import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { ticketApi } from '../api';
import { useDebounce, useFetch } from '../lib/hooks';
import { STATUSES } from '../lib/constants';
import TicketRow from '../components/TicketRow';
import Pagination from '../components/Pagination';
import { EmptyState, ErrorState, ListSkeleton } from '../components/States';

const LIMIT = 8;

export default function MyTickets() {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search.trim());

  const { data, loading, error, reload } = useFetch(
    () => ticketApi.list({ page, limit: LIMIT, status, search: debounced }),
    [page, status, debounced]
  );

  const filtersActive = Boolean(status || debounced);
  const newTicketButton = (
    <Link to="/tickets/new" className="btn btn-primary">
      <Plus className="h-4 w-4" aria-hidden="true" />
      New ticket
    </Link>
  );

  const changeStatus = (value) => {
    setStatus(value);
    setPage(1);
  };

  let content;
  if (error && !data) content = <ErrorState message={error} onRetry={reload} />;
  else if (!data) content = <ListSkeleton />;
  else if (data.tickets.length === 0)
    content = filtersActive ? (
      <EmptyState title="No matching tickets" text="Try a different status or search term." />
    ) : (
      <EmptyState title="No tickets yet" text="Create your first ticket and we'll track it from here." action={newTicketButton} />
    );
  else
    content = (
      <>
        <ul className={`space-y-3 transition-opacity ${loading ? 'opacity-60' : ''}`}>
          {data.tickets.map((t) => (
            <li key={t.id}>
              <TicketRow ticket={t} />
            </li>
          ))}
        </ul>
        <Pagination pagination={data.pagination} onChange={setPage} noun="tickets" />
      </>
    );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">My tickets</h1>
          <p className="mt-1 text-ink-soft">Everything you've raised, newest first.</p>
        </div>
        {newTicketButton}
      </div>

      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="group" aria-label="Filter by status">
          {['', ...STATUSES].map((s) => (
            <button
              key={s || 'all'}
              type="button"
              onClick={() => changeStatus(s)}
              aria-pressed={status === s}
              className={`btn shrink-0 border px-4 ${status === s ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink hover:bg-paper'}`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
        <div className="relative lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title"
            aria-label="Search tickets by title"
            className="input pl-9"
          />
        </div>
      </div>

      <div className="mt-5">{content}</div>
    </div>
  );
}
