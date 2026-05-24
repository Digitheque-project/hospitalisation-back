import { Module } from '@nestjs/common';
import { ServiceChuApiService } from './service-chu-api.service';

@Module({
  providers: [ServiceChuApiService],
  exports: [ServiceChuApiService],
})
export class ServiceChuApiModule {}
