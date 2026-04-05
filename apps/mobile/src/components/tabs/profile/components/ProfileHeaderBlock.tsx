import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";

import { ProfileStat } from "@/components/tabs/profile/components/ProfileStat";

const AVATAR_SIZE = 86;

export type ProfileHeaderBlockProps = {
  avatarSeed: string;
  borderColor: string;
  surfaceColor: string;
  textColor: string;
  mutedColor: string;
  stats: { posts: string; followers: string; following: string };
  labels: { posts: string; followers: string; following: string };
};

export function ProfileHeaderBlock({
  avatarSeed,
  borderColor,
  surfaceColor,
  textColor,
  mutedColor,
  stats,
  labels,
}: ProfileHeaderBlockProps) {
  return (
    <View style={styles.headerRow}>
      <Image
        source={{
          uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(
            avatarSeed,
          )}`,
        }}
        style={[
          styles.avatar,
          { borderColor, backgroundColor: surfaceColor },
        ]}
      />
      <View style={styles.statsRow}>
        <ProfileStat
          value={stats.posts}
          label={labels.posts}
          color={textColor}
          mutedColor={mutedColor}
        />
        <ProfileStat
          value={stats.followers}
          label={labels.followers}
          color={textColor}
          mutedColor={mutedColor}
        />
        <ProfileStat
          value={stats.following}
          label={labels.following}
          color={textColor}
          mutedColor={mutedColor}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    gap: 20,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  statsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
