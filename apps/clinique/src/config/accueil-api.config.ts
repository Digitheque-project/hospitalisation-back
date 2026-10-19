/**
 * URL de base du service accueil.
 * Origine lue dans GATEWAY_URL (passerelle du CHU, partagée par tous les appels).
 * L'env ne porte QUE l'origine (https://host), SANS segment de service : le
 * prefixe "/accueil" expose par le microservice est integre ici, cote code.
 */
export const API_BASE_URL = (
  process.env.GATEWAY_URL || ''
).replace(/\/+$/, '');

/** Construit une URL absolue vers un chemin de l'API accueil (ex: `/patients/...`). */
export function accueilEndpoint(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}/accueil${normalized}`;
}
