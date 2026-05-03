export type SharedEventListMemberRole = "OWNER" | "EDITOR" | "VIEWER";

export type SharedEventListSummaryDto = {
  id: string;
  title: string;
  ownerUserId: string;
  myRole: SharedEventListMemberRole;
  memberCount: number;
  eventCount: number;
  createdAt: string;
  updatedAt: string;
};

export type SharedEventListMemberDto = {
  userId: string;
  role: SharedEventListMemberRole;
};

export type SharedEventListDetailDto = SharedEventListSummaryDto & {
  members: SharedEventListMemberDto[];
};

export type SharedListEventRowDto = {
  id: string;
  title: string;
  slug: string;
  startsAt: string;
  endsAt: string;
  locationMode: string;
  locationLabel: string | null;
  addedAt: string;
};

