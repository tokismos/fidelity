import React, { useState } from "react"
import { View, Text, TextInput } from "react-native"
import { ButtonWithIndicator } from "./ButtonWithIndicator"
import { useAddStore } from "@/hooks/useAddStore"

export const AddStoreForm = () => {
  const [storeName, setStoreName] = useState("")
  const { addStore, isPending } = useAddStore()

  const handleSubmit = () => {
    addStore({ storeName })
  }

  if (isPending) {
    return <Text> IS PENDING</Text>
  }

  return (
    <View className="rounded-lg bg-gray-100 p-6">
      <Text className="mb-4 text-2xl font-bold">Add your store name</Text>

      <View className="mb-4">
        <Text className="mb-2 text-gray-700">Name</Text>
        <TextInput
          className="rounded-md border border-gray-300 p-2"
          onChangeText={setStoreName}
          value={storeName}
          placeholder="Enter your store name"
        />
      </View>

      <ButtonWithIndicator isLoading={isPending} title="Submit" onPress={handleSubmit} />
    </View>
  )
}
