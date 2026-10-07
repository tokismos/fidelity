import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { Alert, Image, Pressable, Text, View } from "react-native"

type Props = {
  label: string
  image: string | null
  onChange: (uri: string | null) => void
}

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.5,
}

export const PhotoPicker = ({ label, image, onChange }: Props) => {
  const pick = async (source: "camera" | "library") => {
    // The photo library picker needs no permission, only the camera does
    if (source === "camera") {
      const permission = await ImagePicker.requestCameraPermissionsAsync()
      if (!permission.granted) {
        Alert.alert("Permission needed", "Please allow access to your camera.")
        return
      }
    }

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync(PICKER_OPTIONS)
        : await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS)

    if (!result.canceled) onChange(result.assets[0].uri)
  }

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-semibold text-gray-700">{label}</Text>
      <View className="flex-row items-center">
        {image ? (
          <View className="mr-4">
            <Image source={{ uri: image }} className="h-24 w-24 rounded-lg" />
            <Pressable onPress={() => onChange(null)} className="absolute -right-2 -top-2 rounded-full bg-white">
              <Ionicons name="close-circle" size={28} color={colors.danger} />
            </Pressable>
          </View>
        ) : (
          <View className="mr-4 h-24 w-24 items-center justify-center rounded-lg bg-gray-100">
            <Ionicons name="image-outline" size={32} color={colors.muted} />
          </View>
        )}
        <View className="flex-1">
          <Pressable onPress={() => pick("library")} className="mb-2 rounded-lg border border-gray-300 bg-white p-3">
            <Text className="text-center font-medium text-gray-800">Choose a photo</Text>
          </Pressable>
          <Pressable onPress={() => pick("camera")} className="rounded-lg border border-gray-300 bg-white p-3">
            <Text className="text-center font-medium text-gray-800">Take a photo</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}
