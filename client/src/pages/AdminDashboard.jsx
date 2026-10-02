import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../api';
import { useDebounce, useFetch } from '../lib/hooks';
import { PRIORITIES, STATUSES } from '../lib/constants';
import { formatDate, getErrorMessage } from '../lib/utils';
import { PriorityMark, priorityStripe } from '../components/Badges';
import Pagination from '../components/Pagination';
import { EmptyState, ErrorState, ListSkeleton } from '../components/States';

const LIMIT = 10;

function StatStrip({ stats, status, onSelect }) {
  const cells = [
    { label: 'Total tickets', value: stats?.total, filter: '' },
    { label: 'Open', value: stats?.open, filter: 'Open' },
    { label: 'In progress', value: stats?.inProgress, filter: 'In Progress' },
    { label: 'Resolved', value: stats?.resolved, filter: 'Resolved' },
  ];
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
      {cells.map((c) => {
        const active = status === c.filter;
        return (
          <button
            key={c.label}
            type="button"
            onClick={() => onSelect(c.filter)}
            aria-pressed={active}
            className={`p-4 text-left transition-colors sm:p-5 ${active ? 'bg-brand-tint' : 'bg-white hover:bg-paper'}`}
          >
            <span className="block text-sm text-ink-soft">{c.label}</span>
            <span className={`mt-1 block font-display text-3xl font-bold ${active ? 'text-brand-dark' : ''}`}>
              {c.value ?? '–'}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function StatusSelect({ ticket, busy, onChange }) {
  return (
    <select
      value={ticket.status}
      disabled={busy}
      onChange={(e) => onChange(ticket, e.target.value)}
      aria-label={`Status for ${ticket.title}`}
      className="input min-h-[40px] py-1.5 sm:w-auto"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

function TicketsPanel() {
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const debounced = useDebounce(search.trim());

  const stats = useFetch(() => adminApi.stats(), []);
  const { data, loading, error, reload } = useFetch(
    () => adminApi.tickets({ page, limit: LIMIT, status: filters.status, priority: filters.priority, search: debounced }),
    [page, filters.status, filters.priority, debounced]
  );

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };
  const filtersActive = Boolean(filters.status || filters.priority || search);
  const clearFilters = () => {
    setFilters({ status: '', priority: '' });
    setSearch('');
    setPage(1);
  };

  const handleStatus = async (ticket, status) => {
    setUpdatingId(ticket.id);
    try {
      await adminApi.updateStatus(ticket.id, status);
      toast.success(`Status changed to ${status}`);
      reload();
      stats.reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  let content;
  if (error && !data) content = <ErrorState message={error} onRetry={reload} />;
  else if (!data) content = <ListSkeleton />;
  else if (data.tickets.length === 0)
    content = (
      <EmptyState
        title={filtersActive ? 'No matching tickets' : 'No tickets yet'}
        text={filtersActive ? 'Try changing or clearing the filters.' : 'Tickets raised by users will appear here.'}
        action={filtersActive && <button type="button" onClick={clearFilters} className="btn btn-secondary">Clear filters</button>}
      />
    );
  else
    content = (
      <div className={`transition-opacity ${loading ? 'opacity-60' : ''}`}>
        <div className="panel hidden overflow-hidden md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Ticket</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Priority</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.tickets.map((t) => (
                <tr key={t.id} className="hover:bg-paper/60">
                  <td className={`max-w-xs border-l-4 px-4 py-3 ${priorityStripe[t.priority]}`}>
                    <Link to={`/tickets/${t.id}`} className="block truncate font-semibold hover:text-brand">
                      {t.title}
                    </Link>
                    <span className="block truncate text-xs text-ink-mute">{t.user?.name ?? 'Deleted user'}</span>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{t.category}</td>
                  <td className="px-4 py-3">
                    <PriorityMark priority={t.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusSelect ticket={t} busy={updatingId === t.id} onChange={handleStatus} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{formatDate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="space-y-3 md:hidden">
          {data.tickets.map((t) => (
            <li key={t.id} className={`panel border-l-4 p-4 ${priorityStripe[t.priority]}`}>
              <Link to={`/tickets/${t.id}`} className="block font-semibold hover:text-brand">
                {t.title}
              </Link>
              <p className="mt-0.5 text-xs text-ink-mute">
                {t.user?.name ?? 'Deleted user'}, {formatDate(t.createdAt)}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-soft">
                <PriorityMark priority={t.priority} />
                <span>{t.category}</span>
              </div>
              <div className="mt-3">
                <StatusSelect ticket={t} busy={updatingId === t.id} onChange={handleStatus} />
              </div>
            </li>
          ))}
        </ul>

        <Pagination pagination={data.pagination} onChange={setPage} noun="tickets" />
      </div>
    );

  return (
    <div className="space-y-6">
      {stats.error && !stats.data ? (
        <ErrorState message={stats.error} onRetry={stats.reload} />
      ) : (
        <>
          <StatStrip stats={stats.data} status={filters.status} onSelect={(s) => setFilter('status', s)} />
          {stats.data && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-soft">
              <span>By priority</span>
              {[...PRIORITIES].reverse().map((p) => (
                <span key={p} className="inline-flex items-center gap-2">
                  <PriorityMark priority={p} />
                  <span className="font-semibold text-ink">{stats.data.byPriority[p]}</span>
                </span>
              ))}
            </div>
          )}
        </>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_180px_180px_auto]">
        <div className="relative sm:col-span-2 lg:col-span-1">
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
        <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)} aria-label="Filter by status" className="input">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select value={filters.priority} onChange={(e) => setFilter('priority', e.target.value)} aria-label="Filter by priority" className="input">
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        {filtersActive && (
          <button type="button" onClick={clearFilters} className="btn btn-ghost sm:col-span-2 lg:col-span-1">
            <X className="h-4 w-4" aria-hidden="true" />
            Clear
          </button>
        )}
      </div>

      {content}
    </div>
  );
}

function UsersPanel() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search.trim());
  const { data, loading, error, reload } = useFetch(() => adminApi.users({ page, limit: LIMIT, search: debounced }), [page, debounced]);

  let content;
  if (error && !data) content = <ErrorState message={error} onRetry={reload} />;
  else if (!data) content = <ListSkeleton rows={4} />;
  else if (data.users.length === 0) content = <EmptyState title="No users found" text="Try a different name or email." />;
  else
    content = (
      <div className={`transition-opacity ${loading ? 'opacity-60' : ''}`}>
        <div className="panel hidden overflow-hidden md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Tickets</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-semibold">{u.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3">{u.ticketCount}</td>
                  <td className="px-4 py-3 text-ink-soft">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="space-y-3 md:hidden">
          {data.users.map((u) => (
            <li key={u.id} className="panel p-4">
              <p className="font-semibold">{u.name}</p>
              <p className="break-all text-sm text-ink-soft">{u.email}</p>
              <p className="mt-2 text-xs text-ink-mute">
                <span className="capitalize">{u.role}</span>, {u.ticketCount} tickets, joined {formatDate(u.createdAt)}
              </p>
            </li>
          ))}
        </ul>
        <Pagination pagination={data.pagination} onChange={setPage} noun="users" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="relative sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or email"
          aria-label="Search users"
          className="input pl-9"
        />
      </div>
      {content}
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('tickets');
  const tabs = [
    { id: 'tickets', label: 'Tickets' },
    { id: 'users', label: 'Users' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold">Admin dashboard</h1>
      <p className="mt-1 text-ink-soft">The whole queue, with filters and quick status changes.</p>

      <div className="mt-6 flex gap-1 border-b border-line" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px min-h-[44px] border-b-2 px-4 text-sm font-semibold transition-colors ${
              tab === t.id ? 'border-brand text-brand-dark' : 'border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6" role="tabpanel">
        {tab === 'tickets' ? <TicketsPanel /> : <UsersPanel />}
      </div>
    </div>
  );
}
