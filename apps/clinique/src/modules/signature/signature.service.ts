import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class SignatureService {
  assertProfessionalOrderNumber(user: { orderNumber?: string | null } | null | undefined): void {
    const orderNumber = user?.orderNumber?.trim();

    if (!orderNumber || orderNumber.length < 5) {
      throw new ForbiddenException(
        "Action critique interdite: numero d'Ordre professionnel valide requis",
      );
    }
  }
}
