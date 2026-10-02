export function getErrorMessage(err) {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.request) return 'Cannot reach the server. Check your connection and try again.';
  return 'Something went wrong. Please try again.';
}

export function applyServerErrors(err, setError) {
  const fields = err.response?.data?.errors;
  if (!fields) return false;
  Object.entries(fields).forEach(([name, message]) => setError(name, { type: 'server', message }));
  return true;
}

const dateFormat = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' });
const timeFormat = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' });

export const formatDate = (value) => dateFormat.format(new Date(value));
export const formatDateTime = (value) => `${dateFormat.format(new Date(value))}, ${timeFormat.format(new Date(value))}`;
