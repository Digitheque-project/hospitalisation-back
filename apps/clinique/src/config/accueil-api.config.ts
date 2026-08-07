/**
 * URL de base du service accueil (hébergé par défaut sur Render).
 * Définir `ACCUEIL_API_BASE_URL` dans l'environnement pour pointer vers un autre hôte.
 * L'env ne porte QUE l'origine (https://host), SANS segment de service : le
 * prefixe "/accueil" expose par le microservice est integre ici, cote code.
 */
export const API_BASE_URL = (
  process.env.ACCUEIL_API_BASE_URL || ''
).replace(/\/+$/, '');

/** Construit une URL absolue vers un chemin de l'API accueil (ex: `/patients/...`). */
export function accueilEndpoint(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}/accueil${normalized}`;
}
