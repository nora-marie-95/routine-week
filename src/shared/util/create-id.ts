/**
 * Locally-unique id for client-only records (no backend to coordinate uniqueness with).
 * Timestamp prefix keeps ids sortable by creation order; the random suffix avoids
 * collisions between ids created within the same millisecond.
 */
export const createId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `${timestamp}${random}`;
};
