export type LinkedArtistSummary = { kind: "artist"; id: string; slug: string; name: string };
export type LinkedVenueSummary = { kind: "venue"; id: string; slug: string; name: string };

export type LinkedEntitiesResponse = {
  artists: LinkedArtistSummary[];
  venues: LinkedVenueSummary[];
};

