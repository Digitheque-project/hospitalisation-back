/**
 * URL de base du service Dossier Patient.
 * Définir `DOSSIER_PATIENT_API_BASE_URL` dans l'environnement pour activer
 * l'archivage automatique des diagnostics lors de la clôture d'un épisode.
 * L'env ne porte QUE l'origine (https://host), SANS segment de service : le
 * prefixe "/dossier-patient" expose par le microservice est integre ici, cote code.
 */
export const DOSSIER_PATIENT_API_BASE_URL = (
  process.env.DOSSIER_PATIENT_API_BASE_URL || ''
).replace(/\/+$/, '');
​
/** Construit une URL absolue vers un chemin de l'API Dossier Patient (ex: `/diagnostics/archive`). */
export function dossierPatientEndpoint(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${DOSSIER_PATIENT_API_BASE_URL}/dossier-patient${normalized}`;
}
​