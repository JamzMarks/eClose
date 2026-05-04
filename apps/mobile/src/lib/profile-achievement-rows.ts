import { AppIcon } from "@/components/ui/icon/icon.types";
import type { ProfileUiDraft } from "@/types/profile-ui-draft.types";

export type ProfileAchievementRow = {
  key: string;
  icon: AppIcon;
  unlocked: boolean;
  title: string;
  desc: string;
};

type ProfileT = (key: string) => string;

export function buildProfileAchievementRows(
  draft: ProfileUiDraft,
  calendarActive: boolean,
  t: ProfileT,
): ProfileAchievementRow[] {
  const tags = draft.interestsCsv
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return [
    {
      key: "city",
      icon: AppIcon.Explore,
      unlocked: draft.city.trim().length > 0,
      title: t("badgeCity"),
      desc: t("badgeCityDesc"),
    },
    {
      key: "bio",
      icon: AppIcon.Edit,
      unlocked: draft.bio.trim().length > 0,
      title: t("badgeBio"),
      desc: t("badgeBioDesc"),
    },
    {
      key: "taste",
      icon: AppIcon.Like,
      unlocked: tags.length > 0,
      title: t("badgeTaste"),
      desc: t("badgeTasteDesc"),
    },
    {
      key: "photo",
      icon: AppIcon.Profile,
      unlocked: Boolean(draft.useCustomAvatar && draft.customAvatarUri?.trim()),
      title: t("badgePhoto"),
      desc: t("badgePhotoDesc"),
    },
    {
      key: "calendar",
      icon: AppIcon.Programacao,
      unlocked: calendarActive,
      title: t("badgeCalendar"),
      desc: t("badgeCalendarDesc"),
    },
  ];
}
