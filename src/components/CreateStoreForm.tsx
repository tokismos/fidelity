import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { PhotoPicker } from "@/components/PhotoPicker"
import { FormField } from "@/components/RewardFormField"
import { useState } from "react"
import { Alert, Text, View } from "react-native"

type Props = {
  isPending: boolean
  onSubmit: (store: { name: string; imageUri: string }) => void
}

export const CreateStoreForm = ({ isPending, onSubmit }: Props) => {
  const [name, setName] = useState("")
  const [imageUri, setImageUri] = useState<string | null>(null)

  const submit = () => {
    if (!name.trim()) return Alert.alert("Missing name", "Please enter your store name.")
    if (!imageUri) return Alert.alert("Missing photo", "Please add a photo of your store.")
    onSubmit({ name: name.trim(), imageUri })
  }

  return (
    <View className="rounded-xl bg-white p-5 shadow-sm">
      <Text className="mb-1 text-2xl font-bold text-gray-900">Create your store</Text>
      <Text className="mb-5 text-gray-500">Customers will see this name and photo.</Text>
      <FormField label="Store name" value={name} onChangeText={setName} placeholder="My coffee shop" />
      <PhotoPicker label="Store photo" image={imageUri} onChange={setImageUri} />
      <ButtonWithIndicator title="Create store" isLoading={isPending} onPress={submit} />
    </View>
  )
}
