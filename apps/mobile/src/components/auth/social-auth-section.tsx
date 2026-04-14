import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Paddings, Radii } from "@/constants/layout";

export type SocialAuthSectionProps = {
  onGooglePress: () => void;
  onApplePress?: () => void;
  /** Só iOS — alinhado com “Sign in with Apple” nativo / web. */
  showApple: boolean;
  disabled?: boolean;
  googleLoading?: boolean;
  appleLoading?: boolean;
  continueWithGoogleLabel: string;
  continueWithAppleLabel: string;
  orLabel: string;
  isDark: boolean;
};

/**
 * Ordem de mercado: Google (branco + contorno), Apple (preto), depois separador “ou”.
 */
export function SocialAuthSection({
  onGooglePress,
  onApplePress,
  showApple,
  disabled,
  googleLoading,
  appleLoading,
  continueWithGoogleLabel,
  continueWithAppleLabel,
  orLabel,
  isDark,
}: SocialAuthSectionProps) {
  const googleBg = isDark ? "#131314" : "#FFFFFF";
  const googleBorder = isDark ? "#8E918F" : "#747775";
  const googleText = isDark ? "#E3E3E3" : "#1F1F1F";
  const lineColor = isDark ? "#5F6368" : "#E0E0E0";

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onGooglePress}
        disabled={disabled || googleLoading}
        accessibilityRole="button"
        accessibilityLabel={continueWithGoogleLabel}
        style={({ pressed }) => [
          styles.socialBtn,
          {
            backgroundColor: googleBg,
            borderColor: googleBorder,
            opacity: pressed ? 0.92 : disabled || googleLoading ? 0.55 : 1,
          },
        ]}>
        {googleLoading ? (
          <ActivityIndicator color={googleText} />
        ) : (
          <>
            <MaterialCommunityIcons name="google" size={22} color="#4285F4" />
            <Text style={[styles.socialLabel, { color: googleText }]}>{continueWithGoogleLabel}</Text>
          </>
        )}
      </Pressable>

      {showApple && onApplePress ? (
        <Pressable
          onPress={onApplePress}
          disabled={disabled || appleLoading}
          accessibilityRole="button"
          accessibilityLabel={continueWithAppleLabel}
          style={({ pressed }) => [
            styles.socialBtn,
            styles.appleBtn,
            {
              opacity: pressed ? 0.92 : disabled || appleLoading ? 0.55 : 1,
            },
          ]}>
          {appleLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <MaterialCommunityIcons name="apple" size={24} color="#FFFFFF" />
              <Text style={[styles.socialLabel, styles.appleLabel]}>{continueWithAppleLabel}</Text>
            </>
          )}
        </Pressable>
      ) : null}

      <View style={styles.orRow}>
        <View style={[styles.orLine, { backgroundColor: lineColor }]} />
        <Text style={[styles.orText, { color: isDark ? "#9AA0A6" : "#5F6368" }]}>{orLabel}</Text>
        <View style={[styles.orLine, { backgroundColor: lineColor }]} />
      </View>
    </View>
  );
}

export type OAuthOrSeparatorProps = {
  orLabel: string;
  isDark: boolean;
};

/** Linhas horizontais com “ou” entre e-mail/palavra-passe e OAuth. */
export function OAuthOrSeparator({ orLabel, isDark }: OAuthOrSeparatorProps) {
  const lineColor = isDark ? "#5F6368" : "#E0E0E0";
  return (
    <View style={styles.orRow}>
      <View style={[styles.orLine, { backgroundColor: lineColor }]} />
      <Text style={[styles.orText, { color: isDark ? "#9AA0A6" : "#5F6368" }]}>{orLabel}</Text>
      <View style={[styles.orLine, { backgroundColor: lineColor }]} />
    </View>
  );
}

export type SocialAuthIconRowProps = {
  onGooglePress: () => void;
  onApplePress?: () => void;
  showApple: boolean;
  disabled?: boolean;
  googleLoading?: boolean;
  appleLoading?: boolean;
  googleA11y: string;
  appleA11y: string;
  isDark: boolean;
};

/**
 * Botões só com ícone (Google / Apple), para UI compacta após e-mail e palavra-passe.
 */
export function SocialAuthIconRow({
  onGooglePress,
  onApplePress,
  showApple,
  disabled,
  googleLoading,
  appleLoading,
  googleA11y,
  appleA11y,
  isDark,
}: SocialAuthIconRowProps) {
  const googleBg = isDark ? "#131314" : "#FFFFFF";
  const googleBorder = isDark ? "#8E918F" : "#747775";
  const googleIconColor = "#4285F4";

  return (
    <View style={styles.iconRow}>
      <Pressable
        onPress={onGooglePress}
        disabled={disabled || googleLoading}
        accessibilityRole="button"
        accessibilityLabel={googleA11y}
        style={({ pressed }) => [
          styles.iconTile,
          {
            backgroundColor: googleBg,
            borderColor: googleBorder,
            opacity: pressed ? 0.92 : disabled || googleLoading ? 0.55 : 1,
          },
        ]}>
        {googleLoading ? (
          <ActivityIndicator color={isDark ? "#E3E3E3" : "#1F1F1F"} />
        ) : (
          <MaterialCommunityIcons name="google" size={26} color={googleIconColor} />
        )}
      </Pressable>

      {showApple && onApplePress ? (
        <Pressable
          onPress={onApplePress}
          disabled={disabled || appleLoading}
          accessibilityRole="button"
          accessibilityLabel={appleA11y}
          style={({ pressed }) => [
            styles.iconTile,
            styles.iconTileApple,
            {
              opacity: pressed ? 0.92 : disabled || appleLoading ? 0.55 : 1,
            },
          ]}>
          {appleLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <MaterialCommunityIcons name="apple" size={28} color="#FFFFFF" />
          )}
        </Pressable>
      ) : null}
    </View>
  );
}

/** `showApple` derivado da plataforma no ecrã de auth. */
export function shouldShowAppleAuth(): boolean {
  return Platform.OS === "ios";
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
  },
  socialBtn: {
    minHeight: 50,
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  appleBtn: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },
  socialLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  appleLabel: {
    color: "#FFFFFF",
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Paddings.md,
    marginTop: Paddings.xs,
    marginBottom: Paddings.xs,
  },
  orLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  orText: {
    fontSize: 14,
    fontWeight: "500",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Paddings.md,
  },
  iconTile: {
    width: 56,
    height: 56,
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
    alignItems: "center",
    justifyContent: "center",
  },
  iconTileApple: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },
});
