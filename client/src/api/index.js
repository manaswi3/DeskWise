import api from './client';

const clean = (params) => Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null));

export const authApi = {
  me: () => api.get('/auth/me').then((r) => r.data.user),
  login: (body) => api.post('/auth/login', body).then((r) => r.data.user),
  register: (body) => api.post('/auth/register', body).then((r) => r.data.user),
  logout: () => api.post('/auth/logout'),
};

export const ticketApi = {
  list: (params) => api.get('/tickets', { params: clean(params) }).then((r) => r.data),
  get: (id) => api.get(`/tickets/${id}`).then((r) => r.data.ticket),
  create: (body) => api.post('/tickets', body).then((r) => r.data.ticket),
  update: (id, body) => api.patch(`/tickets/${id}`, body).then((r) => r.data.ticket),
  remove: (id) => api.delete(`/tickets/${id}`),
};

export const adminApi = {
  tickets: (params) => api.get('/admin/tickets', { params: clean(params) }).then((r) => r.data),
  updateStatus: (id, status) => api.patch(`/admin/tickets/${id}/status`, { status }).then((r) => r.data.ticket),
  stats: () => api.get('/admin/stats').then((r) => r.data.stats),
  users: (params) => api.get('/admin/users', { params: clean(params) }).then((r) => r.data),
};
