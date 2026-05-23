const ID_PART_CLEANUP_REGEX = /[^a-zA-Z0-9-_]+/g;

export function normalizeIdPart(value: string): string {
  return value.trim().replace(ID_PART_CLEANUP_REGEX, '-');
}

export function buildChambreId(params: {
  numeroChambre: number;
}): string {
  return `chambre-${params.numeroChambre}`;
}

export function buildLitId(params: {
  chambreId: string;
  codeLit: string;
}): string {
  return `lit-${normalizeIdPart(params.chambreId)}-${normalizeIdPart(params.codeLit)}`;
}

export function buildEpisodeId(params: {
  dateAdmission: Date;
}): string {
  const datePart = params.dateAdmission.toISOString().replace(/[:.]/g, '-');
  return `episode-${datePart}`;
}
