import { TypeExamen, StatutResultat } from '../entities/resultat-paraclinique.entity';

export class CreateResultatParacliniqueDto {
  patientId: string;
  type: TypeExamen;
  examen: string;
  dateDemande?: Date;
  dateResultat?: Date | null;
  resultatTexte?: string | null;
  resultatFichiers?: string[] | null;
  prescripteur?: string | null;
  statut?: StatutResultat;
  commentaire?: string | null;
}
