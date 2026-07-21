import { StatutHospitalisation } from '../../domain/entities/hospitalisation-episode.entity';

/**
 * Types du Rapport d'activite du service.
 *
 * Le rapport agrege les episodes CLOTURES (SORTIE, TRANSFERE, DECEDE, EVADE)
 * d'un service sur une periode : indicateurs cles, repartition par mode de
 * cloture, demographie des patients et evolution mensuelle. Il n'y a pas de
 * table dediee : tout est calcule a partir des episodes existants.
 */

export interface RapportKpis {
  /** Nombre total de sejours archives sur la periode. */
  total_archives: number;
  /** Sorties (statut SORTIE). */
  sorties: number;
  /** Transferts (statut TRANSFERE). */
  transferts: number;
  /** Deces (statut DECEDE). */
  deces: number;
  /** Evasions (statut EVADE). */
  evasions: number;
  /** Taux de sortie (sorties / total) en %. */
  taux_sortie: number;
  /** Duree moyenne de sejour, en jours. */
  duree_moyenne_sejour: number;
}

export interface ModeSortieStat {
  code: StatutHospitalisation;
  nom: string;
  nombre: number;
}

export interface TrancheAge {
  tranche: string;
  nombre: number;
}

export interface Demographie {
  hommes: number;
  femmes: number;
  /** Patients de moins de 18 ans (tous sexes confondus). */
  enfants: number;
  /** Patients dont le sexe n'est pas renseigne. */
  inconnus: number;
  tranches_age: TrancheAge[];
}

export interface PeriodeStat {
  /** Cle triable (ex. "2026-07"). */
  key: string;
  /** Libelle lisible (ex. "juil. 2026"). */
  periode: string;
  total: number;
  sorties: number;
  transferts: number;
  deces: number;
  evasions: number;
}

export interface RapportData {
  date_from: string | null;
  date_to: string | null;
  kpis: RapportKpis;
  modes_sortie: ModeSortieStat[];
  demographie: Demographie;
  periodes: PeriodeStat[];
}

/** Tranches d'age utilisees pour la demographie du rapport. */
export const RAPPORT_AGE_BUCKETS: Array<{
  tranche: string;
  min: number;
  max: number;
}> = [
  { tranche: '0-17 ans', min: 0, max: 17 },
  { tranche: '18-30 ans', min: 18, max: 30 },
  { tranche: '31-45 ans', min: 31, max: 45 },
  { tranche: '46-60 ans', min: 46, max: 60 },
  { tranche: '61-75 ans', min: 61, max: 75 },
  { tranche: '76 ans et +', min: 76, max: 200 },
];

/** Libelles de mois (fr) pour le regroupement mensuel. */
export const RAPPORT_MONTH_LABELS = [
  'janv.',
  'fevr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'aout',
  'sept.',
  'oct.',
  'nov.',
  'dec.',
];
