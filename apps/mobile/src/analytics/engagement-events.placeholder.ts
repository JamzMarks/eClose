/**
 * Nomes de eventos para analytics (Segment/Amplitude/etc.) quando integrarem.
 * Instrumentação planeada para perfil e navegação — não enviar PII nos payloads.
 */
export const EngagementAnalyticsEvents = {
  profileCompletenessBarView: "profile_completeness_impression",
  profileEditOpen: "profile_edit_open",
  profileEditSave: "profile_edit_save",
  profileSavedVenuesMapTap: "profile_saved_venues_explore_tap",
  venueDetailEventsSectionView: "venue_detail_events_section_impression",
} as const;
