import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import { CreateMvpNotice } from "@/components/tabs/create/components/CreateMvpNotice";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function CreateTabScreen() {
  const { t } = useTranslation("discover");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  return (
    <Screen>
      <CreateMvpNotice
        badgeLabel={t("createMvpBadge")}
        title={t("createTitle")}
        body={t("createMvpBody")}
        textColor={c.text}
        subtitleColor={c.textSecondary}
        backgroundColor={c.background}
      />
    </Screen>
  );
}
