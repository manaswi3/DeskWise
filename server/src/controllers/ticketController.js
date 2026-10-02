import mongoose from 'mongoose';
import Ticket from '../models/Ticket.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { buildTicketFilter, paginationMeta } from '../utils/query.js';

async function loadAccessibleTicket(req) {
  const { id } = req.params;
  const ticket = mongoose.isValidObjectId(id) ? await Ticket.findById(id).populate('user', 'name email') : null;
  const ownerId = ticket?.user?._id?.toString();
  const allowed = ticket && (req.user.role === 'admin' || ownerId === req.user.id);
  if (!allowed) throw new AppError('Ticket not found', 404);
  return ticket;
}

export const createTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.create({ ...req.body, user: req.user.id });
  res.status(201).json({ ticket });
});

export const listMyTickets = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const filter = { ...buildTicketFilter(req.query), user: req.user._id };
  const [tickets, total] = await Promise.all([
    Ticket.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Ticket.countDocuments(filter),
  ]);
  res.json({ tickets, pagination: paginationMeta(total, page, limit) });
});

export const getTicket = asyncHandler(async (req, res) => {
  res.json({ ticket: await loadAccessibleTicket(req) });
});

export const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await loadAccessibleTicket(req);
  ticket.set(req.body);
  await ticket.save();
  res.json({ ticket });
});

export const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await loadAccessibleTicket(req);
  await ticket.deleteOne();
  res.json({ message: 'Ticket deleted' });
});
