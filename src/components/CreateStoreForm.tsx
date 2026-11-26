import { PhotoPicker } from "@/components/PhotoPicker"
import { Button } from "@/components/ui/Button"
import { Field } from "@/components/ui/Field"
import { LargeTitle } from "@/components/ui/LargeTitle"
import { Screen } from "@/components/ui/Screen"
import { useState } from "react"
import { Alert, View } from "react-native"

type Props = {
  isPending: boolean
  onSubmit: (store: { name: string; imageUri: string }) => void
}

// The whole Home screen of an owner who has no store yet
export const CreateStoreForm = ({ isPending, onSubmit }: Props) => {
  const [name, setName] = useState("")
  const [imageUri, setImageUri] = useState<string | null>(null)

  const submit = () => {
    if (!name.trim()) return Alert.alert("Missing name", "Please enter your store name.")
    if (!imageUri) return Alert.alert("Missing photo", "Please add a photo of your store.")
    onSubmit({ name: name.trim(), imageUri })
  }

  return (
    <Screen scroll footer={<Button title="Create store" onPress={submit} isLoading={isPending} />}>
      <View className="pt-4">
        <LargeTitle title="Create your store" subtitle="Customers will see this name and photo." />
      </View>
      <View className="gap-5 px-4 pt-7">
        <Field label="Store name" value={name} onChangeText={setName} placeholder="My coffee shop" />
        <PhotoPicker label="Store photo" image={imageUri} onChange={setImageUri} size="wide" />
      </View>
    </Screen>
  )
}
