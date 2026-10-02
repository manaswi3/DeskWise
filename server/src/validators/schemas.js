import { z } from 'zod';
import { CATEGORIES, PRIORITIES, STATUSES } from './constants.js';

const choice = (values, label) => z.enum(values, { errorMap: () => ({ message: `Choose a valid ${label}` }) });

const email = z.string().trim().toLowerCase().email('Enter a valid email address').max(254);

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name must be 50 characters or fewer'),
  email,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be 72 characters or fewer')
    .regex(/[A-Za-z]/, 'Password must include a letter')
    .regex(/\d/, 'Password must include a number'),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password').max(72),
});

const ticketFields = {
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(120, 'Title must be 120 characters or fewer'),
  description: z
    .string()
    .trim()
    .min(10, 'Describe the issue in at least 10 characters')
    .max(2000, 'Description must be 2000 characters or fewer'),
  category: choice(CATEGORIES, 'category'),
  priority: choice(PRIORITIES, 'priority'),
  status: choice(STATUSES, 'status'),
};

export const createTicketSchema = z.object({
  title: ticketFields.title,
  description: ticketFields.description,
  category: ticketFields.category,
  priority: ticketFields.priority,
});

export const updateTicketSchema = z
  .object(ticketFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: 'Provide at least one field to update' });

export const statusSchema = z.object({ status: ticketFields.status });

const page = z.coerce.number().int().min(1).default(1);
const limit = z.coerce.number().int().min(1).max(50).default(10);

export const ticketQuerySchema = z.object({
  page,
  limit,
  status: choice(STATUSES, 'status').optional(),
  priority: choice(PRIORITIES, 'priority').optional(),
  search: z.string().trim().max(100).optional(),
});

export const userQuerySchema = z.object({
  page,
  limit,
  search: z.string().trim().max(100).optional(),
});
