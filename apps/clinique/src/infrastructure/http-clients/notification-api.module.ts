import { Module } from '@nestjs/common';
import { NotificationApiService } from './notification-api.service';

@Module({
  providers: [NotificationApiService],
  exports: [NotificationApiService],
})
export class NotificationApiModule {}
