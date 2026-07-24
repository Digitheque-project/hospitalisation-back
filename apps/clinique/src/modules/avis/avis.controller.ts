import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AvisEntity } from "../../domain/entities/avis.entity";
import { CreateAvisDto, UpdateAvisDto, AvisQuery } from "./avis.dto";
import { AvisService } from "./avis.service";
import { Permissions } from "../../common/auth/decorators/permissions.decorator";
import { CurrentUser } from "../../common/auth/decorators/current-user.decorator";

@ApiTags("Avis")
@Controller("avis")
export class AvisController {
  constructor(private readonly avisService: AvisService) {}

  @Post()
  @Permissions("avis:create")
  @ApiOperation({
    summary: "Creer une demande d'avis",
    description:
      "Demander l'avis d'un autre service pour un patient. Contrairement a une demande " +
      "d'hospitalisation, AUCUN episode n'est cree : le patient reste dans son service source.",
  })
  @ApiBody({
    schema: {
      example: {
        motif: "Avis cardiologique pour douleur thoracique",
        patientId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        serviceIdSource: "75f995a2-40e9-4285-84e4-a72501d37bfd",
        serviceIdDest: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        chuId: "1e5bbbb7-fa10-4d59-8848-2d0ce96a9394",
        urgence: "URGENTE",
        infoComplementaire: "ECG realise, troponine en cours",
        createdBy: "bb2ff11e-0e8b-4ea5-a120-ed4c55d07909",
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Demande d'avis creee",
    type: AvisEntity,
  })
  @ApiResponse({ status: 400, description: "Donnees invalides" })
  create(
    @Body() body: CreateAvisDto,
    @CurrentUser("userId", new ParseUUIDPipe({ version: "4" })) userId: string,
  ) {
    // L'auteur est impose par le JWT : ne jamais faire confiance au createdBy du front.
    return this.avisService.create({ ...body, createdBy: userId });
  }

  @Get(":id")
  @Permissions("avis:read")
  @ApiOperation({ summary: "Recuperer une demande d'avis par identifiant" })
  @ApiParam({ name: "id", description: "Identifiant avis" })
  @ApiQuery({ name: "chuId", required: false })
  @ApiResponse({ status: 200, description: "Avis retourne", type: AvisEntity })
  @ApiResponse({ status: 404, description: "Avis introuvable" })
  findById(@Param("id") id: string, @Query("chuId") chuId?: string) {
    return this.avisService.findById(id, chuId);
  }

  @Get()
  @Permissions("avis:read")
  @ApiOperation({
    summary: "Lister les demandes d'avis",
    description:
      "Filtrer par chuId, serviceIdSource, serviceIdDest, patientId et/ou statut. Tous optionnels.",
  })
  @ApiQuery({ name: "chuId", required: false })
  @ApiQuery({ name: "serviceIdSource", required: false })
  @ApiQuery({ name: "serviceIdDest", required: false })
  @ApiQuery({ name: "patientId", required: false })
  @ApiQuery({ name: "statut", required: false })
  @ApiResponse({
    status: 200,
    description: "Liste des avis",
    type: AvisEntity,
    isArray: true,
  })
  findAll(@Query() query: AvisQuery) {
    return this.avisService.findAll(query);
  }

  @Patch(":id")
  @Permissions("avis:update")
  @ApiOperation({
    summary: "Mettre a jour une demande d'avis",
    description:
      "Transitions du cycle de vie : PRISE_EN_CHARGE, REPONDUE (compte-rendu), " +
      "REFUSEE (avec motif) ou CLOTUREE. Aucun episode d'hospitalisation n'est cree.",
  })
  @ApiParam({ name: "id", description: "Identifiant avis" })
  @ApiQuery({ name: "chuId", required: false })
  @ApiBody({
    schema: {
      example: {
        statut: "REPONDUE",
        reponse: "Pas d'indication chirurgicale, traitement medical propose.",
        updatedBy: "bb2ff11e-0e8b-4ea5-a120-ed4c55d07909",
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Avis mis a jour",
    type: AvisEntity,
  })
  @ApiResponse({ status: 404, description: "Avis introuvable" })
  update(
    @Param("id") id: string,
    @Body() body: UpdateAvisDto,
    @Query("chuId") chuId?: string,
  ) {
    return this.avisService.update(id, body, chuId);
  }

  @Delete(":id")
  @Permissions("avis:delete")
  @ApiOperation({ summary: "Supprimer une demande d'avis" })
  @ApiParam({ name: "id", description: "Identifiant avis" })
  @ApiQuery({ name: "chuId", required: false })
  @ApiResponse({ status: 204, description: "Avis supprime" })
  @ApiResponse({ status: 404, description: "Avis introuvable" })
  async delete(@Param("id") id: string, @Query("chuId") chuId?: string) {
    await this.avisService.delete(id, chuId);
  }
}
