import { Module } from '@nestjs/common';
import { DiagnosticModule } from './diagnostic/diagnostic.module';
import { ObservationModule } from './observation/observation.module';

import { CrOperatoireModule } from './cr-operatoire/cr-operatoire.module';
import { HistoriqueModule } from './historique/historique.module';
import { ResultatParacliniqueModule } from './resultat-paraclinique/resultat-paraclinique.module';
import { SortieModule } from './sortie/sortie.module';
import { SuiviModule } from './suivi/suivi.module';

@Module({
  imports: [
    DiagnosticModule,
    ObservationModule,

    CrOperatoireModule,
    HistoriqueModule,
    ResultatParacliniqueModule,
    SortieModule,
    SuiviModule,
  ],
})
export class DossierPatientModule {}
