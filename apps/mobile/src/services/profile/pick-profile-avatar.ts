import * as ImagePicker from "expo-image-picker";

const squarePhotoOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.85,
};

export type PickAvatarOutcome =
  | { status: "picked"; uri: string }
  | { status: "canceled" }
  | { status: "denied" };

export async function pickAvatarFromLibrary(): Promise<PickAvatarOutcome> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    return { status: "denied" };
  }
  const result = await ImagePicker.launchImageLibraryAsync(squarePhotoOptions);
  const uri = result.assets?.[0]?.uri;
  if (result.canceled || !uri) {
    return { status: "canceled" };
  }
  return { status: "picked", uri };
}

export async function pickAvatarFromCamera(): Promise<PickAvatarOutcome> {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) {
    return { status: "denied" };
  }
  const result = await ImagePicker.launchCameraAsync(squarePhotoOptions);
  const uri = result.assets?.[0]?.uri;
  if (result.canceled || !uri) {
    return { status: "canceled" };
  }
  return { status: "picked", uri };
}
