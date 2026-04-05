import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

const AVATAR_SIZE = 72;

export type ProfileIdentityBlockProps = {
  avatarSeed: string;
  displayName: string;
  email: string;
  borderColor: string;
  surfaceColor: string;
  textColor: string;
  mutedColor: string;
};

export function ProfileIdentityBlock({
  avatarSeed,
  displayName,
  email,
  borderColor,
  surfaceColor,
  textColor,
  mutedColor,
}: ProfileIdentityBlockProps) {
  return (
    <View style={styles.row}>
      <Image
        source={{
          uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(avatarSeed)}`,
        }}
        style={[styles.avatar, { borderColor, backgroundColor: surfaceColor }]}
      />
      <View style={styles.textCol}>
        <Text style={[styles.name, { color: textColor }]} numberOfLines={2}>
          {displayName}
        </Text>
        <Text style={[styles.email, { color: mutedColor }]} numberOfLines={1}>
          {email}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    gap: 16,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
  },
  email: {
    fontSize: 14,
    marginTop: 4,
  },
});
