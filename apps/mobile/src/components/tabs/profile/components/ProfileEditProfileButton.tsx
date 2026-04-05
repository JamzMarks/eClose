import { Pressable, StyleSheet, Text } from "react-native";

export type ProfileEditProfileButtonProps = {
  label: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  onPress: () => void;
};

export function ProfileEditProfileButton({
  label,
  textColor,
  backgroundColor,
  borderColor,
  onPress,
}: ProfileEditProfileButtonProps) {
  return (
    <Pressable
      style={[styles.btn, { backgroundColor, borderColor }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
});
