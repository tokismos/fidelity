import { PhotoPicker } from "@/components/PhotoPicker"
import { Button } from "@/components/ui/Button"
import { Field } from "@/components/ui/Field"
import { Sheet } from "@/components/ui/Sheet"
import { useUpdateStore } from "@/hooks/useUpdateStore"
import { Store } from "@/types"
import { useEffect, useState } from "react"
import { Alert, View } from "react-native"

type Props = {
  visible: boolean
  onClose: () => void
  store: Pick<Store, "name" | "image_url">
}

// Changes the store name and photo
export const StoreEditSheet = ({ visible, onClose, store }: Props) => {
  const [name, setName] = useState(store.name)
  const [image, setImage] = useState<string | null>(store.image_url)
  const { updateStore, isPending } = useUpdateStore()

  // Starts from the saved values each time the sheet opens
  useEffect(() => {
    if (!visible) return
    setName(store.name)
    setImage(store.image_url)
  }, [visible, store.name, store.image_url])

  const save = () => {
    if (!name.trim()) return Alert.alert("Missing name", "Please enter your store name.")
    if (!image) return Alert.alert("Missing photo", "Please add a photo of your store.")

    updateStore(
      { name: name.trim(), image },
      {
        onSuccess: onClose,
        onError: (error) => Alert.alert("Could not save the store", error.message),
      },
    )
  }

  return (
    <Sheet visible={visible} onClose={onClose} title="Name and photo">
      <View className="gap-4">
        <Field label="Store name" value={name} onChangeText={setName} placeholder="My coffee shop" />
        <PhotoPicker label="Store photo" image={image} onChange={setImage} size="wide" />
      </View>
      <Button title="Save" onPress={save} isLoading={isPending} className="mt-6" />
    </Sheet>
  )
}
