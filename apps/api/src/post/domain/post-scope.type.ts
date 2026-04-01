/**
 * O post é agnóstico ao anexo: o mesmo modelo serve para mural de utilizador,
 * página de venue, página de evento, ou feed global da app.
 */
export enum PostScopeType {
  /** Mural / perfil de um utilizador (`scopeId` = dono do mural) */
  PROFILE = "PROFILE",
  /** Comentários ou publicações associadas a um venue */
  VENUE = "VENUE",
  /** Discussão ou conteúdo associado a um evento */
  EVENT = "EVENT",
  /** Feed principal da rede (sem âncora a entidade; `scopeId` null) */
  GLOBAL_FEED = "GLOBAL_FEED",
}
