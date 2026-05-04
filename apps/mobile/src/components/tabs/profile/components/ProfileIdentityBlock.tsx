import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";

const AVATAR_SIZE = 72;

export type ProfileIdentityBlockProps = {
  avatarSeed: string;
  displayName: string;
  /** Handle sem @; mostrado como @handle abaixo do nome. */
  handle?: string;
  /** Quando definido, substitui o avatar gerado (URL demo ou futura galeria). */
  customAvatarUri?: string | null;
  /** Cidade ou região (perfil público). */
  cityLabel?: string | null;
  bio?: string | null;
  /** Se omitido, o email pode ser renderizado fora deste bloco (ex.: após completude). */
  email?: string | null;
  borderColor: string;
  surfaceColor: string;
  textColor: string;
  mutedColor: string;
  /** Abre o fluxo de foto (toque na área da foto). */
  onPressAvatar?: () => void;
  /** Rótulo de acessibilidade para o toque na foto (recomendado). */
  photoAccessibilityLabel?: string;
};

export function ProfileIdentityBlock({
  avatarSeed,
  displayName,
  handle,
  customAvatarUri,
  cityLabel,
  bio,
  email,
  borderColor,
  surfaceColor,
  textColor,
  mutedColor,
  onPressAvatar,
  photoAccessibilityLabel,
}: ProfileIdentityBlockProps) {
  const avatarSrc =
    customAvatarUri?.trim() ??
    `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(avatarSeed)}`;

  const avatarBlock = onPressAvatar ? (
    <Pressable
      onPress={onPressAvatar}
      accessibilityRole="button"
      accessibilityLabel={photoAccessibilityLabel ?? "Avatar"}
      style={({ pressed }) => [
        styles.avatarFrame,
        { borderColor },
        pressed && styles.avatarFramePressed,
      ]}>
      {({ pressed }) => (
        <View style={styles.avatarInner}>
          <Image
            source={{
              uri: avatarSrc,
            }}
            style={[styles.avatarImage, { backgroundColor: surfaceColor }]}
          />
          {pressed ? (
            <View style={styles.avatarOverlay} pointerEvents="none">
              <Icon name={AppIcon.Camera} size="sm" color="#FFFFFF" filled />
            </View>
          ) : null}
        </View>
      )}
    </Pressable>
  ) : (
    <View style={[styles.avatarFrame, { borderColor }]}>
      <View style={styles.avatarInner}>
        <Image
          source={{
            uri: avatarSrc,
          }}
          style={[styles.avatarImage, { backgroundColor: surfaceColor }]}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.row}>
      <View style={styles.avatarCol}>{avatarBlock}</View>
      <View style={styles.textCol}>
        <Text style={[styles.name, { color: textColor }]} numberOfLines={2}>
          {displayName}
        </Text>
        {handle ? (
          <Text style={[styles.handle, { color: mutedColor }]} numberOfLines={1}>
            @{handle}
          </Text>
        ) : null}
        {cityLabel?.trim() ? (
          <Text style={[styles.city, { color: mutedColor }]} numberOfLines={1}>
            {cityLabel.trim()}
          </Text>
        ) : null}
        {bio?.trim() ? (
          <Text style={[styles.bio, { color: mutedColor }]} numberOfLines={3}>
            {bio.trim()}
          </Text>
        ) : null}
        {email != null && email !== "" ? (
          <Text style={[styles.email, { color: mutedColor }]} numberOfLines={1}>
            {email}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 20,
    gap: 16,
  },
  avatarCol: {
    alignItems: "center",
  },
  avatarFrame: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  avatarFramePressed: {
    opacity: 0.92,
  },
  avatarInner: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.42)",
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
  },
  handle: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
  },
  city: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  email: {
    fontSize: 14,
    marginTop: 4,
  },
});
