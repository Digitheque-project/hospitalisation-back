import { Module } from '@nestjs/common';
import { NotificationApiService } from './notification-api.service';
import { AccueilApiModule } from './accueil-api.module';

@Module({
  imports: [AccueilApiModule],
  providers: [NotificationApiService],
  exports: [NotificationApiService],
})
export class NotificationApiModule {}
