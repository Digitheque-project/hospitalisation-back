export const SERVICE_CHU_API_BASE_URL = (
  process.env.SERVICE_CHU_API_BASE_URL!
).replace(/\/+$/, '');

export function chuEndpoint(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SERVICE_CHU_API_BASE_URL}${normalized}`;
}
