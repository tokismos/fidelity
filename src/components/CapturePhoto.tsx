import * as ImagePicker from "expo-image-picker"
import { Image, Text, TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

type Props = { image?: string | null; setImage: (arg: string | null) => void }

export const CapturePhoto = ({ image, setImage }: Props) => {
  const [status, requestPermission] = ImagePicker.useCameraPermissions()

  const takePhoto = async () => {
    if (!status?.granted) {
      const { granted } = await requestPermission()

      if (!granted) return
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.1,
      })
      if (!result.canceled) {
        setImage(result.assets[0].uri)
      }
    } catch (error) {
      console.error("Error taking photo:", error)
      alert("Error taking photo")
    }
  }
  return (
    <View className="mb-5 flex-row items-center">
      <TouchableOpacity className="mr-4 rounded-lg bg-blue-500 p-3" onPress={takePhoto}>
        <Text className="text-base font-medium text-white">Take Photo</Text>
      </TouchableOpacity>

      {image && (
        <View>
          <Image source={{ uri: image }} className="h-24 w-24 rounded-lg" />
          <TouchableOpacity className="absolute right-0" onPress={() => setImage(null)}>
            <Ionicons name="close-circle" size={32} color="red" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
