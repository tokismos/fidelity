import React, { useState } from "react"
import { View, Text, TextInput } from "react-native"
import { ButtonWithIndicator } from "./ButtonWithIndicator"
import { useAddReward } from "@/hooks/useAddReward"

export const AddReward = () => {
  const [rewardTitle, setRewardTitle] = useState("")
  const [pointsCost, setPointsCost] = useState("")

  const { addReward, error, isPending } = useAddReward()

  const handleSubmit = () => {
    addReward({ title: rewardTitle, pointsCost: parseInt(pointsCost) })
  }

  if (isPending) {
    return <Text> IS PENDING</Text>
  }

  if (error) {
    console.log("Error when useAddReward", error)
  }

  return (
    <View className="rounded-lg bg-gray-100 p-6">
      <View className="mb-4">
        <Text className="mb-2 text-gray-700">Reward title</Text>
        <TextInput
          className="rounded-md border border-gray-300 p-2"
          onChangeText={setRewardTitle}
          value={rewardTitle}
          placeholder="Enter your store name"
        />
        <Text className="mb-2 text-gray-700">Points</Text>

        <TextInput
          keyboardType="numeric"
          className="rounded-md border border-gray-300 p-2"
          onChangeText={setPointsCost}
          value={pointsCost}
          placeholder="Points costs"
        />
      </View>

      <ButtonWithIndicator isLoading={isPending} title="Submit" onPress={handleSubmit} />
    </View>
  )
}
