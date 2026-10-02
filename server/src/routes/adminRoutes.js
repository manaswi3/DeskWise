import { Router } from 'express';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { getStats, listAllTickets, listUsers, updateTicketStatus } from '../controllers/adminController.js';
import { statusSchema, ticketQuerySchema, userQuerySchema } from '../validators/schemas.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/tickets', validate(ticketQuerySchema, 'query'), listAllTickets);
router.patch('/tickets/:id/status', validate(statusSchema), updateTicketStatus);
router.get('/stats', getStats);
router.get('/users', validate(userQuerySchema, 'query'), listUsers);

export default router;
