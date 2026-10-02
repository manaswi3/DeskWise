export const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function buildTicketFilter({ status, priority, search }) {
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) filter.title = { $regex: escapeRegex(search), $options: 'i' };
  return filter;
}

export function paginationMeta(total, page, limit) {
  return { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) };
}
