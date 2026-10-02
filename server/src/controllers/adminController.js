import mongoose from 'mongoose';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { buildTicketFilter, escapeRegex, paginationMeta } from '../utils/query.js';

export const listAllTickets = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const filter = buildTicketFilter(req.query);
  const [tickets, total] = await Promise.all([
    Ticket.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Ticket.countDocuments(filter),
  ]);
  res.json({ tickets, pagination: paginationMeta(total, page, limit) });
});

export const updateTicketStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ticket = mongoose.isValidObjectId(id) ? await Ticket.findById(id).populate('user', 'name email') : null;
  if (!ticket) throw new AppError('Ticket not found', 404);
  ticket.status = req.body.status;
  await ticket.save();
  res.json({ ticket });
});

export const getStats = asyncHandler(async (_req, res) => {
  const [result] = await Ticket.aggregate([
    {
      $facet: {
        total: [{ $count: 'n' }],
        status: [{ $group: { _id: '$status', n: { $sum: 1 } } }],
        priority: [{ $group: { _id: '$priority', n: { $sum: 1 } } }],
      },
    },
  ]);
  const byStatus = Object.fromEntries(result.status.map((s) => [s._id, s.n]));
  const byPriority = Object.fromEntries(result.priority.map((p) => [p._id, p.n]));
  res.json({
    stats: {
      total: result.total[0]?.n ?? 0,
      open: byStatus.Open ?? 0,
      inProgress: byStatus['In Progress'] ?? 0,
      resolved: byStatus.Resolved ?? 0,
      byPriority: { Low: byPriority.Low ?? 0, Medium: byPriority.Medium ?? 0, High: byPriority.High ?? 0 },
    },
  });
});

export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  const filter = {};
  if (search) {
    const pattern = { $regex: escapeRegex(search), $options: 'i' };
    filter.$or = [{ name: pattern }, { email: pattern }];
  }
  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);
  const counts = await Ticket.aggregate([
    { $match: { user: { $in: users.map((u) => u._id) } } },
    { $group: { _id: '$user', n: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [c._id.toString(), c.n]));
  res.json({
    users: users.map((u) => ({ ...u.toJSON(), ticketCount: countMap.get(u.id) ?? 0 })),
    pagination: paginationMeta(total, page, limit),
  });
});
