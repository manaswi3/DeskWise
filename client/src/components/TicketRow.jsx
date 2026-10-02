import { Link } from 'react-router-dom';
import { CalendarDays, Tag } from 'lucide-react';
import { PriorityMark, StatusBadge, priorityStripe } from './Badges';
import { formatDate } from '../lib/utils';

export default function TicketRow({ ticket }) {
  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className={`panel block border-l-4 p-4 transition-shadow hover:shadow-md sm:p-5 ${priorityStripe[ticket.priority]}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="truncate font-sans text-base font-semibold">{ticket.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{ticket.description}</p>
        </div>
        <div className="shrink-0">
          <StatusBadge status={ticket.status} />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-soft">
        <PriorityMark priority={ticket.priority} />
        <span className="inline-flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5" aria-hidden="true" />
          {ticket.category}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          {formatDate(ticket.createdAt)}
        </span>
      </div>
    </Link>
  );
}
