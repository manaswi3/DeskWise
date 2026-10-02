import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ticketApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useFetch } from '../lib/hooks';
import { STATUSES } from '../lib/constants';
import { formatDateTime, getErrorMessage } from '../lib/utils';
import { PriorityMark, StatusBadge, priorityStripe } from '../components/Badges';
import ConfirmModal from '../components/ConfirmModal';
import TicketForm from '../components/TicketForm';
import { ErrorState, PageLoader } from '../components/States';

function Meta({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-medium text-ink-mute">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{children}</dd>
    </div>
  );
}

export default function TicketDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: ticket, error, reload } = useFetch(() => ticketApi.get(id), [id]);
  const [editing, setEditing] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const backTo = user.role === 'admin' ? '/admin' : '/tickets';
  const backLink = (
    <Link to={backTo} className="btn btn-secondary">
      Back to tickets
    </Link>
  );

  if (error && !ticket) return <ErrorState message={error} onRetry={reload}>{backLink}</ErrorState>;
  if (!ticket) return <PageLoader label="Loading ticket" />;

  const changeStatus = async (status) => {
    if (status === ticket.status) return;
    setSavingStatus(true);
    try {
      await ticketApi.update(id, { status });
      toast.success(`Status changed to ${status}`);
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingStatus(false);
    }
  };

  const saveEdits = async (values) => {
    await ticketApi.update(id, values);
    toast.success('Ticket updated');
    setEditing(false);
    reload();
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await ticketApi.remove(id);
      toast.success('Ticket deleted');
      navigate(backTo, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link to={backTo} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to tickets
      </Link>

      <article className={`panel mt-4 border-l-4 p-5 sm:p-8 ${priorityStripe[ticket.priority]}`}>
        {editing ? (
          <>
            <h1 className="text-2xl font-bold">Edit ticket</h1>
            <div className="mt-6">
              <TicketForm
                defaultValues={{
                  title: ticket.title,
                  category: ticket.category,
                  priority: ticket.priority,
                  description: ticket.description,
                }}
                onSubmit={saveEdits}
                submitLabel="Save changes"
                onCancel={() => setEditing(false)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <h1 className="break-words text-2xl font-bold sm:text-3xl">{ticket.title}</h1>
              <div className="shrink-0">
                <StatusBadge status={ticket.status} />
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-5 border-y border-line py-5 sm:grid-cols-4">
              <Meta label="Category">{ticket.category}</Meta>
              <Meta label="Priority">
                <PriorityMark priority={ticket.priority} />
              </Meta>
              <Meta label="Created">{formatDateTime(ticket.createdAt)}</Meta>
              <Meta label="Last updated">{formatDateTime(ticket.updatedAt)}</Meta>
              {user.role === 'admin' && ticket.user && (
                <div className="col-span-2 sm:col-span-4">
                  <Meta label="Raised by">
                    {ticket.user.name} <span className="font-normal text-ink-soft">({ticket.user.email})</span>
                  </Meta>
                </div>
              )}
            </dl>

            <h2 className="mt-6 font-sans text-sm font-semibold">Description</h2>
            <p className="mt-2 max-w-prose whitespace-pre-wrap break-words text-ink-soft">{ticket.description}</p>

            <div className="mt-8">
              <h2 className="font-sans text-sm font-semibold" id="status-label">
                Update status
              </h2>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3" role="group" aria-labelledby="status-label">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={savingStatus}
                    aria-pressed={ticket.status === s}
                    onClick={() => changeStatus(s)}
                    className={`btn border ${ticket.status === s ? 'border-brand bg-brand-tint text-brand-dark' : 'border-line bg-white hover:bg-paper'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
              <button type="button" className="btn btn-secondary" onClick={() => setEditing(true)}>
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Edit ticket
              </button>
              <button type="button" className="btn btn-secondary text-red-700 hover:bg-red-50" onClick={() => setConfirmOpen(true)}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete
              </button>
            </div>
          </>
        )}
      </article>

      <ConfirmModal
        open={confirmOpen}
        title="Delete this ticket?"
        message="This permanently removes the ticket and can't be undone."
        confirmLabel="Delete ticket"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
