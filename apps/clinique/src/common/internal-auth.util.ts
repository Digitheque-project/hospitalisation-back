import * as jwt from 'jsonwebtoken';

/**
 * En-tête Authorization pour les appels serveur-à-serveur qui passent par la
 * gateway publique (ex: clinique -> accueil, clinique -> notification).
 *
 * La gateway exige un Bearer token sur les routes `requiresAuth: true` de son
 * registre (voir gateway/src/config/services.registry.ts) — même pour des
 * appels internes sans utilisateur humain derrière. On se signe donc ici un
 * jeton de très courte durée de vie avec le même JWT_SECRET que tous les
 * services du CHU (même mécanisme que resolve-identity.ts côté
 * Consultation_back pour résoudre son identité au démarrage).
 *
 * Si JWT_SECRET n'est pas configuré, retourne un objet vide : l'appelant
 * enverra la requête sans Authorization, comme avant (échec attendu si la
 * route cible l'exige, mais pas de crash ici).
 */
export function buildInternalAuthHeader(): Record<string, string> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return {};
  }
  const token = jwt.sign({ userId: 'service-clinique', role: 'SERVICE' }, secret, {
    expiresIn: '2m',
  });
  return { Authorization: `Bearer ${token}` };
}
