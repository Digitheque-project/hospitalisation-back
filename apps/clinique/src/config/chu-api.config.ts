export const SERVICE_CHU_API_BASE_URL = (
  process.env.SERVICE_CHU_API_BASE_URL || ''
).replace(/\/+$/, '');

function requireServiceChuBaseUrl(): string {
  if (!SERVICE_CHU_API_BASE_URL) {
    throw new Error('SERVICE_CHU_API_BASE_URL est obligatoire pour appeler le service CHU.');
  }

  return SERVICE_CHU_API_BASE_URL;
}

export function chuEndpoint(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${requireServiceChuBaseUrl()}${normalized}`;
}
