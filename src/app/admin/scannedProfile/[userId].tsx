import { useAddUserToStore } from "@/hooks/useAddUserToStore"
import { useGetPoints } from "@/hooks/useGetPoints"
import { Id } from "@/types"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { Alert, Pressable, Text, TextInput, View, SafeAreaView } from "react-native"
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons"
import { useUpdatePoints } from "@/hooks/useUpdatePoints"
import { useGetUserHistory } from "@/hooks/useGetUserHistory"
import { FlashList } from "@shopify/flash-list"
import { useGetRedeemedRewards } from "@/hooks/useGetRedeemedRewards"
import { useGetStore } from "@/hooks/useGetStore"

export default function UserProfile() {
  const { userId } = useLocalSearchParams<{ userId: string }>()
  const [customPoints, setCustomPoints] = useState("")
  const [selectedTab, setSelectedTab] = useState<"points" | "history">("points")
  const [isAddMode, setIsAddMode] = useState(true)
  const {
    data: { id: storeId },
  } = useGetStore()
  const { data: redeemedRewards, error: redeemedRewardsError } = useGetRedeemedRewards({ storeId, userId })

  const { userPoints, isLoading, error, isFetching, data } = useGetPoints({ userId })
  const { addUserToStore, isPending, error: userToStoreError } = useAddUserToStore()
  const { updatePoints, error: updatePointsError } = useUpdatePoints({ userId, storeId: data?.store_id })
  const { userHistory } = useGetUserHistory({ userId, storeId: data?.store_id })

  const handleAddUserToStore = ({ userId }: { userId: Id }) => {
    addUserToStore({ userId })
  }
  const TransactionItem = ({ item, isLastItem }: { item: any; isLastItem: boolean }) => (
    <Pressable className={`flex-row items-center justify-between p-4 ${!isLastItem ? "border-b border-gray-100" : ""}`}>
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
          <Text className="text-sm text-gray-500">{readableDate(item.created_at)}</Text>
        </View>
      </View>
      <Text className={`text-lg font-medium ${item.operation_type === "add" ? "text-green-600" : "text-red-600"}`}>
        {item.operation_type === "add" ? "+" : "-"}
        {item.transaction_amount}
      </Text>
    </Pressable>
  )
  const showConfirmationDialog = (points: number) => {
    Alert.alert("Confirm Transaction", `${isAddMode ? "Award" : "Deduct"} ${points} points?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: () => {
          handlePointsUpdate(points)
          setCustomPoints("")
        },
        style: isAddMode ? "default" : "destructive",
      },
    ])
  }

  const handlePointsUpdate = (amount: number) => {
    updatePoints({ amount, operationType: isAddMode ? "add" : "subtract" })
    console.log(`${isAddMode ? "Adding" : "Subtracting"} ${amount} points`)
  }

  useEffect(() => {
    if (userPoints === undefined && !isFetching) {
      Alert.alert("New User", "Do you want to add this user to your store?", [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => handleAddUserToStore({ userId }) },
      ])
    }
  }, [userPoints, isFetching, userId])

  useEffect(() => {
    if (updatePointsError) {
      Alert.alert("ERROR", updatePointsError.message)
    }
  }, [updatePointsError])

  if (isLoading || isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-lg">Loading...</Text>
      </View>
    )
  }

  if (error || userToStoreError) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-red-500">{error?.message || userToStoreError?.message || "An error occurred"}</Text>
      </View>
    )
  }

  const history = [
    { id: 1, type: "add", points: 25, reason: "Purchase", date: "2024-02-20" },
    { id: 2, type: "subtract", points: 10, reason: "Reward redemption", date: "2024-02-19" },
    { id: 3, type: "add", points: 50, reason: "Bonus", date: "2024-02-18" },
    { id: 4, type: "add", points: 75, reason: "Special Event", date: "2024-02-17" },
    { id: 5, type: "subtract", points: 30, reason: "Prize Claim", date: "2024-02-16" },
    { id: 6, type: "add", points: 100, reason: "Referral Bonus", date: "2024-02-15" },
  ]
  const readableDate = (created_at: string) => {
    const date = new Date(created_at)
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }
  const quickPoints = [10, 25, 50, 100, 250, 500]

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Top Navigation Tabs */}
      <View className="mb-2 flex-row p-4">
        {["points", "history"].map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setSelectedTab(tab as "points" | "history")}
            className={`flex-1 py-3 ${
              selectedTab === tab ? "bg-white" : "bg-gray-200"
            } ${tab === "points" ? "rounded-l-xl" : "rounded-r-xl"}`}
          >
            <View className="flex-row items-center justify-center space-x-2">
              <MaterialCommunityIcons
                name={tab === "points" ? "gift" : "history"}
                size={20}
                color={selectedTab === tab ? "#3b82f6" : "#666"}
              />
              <Text className={`font-medium ${selectedTab === tab ? "text-blue-500" : "text-gray-600"}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      {selectedTab === "points" ? (
        <View className="flex-1">
          {/* Points Overview Card */}
          <View className="mx-4 mb-4 rounded-3xl bg-white shadow-md">
            <View className="p-6">
              <Text className="mb-2 text-center text-lg text-gray-500">Points Balance</Text>
              <Text className="mb-6 text-center text-4xl font-bold">{userPoints}</Text>

              {/* Award/Deduct Switch */}
              <View className="flex-row justify-center space-x-2">
                <Pressable
                  onPress={() => setIsAddMode(true)}
                  className={`flex-1 flex-row items-center justify-center space-x-2 rounded-xl py-3 
                    ${isAddMode ? "bg-green-500" : "bg-gray-100"}`}
                >
                  <AntDesign name="plus" size={18} color={isAddMode ? "white" : "#666"} />
                  <Text className={isAddMode ? "font-medium text-white" : "text-gray-600"}>Award</Text>
                </Pressable>
                <Pressable
                  onPress={() => setIsAddMode(false)}
                  className={`flex-1 flex-row items-center justify-center space-x-2 rounded-xl py-3 
                    ${!isAddMode ? "bg-red-500" : "bg-gray-100"}`}
                >
                  <AntDesign name="minus" size={18} color={!isAddMode ? "white" : "#666"} />
                  <Text className={!isAddMode ? "font-medium text-white" : "text-gray-600"}>Deduct</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Custom Points Card */}
          <View className="mx-4 mb-4 rounded-3xl bg-white p-6 shadow-md">
            <View className="mb-4 flex-row items-center">
              <MaterialCommunityIcons name="pencil-circle" size={24} color={isAddMode ? "#16a34a" : "#dc2626"} />
              <Text className="ml-2 text-lg font-semibold">Custom Amount</Text>
            </View>
            <View className="flex-row space-x-3">
              <View className="relative flex-1">
                <TextInput
                  className="h-12 rounded-xl bg-gray-50 px-8 text-lg"
                  keyboardType="numeric"
                  placeholder="Enter points"
                  value={customPoints}
                  onChangeText={setCustomPoints}
                />
              </View>
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

          {/* Quick Points Card */}
          <View className="mx-4 mb-4 rounded-3xl bg-white p-6 shadow-md">
            <View className="mb-4 flex-row items-center">
              <MaterialCommunityIcons name="lightning-bolt" size={24} color={isAddMode ? "#16a34a" : "#dc2626"} />
              <Text className="ml-2 text-lg font-semibold">Quick Select</Text>
            </View>
            <View className="-m-1 flex-row flex-wrap">
              {quickPoints.map((points) => (
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
      ) : (
        <View className="flex-1">
          {/* History Header Card */}
          <View className="mx-4 mb-4 rounded-3xl bg-white p-6 shadow-md">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold">{userPoints}</Text>
                <Text className="text-gray-500">Current Balance</Text>
              </View>
              <View className="items-end">
                <Text className="text-lg font-semibold text-gray-900">{history.length} Transactions</Text>
                <Text className="text-gray-500">All Time</Text>
              </View>
            </View>
          </View>

          {/* History List */}
          <View className="mx-4 flex-1">
            <FlashList
              data={userHistory ?? []}
              estimatedItemSize={72}
              renderItem={({ item, index }) => (
                <TransactionItem item={item} isLastItem={index === (userHistory?.length ?? 0) - 1} />
              )}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}
