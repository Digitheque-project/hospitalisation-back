export const NOTIFICATION_API_BASE_URL = (
  process.env.GATEWAY_URL || ''
).replace(/\/+$/, '');

export function notificationEndpoint(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${NOTIFICATION_API_BASE_URL}${normalized}`;
}
