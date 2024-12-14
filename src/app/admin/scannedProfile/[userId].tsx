import React, { useState, useCallback, useEffect } from "react"
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native"
import { FlashList } from "@shopify/flash-list"
import { MaterialCommunityIcons, AntDesign, Ionicons } from "@expo/vector-icons"
import { Link, useLocalSearchParams } from "expo-router"
import { useAddUserToStore } from "@/hooks/useAddUserToStore"
import { useGetPoints } from "@/hooks/useGetPoints"
import { useUpdatePoints } from "@/hooks/useUpdatePoints"
import { useGetUserHistory } from "@/hooks/useGetUserHistory"
import { useGetRedeemedRewards } from "@/hooks/useGetRedeemedRewards"
import { useGetStore } from "@/hooks/useGetStore"
import { RedeemedReward } from "@/types"

export default function UserProfile() {
  const { userId } = useLocalSearchParams<{ userId: string }>()
  const [customPoints, setCustomPoints] = useState("")
  const [selectedSection, setSelectedSection] = useState<"points" | "history" | "rewards">("points")
  const [isAddMode, setIsAddMode] = useState(true)

  const {
    data: { id: storeId },
  } = useGetStore()

  const { data: redeemedRewards, error: redeemedRewardsError } = useGetRedeemedRewards({ storeId, userId })
  const { userPoints, isLoading, error, isFetching, data } = useGetPoints({ userId })
  const { addUserToStore, isPending, error: userToStoreError } = useAddUserToStore()
  const { updatePoints, error: updatePointsError } = useUpdatePoints({ userId, storeId })
  const { userHistory } = useGetUserHistory({ userId, storeId })

  const handleAddUserToStore = useCallback(() => {
    addUserToStore({ userId })
  }, [userId, addUserToStore])

  const showConfirmationDialog = useCallback(
    (points: number) => {
      Alert.alert("Confirm Transaction", `${isAddMode ? "Award" : "Deduct"} ${points} points?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            updatePoints({ amount: points, operationType: isAddMode ? "add" : "subtract" })
            setCustomPoints("")
          },
          style: isAddMode ? "default" : "destructive",
        },
      ])
    },
    [isAddMode, updatePoints],
  )

  const StatCard = useCallback(
    ({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) => (
      <View className="flex-1 rounded-xl bg-white p-4 shadow">
        <View className="mb-2 flex-row items-center space-x-2">
          <MaterialCommunityIcons name={icon} size={20} color={color} />
          <Text className="text-sm text-gray-500">{title}</Text>
        </View>
        <Text className="text-xl font-bold text-gray-900">{value}</Text>
      </View>
    ),
    [],
  )

  const TransactionItem = useCallback(
    ({ item, isLastItem }: { item: any; isLastItem: boolean }) => (
      <View className={`flex-row items-center justify-between p-4 ${!isLastItem ? "border-b border-gray-100" : ""}`}>
        <View className="flex-row items-center space-x-4">
          <View
            className={`h-12 w-12 items-center justify-center rounded-2xl ${
              item.operation_type === "add" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <AntDesign
              name={item.operation_type === "add" ? "plus" : "minus"}
              size={24}
              color={item.operation_type === "add" ? "#16a34a" : "#dc2626"}
            />
          </View>
          <View>
            <Text className="text-sm text-gray-500">"MM/dd/yyyy hh:mm aa"</Text>
          </View>
        </View>
        <Text className={`text-lg font-medium ${item.operation_type === "add" ? "text-green-600" : "text-red-600"}`}>
          {item.operation_type === "add" ? "+" : "-"}
          {item.transaction_amount}
        </Text>
      </View>
    ),
    [],
  )

  const RewardCard = useCallback(({ reward }: { reward: RedeemedReward }) => {
    return (
      <Link href={`/admin/scannedProfile/reward/${reward.id}`} className="mb-4 rounded-xl bg-white p-4 shadow">
        <View className="flex-row justify-between">
          <View className="flex-1 flex-row items-center space-x-3">
            {reward.config.image_path ? (
              <Image source={{ uri: reward.config.image_path }} className="h-16 w-16 rounded-lg" />
            ) : (
              <View className="h-16 w-16 items-center justify-center rounded-lg bg-blue-100">
                <MaterialCommunityIcons name="gift-outline" size={32} color="#2563EB" />
              </View>
            )}
            <View className="flex-1">
              <Text className="text-lg font-medium text-gray-900">{reward.title}</Text>
              <Text className="text-sm text-gray-500">Redeemed on {reward.redeemed_at}</Text>
              <View className="mt-1 flex-row items-center">
                <MaterialCommunityIcons name="star" size={16} color="#EAB308" />
                <Text className="ml-1 text-sm text-gray-600">{reward.config.points_needed_value} points</Text>
              </View>
            </View>
          </View>
          <View className="ml-4">
            {reward.status === "used" ? (
              <View className="rounded-full bg-gray-100 px-3 py-1">
                <Text className="text-sm text-gray-600">Used</Text>
              </View>
            ) : (
              <View className="rounded-full bg-green-100 px-3 py-1">
                <Text className="text-sm text-green-600">Active</Text>
              </View>
            )}
          </View>
        </View>
      </Link>
    )
  }, [])

  useEffect(() => {
    if (userPoints === undefined && !isFetching) {
      Alert.alert("New User", "Do you want to add this user to your store?", [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: handleAddUserToStore },
      ])
    }
  }, [userPoints, isFetching, handleAddUserToStore])

  useEffect(() => {
    if (updatePointsError) {
      Alert.alert("Error", updatePointsError.message)
    }
  }, [updatePointsError])

  if (isLoading || isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-2 text-lg text-gray-700">Loading...</Text>
      </View>
    )
  }

  if (error || userToStoreError || redeemedRewardsError) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Ionicons name="alert-circle-outline" size={48} color="#DC2626" />
        <Text className="mt-2 text-lg text-gray-700">Something went wrong.</Text>
        <Text className="text-sm text-gray-500">Please try again later.</Text>
      </View>
    )
  }

  const renderContent = () => {
    switch (selectedSection) {
      case "points":
        return (
          <ScrollView className="flex-1">
            {/* Stats Overview */}
            <View className="mb-4 flex-row space-x-4 px-4">
              <StatCard title="Total Points" value={userPoints ?? 0} icon="star" color="#EAB308" />
              <StatCard
                title="Rewards Used"
                value={redeemedRewards?.filter((r) => r.status === "used").length ?? 0}
                icon="gift"
                color="#2563EB"
              />
            </View>

            {/* Points Update UI */}
            <View className="mx-4">
              {/* Award/Deduct Switch */}
              <View className="mb-4 flex-row justify-center space-x-2 rounded-xl bg-white p-2">
                <Pressable
                  onPress={() => setIsAddMode(true)}
                  className={`flex-1 flex-row items-center justify-center space-x-2 rounded-xl py-3 
                    ${isAddMode ? "bg-green-500" : "bg-white"}`}
                >
                  <AntDesign name="plus" size={18} color={isAddMode ? "white" : "#666"} />
                  <Text className={isAddMode ? "font-medium text-white" : "text-gray-600"}>Award</Text>
                </Pressable>
                <Pressable
                  onPress={() => setIsAddMode(false)}
                  className={`flex-1 flex-row items-center justify-center space-x-2 rounded-xl py-3 
                    ${!isAddMode ? "bg-red-500" : "bg-white"}`}
                >
                  <AntDesign name="minus" size={18} color={!isAddMode ? "white" : "#666"} />
                  <Text className={!isAddMode ? "font-medium text-white" : "text-gray-600"}>Deduct</Text>
                </Pressable>
              </View>

              {/* Custom Points Input */}
              <View className="mb-4 rounded-xl bg-white p-4">
                <View className="mb-4 flex-row items-center">
                  <MaterialCommunityIcons name="pencil-circle" size={24} color={isAddMode ? "#16a34a" : "#dc2626"} />
                  <Text className="ml-2 text-lg font-semibold">Custom Amount</Text>
                </View>
                <View className="flex-row space-x-3">
                  <TextInput
                    className="flex-1 rounded-xl bg-gray-50 px-4 py-3 text-lg"
                    keyboardType="numeric"
                    placeholder="Enter points"
                    value={customPoints}
                    onChangeText={setCustomPoints}
                  />
                  <Pressable
                    onPress={() => customPoints && showConfirmationDialog(Number(customPoints))}
                    className={`justify-center rounded-xl px-6 ${
                      isAddMode ? "bg-green-500" : "bg-red-500"
                    } ${!customPoints ? "opacity-50" : ""}`}
                    disabled={!customPoints}
                  >
                    <Text className="font-medium text-white">Update</Text>
                  </Pressable>
                </View>
              </View>

              {/* Quick Points */}
              <View className="rounded-xl bg-white p-4">
                <View className="mb-4 flex-row items-center">
                  <MaterialCommunityIcons name="lightning-bolt" size={24} color={isAddMode ? "#16a34a" : "#dc2626"} />
                  <Text className="ml-2 text-lg font-semibold">Quick Select</Text>
                </View>
                <View className="-m-1 flex-row flex-wrap">
                  {[10, 25, 50, 100, 250, 500].map((points) => (
                    <Pressable key={points} onPress={() => showConfirmationDialog(points)} className="w-1/3 p-1">
                      <View
                        className={`aspect-square items-center justify-center rounded-2xl ${
                          isAddMode ? "bg-green-50" : "bg-red-50"
                        }`}
                      >
                        <Text className={`text-xl font-bold ${isAddMode ? "text-green-600" : "text-red-600"}`}>
                          {points}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        )

      case "history":
        return (
          <View className="flex-1 px-4">
            <View className="mb-4 flex-row space-x-4">
              <StatCard
                title="This Month"
                value={
                  userHistory?.filter((h) => new Date(h.created_at).getMonth() === new Date().getMonth()).length ?? 0
                }
                icon="calendar"
                color="#2563EB"
              />
              <StatCard title="Total Activity" value={userHistory?.length ?? 0} icon="history" color="#16A34A" />
            </View>

            <FlashList
              data={userHistory ?? []}
              estimatedItemSize={72}
              renderItem={({ item, index }) => (
                <TransactionItem item={item} isLastItem={index === (userHistory?.length ?? 0) - 1} />
              )}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <View className="mt-8 items-center">
                  <MaterialCommunityIcons name="history" size={48} color="#9CA3AF" />
                  <Text className="mt-2 text-gray-500">No transaction history yet</Text>
                </View>
              }
              contentContainerStyle={{
                paddingVertical: 8,
                backgroundColor: "white",
              }}
            />
          </View>
        )

      case "rewards":
        return (
          <View className="flex-1 px-4">
            <View className="mb-4 flex-row space-x-4">
              <StatCard
                title="Active Rewards"
                value={redeemedRewards?.filter((r) => r.status !== "used").length ?? 0}
                icon="ticket-percent"
                color="#2563EB"
              />
              <StatCard title="Total Redeemed" value={redeemedRewards?.length ?? 0} icon="gift" color="#16A34A" />
            </View>

            <FlashList
              data={redeemedRewards ?? []}
              estimatedItemSize={100}
              renderItem={({ item }) => <RewardCard reward={item} />}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <View className="mt-8 items-center">
                  <MaterialCommunityIcons name="gift-outline" size={48} color="#9CA3AF" />
                  <Text className="mt-2 text-gray-500">No rewards redeemed yet</Text>
                </View>
              }
              contentContainerStyle={{ paddingVertical: 8 }}
            />
          </View>
        )
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Profile Summary */}
      <View className="mb-4 px-4">
        <View className="rounded-xl bg-white p-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-gray-900">{userPoints ?? 0}</Text>
              <Text className="text-sm text-gray-500">Available Points</Text>
            </View>
            {redeemedRewards?.length ? (
              <View className="items-end">
                <Text className="text-lg font-semibold text-gray-900">
                  {redeemedRewards.filter((r) => r.status === "active").length}
                </Text>
                <Text className="text-sm text-gray-500">Active Rewards</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View className="mb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          className="flex-row space-x-2"
        >
          {[
            { id: "points", icon: "star", label: "Points" },
            { id: "history", icon: "history", label: "History" },
            { id: "rewards", icon: "gift", label: "Rewards" },
          ].map((item) => (
            <Pressable
              key={item.id}
              onPress={() => setSelectedSection(item.id as typeof selectedSection)}
              className={`flex-row items-center rounded-full px-6 py-2 ${
                selectedSection === item.id ? "bg-blue-500 shadow-sm" : "bg-white"
              }`}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={20}
                color={selectedSection === item.id ? "white" : "#4B5563"}
              />
              <Text className={`ml-2 font-medium ${selectedSection === item.id ? "text-white" : "text-gray-600"}`}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Main Content */}
      {renderContent()}
    </SafeAreaView>
  )
}
