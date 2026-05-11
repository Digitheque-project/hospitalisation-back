import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { HospitalisationEntity } from './hospitalisation.entities';

const corsOrigins = (process.env.SECURITY_CORS_ORIGINS ?? '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

@WebSocketGateway({
  namespace: '/hospitalisations',
  cors: {
    origin: corsOrigins.includes('*') ? true : corsOrigins,
    credentials: true,
  },
})
export class HospitalisationGateway {
  @WebSocketServer()
  server: Server;

  emitHospitalisationCreated(hospitalisation: HospitalisationEntity) {
    this.server?.emit('hospitalisation.created', {
      id: hospitalisation.id,
      patientId: hospitalisation.patientId,
      serviceId: hospitalisation.serviceId,
      dateEntrer:
        hospitalisation.dateEntrer instanceof Date
          ? hospitalisation.dateEntrer.toISOString()
          : hospitalisation.dateEntrer,
      motifHospitalisation: hospitalisation.motifHospitalisation,
      statutHospitalisation: hospitalisation.statutHospitalisation,
      type: hospitalisation.type,
    });
  }
}
