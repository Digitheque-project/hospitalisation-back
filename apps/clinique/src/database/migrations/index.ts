import { InitialSchema1718880000000 } from './1718880000000-InitialSchema';
import { AddDemandeTable1718880000001 } from './1718880000001-AddDemandeTable';
import { AddMotifRefusToDemande1718880000002 } from './1718880000002-AddMotifRefusToDemande';
import { AddSortieFieldsToHospitalisation1718880000003 } from './1718880000003-AddSortieFieldsToHospitalisation';

export const migrations = [
  InitialSchema1718880000000,
  AddDemandeTable1718880000001,
  AddMotifRefusToDemande1718880000002,
  AddSortieFieldsToHospitalisation1718880000003,
];
