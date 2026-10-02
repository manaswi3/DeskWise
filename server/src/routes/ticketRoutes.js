import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createTicket,
  deleteTicket,
  getTicket,
  listMyTickets,
  updateTicket,
} from '../controllers/ticketController.js';
import { createTicketSchema, ticketQuerySchema, updateTicketSchema } from '../validators/schemas.js';

const router = Router();

router.use(requireAuth);

router.route('/').post(validate(createTicketSchema), createTicket).get(validate(ticketQuerySchema, 'query'), listMyTickets);
router.route('/:id').get(getTicket).patch(validate(updateTicketSchema), updateTicket).delete(deleteTicket);

export default router;
