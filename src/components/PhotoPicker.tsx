import { AppText } from "@/components/ui/AppText"
import { ListCard } from "@/components/ui/ListCard"
import { ListRow } from "@/components/ui/ListRow"
import { Sheet } from "@/components/ui/Sheet"
import { Tile } from "@/components/ui/Tile"
import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { useState } from "react"
import { Alert, Image, Pressable, View } from "react-native"

type Props = {
  // Shown above the box, e.g. "Store photo"
  label?: string
  image: string | null
  onChange: (uri: string | null) => void
  // wide: full width, 120 high. square: 96 x 96.
  size?: "wide" | "square"
}

type Source = "camera" | "library"

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.5,
}

// Time for the sheet to close: iOS cannot open the picker while a modal is still closing
const SHEET_CLOSE_DELAY = 400

export const PhotoPicker = ({ label, image, onChange, size = "wide" }: Props) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const pick = async (source: Source) => {
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

  const choose = (source: Source) => {
    setIsSheetOpen(false)
    setTimeout(() => pick(source), SHEET_CLOSE_DELAY)
  }

  const boxSize = size === "square" ? "h-24 w-24" : "h-[120px] w-full"

  return (
    <View>
      {label && (
        <AppText weight="bold" className="mx-1 mb-[6px] text-[13px]">
          {label}
        </AppText>
      )}
      <View className={boxSize}>
        <Pressable
          onPress={() => setIsSheetOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={image ? "Change the photo" : "Add a photo"}
          className={`h-full w-full items-center justify-center gap-[6px] overflow-hidden rounded-[18px] active:opacity-70 ${
            image ? "bg-sunk" : "border-[1.5px] border-dashed border-line-2 bg-surface"
          }`}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              className="h-full w-full"
              resizeMode="cover"
              accessibilityIgnoresInvertColors
            />
          ) : (
            <>
              <Ionicons name="image-outline" size={size === "square" ? 24 : 28} color={colors.ink2} />
              <AppText weight="bold" numberOfLines={1} className="text-[15px] text-ink-2">
                Add a photo
              </AppText>
            </>
          )}
        </Pressable>
        {image && (
          <Pressable
            onPress={() => onChange(null)}
            accessibilityRole="button"
            accessibilityLabel="Remove the photo"
            hitSlop={8}
            className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-surface active:opacity-70"
          >
            <Ionicons name="close" size={18} color={colors.ink} />
          </Pressable>
        )}
      </View>

      <Sheet
        visible={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title={image ? "Change the photo" : "Add a photo"}
      >
        <ListCard>
          <ListRow
            title="Choose a photo"
            leading={<Tile icon="images-outline" />}
            showChevron
            onPress={() => choose("library")}
          />
          <ListRow
            title="Take a photo"
            leading={<Tile icon="camera-outline" />}
            showChevron
            onPress={() => choose("camera")}
          />
        </ListCard>
      </Sheet>
    </View>
  )
}
