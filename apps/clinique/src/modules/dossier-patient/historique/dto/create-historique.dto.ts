import { TypeAction } from '../entities/historique.entity';

export class CreateHistoriqueDto {
  patientId: string;
  action: TypeAction;
  module?: string;
  anciennesValeurs?: Record<string, any>;
  nouvellesValeurs?: Record<string, any>;
  utilisateur?: string;
  commentaire?: string;
}
