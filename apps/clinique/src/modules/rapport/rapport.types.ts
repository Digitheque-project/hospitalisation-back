/**
 * Types de l'agregation hebdomadaire du VOLET ACTIVITES (RMA).
 *
 * Ces valeurs sont calculees a partir des episodes d'hospitalisation existants
 * et servent au PRE-REMPLISSAGE automatique du rapport. Les cases non
 * calculables (ex. demunis/PEC, taux) restent editables cote front.
 */
export interface RapportHebdoJour {
  /** Cle ISO du jour (ex. "2026-06-08"). */
  date: string;
  /** Libelle jour (ex. "Lundi"). */
  libelle: string;
  /** Admissions dont la date d'admission tombe ce jour. */
  nbAdmissions: number;
  /** Patients presents (hospitalisation active) ce jour. */
  existants: number;
  /** Sorties (tous modes) dont la date de sortie tombe ce jour. */
  sortants: number;
  /** Deces ce jour. */
  deces: number;
  /** Sorties contre avis medical ce jour. */
  sortiesContreAvis: number;
  /** Consultations externes a l'origine d'un episode ce jour. */
  consultationExterne: number;
}

export interface RapportHebdoTotals {
  nbLits: number;
  nbAdmissions: number;
  sortants: number;
  deces: number;
  sortiesContreAvis: number;
  consultationExterne: number;
}

export interface RapportHebdoData {
  from: string;
  to: string;
  nbLits: number;
  jours: RapportHebdoJour[];
  totals: RapportHebdoTotals;
}

export const JOURS_SEMAINE = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
];
