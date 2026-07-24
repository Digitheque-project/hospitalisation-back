const ID_PART_CLEANUP_REGEX = /[^a-zA-Z0-9-_]+/g;

export function normalizeIdPart(value: string): string {
  return value.trim().replace(ID_PART_CLEANUP_REGEX, '-');
}

export function buildChambreId(params: {
  chuId: string;
  serviceId: string;
  numeroChambre: number;
}): string {
  return `chambre-${normalizeIdPart(params.chuId)}-${normalizeIdPart(params.serviceId)}-${params.numeroChambre}`;
}

export function buildLitId(params: {
  chambreId: string;
  codeLit: string;
}): string {
  return `lit-${normalizeIdPart(params.chambreId)}-${normalizeIdPart(params.codeLit)}`;
}

export function buildEpisodeId(params: {
  chuId: string;
  dateAdmission: Date;
}): string {
  const datePart = params.dateAdmission.toISOString().replace(/[:.]/g, '-');
  return `episode-${normalizeIdPart(params.chuId)}-${datePart}`;
}

export function buildAvisId(params: {
  chuId: string;
  createdAt: Date;
}): string {
  const datePart = params.createdAt.toISOString().replace(/[:.]/g, '-');
  return `avis-${normalizeIdPart(params.chuId)}-${datePart}`;
}
