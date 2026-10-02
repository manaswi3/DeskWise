import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { ticketApi } from '../api';
import TicketForm from '../components/TicketForm';

export default function NewTicket() {
  const navigate = useNavigate();

  const handleCreate = async (values) => {
    const ticket = await ticketApi.create(values);
    toast.success('Ticket created');
    navigate(`/tickets/${ticket.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/tickets" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to tickets
      </Link>
      <h1 className="mt-4 text-3xl font-bold">New ticket</h1>
      <p className="mt-1 text-ink-soft">The more detail you give, the faster it gets resolved.</p>
      <div className="panel mt-6 p-5 sm:p-8">
        <TicketForm onSubmit={handleCreate} submitLabel="Create ticket" onCancel={() => navigate('/tickets')} />
      </div>
    </div>
  );
}
