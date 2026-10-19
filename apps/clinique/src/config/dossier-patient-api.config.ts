/**
 * URL de base du service Dossier Patient.
 * Origine lue dans GATEWAY_URL (passerelle du CHU) ; sans elle, pas
 * d'archivage automatique des diagnostics à la clôture d'un épisode.
 * L'env ne porte QUE l'origine (https://host), SANS segment de service : le
 * prefixe "/dossier-patient" expose par le microservice est integre ici, cote code.
 */
export const DOSSIER_PATIENT_API_BASE_URL = (
  process.env.GATEWAY_URL || ''
).replace(/\/+$/, '');
​
/** Construit une URL absolue vers un chemin de l'API Dossier Patient (ex: `/diagnostics/archive`). */
export function dossierPatientEndpoint(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${DOSSIER_PATIENT_API_BASE_URL}/dossier-patient${normalized}`;
}
​