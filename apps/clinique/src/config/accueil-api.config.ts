/**
 * URL de base du service accueil (hébergé par défaut sur Render).
 * Définir `ACCUEIL_API_BASE_URL` dans l'environnement pour pointer vers un autre hôte.
 */
export const API_BASE_URL = (
  process.env.ACCUEIL_API_BASE_URL || ''
).replace(/\/+$/, '');

/** Construit une URL absolue vers un chemin de l'API accueil (ex: `/api/patients/...`). */
export function accueilEndpoint(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}
