import React, { useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export const RewardListItem = ({ item, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <View className="mb-2 flex-row items-center justify-between rounded-lg bg-white p-4 shadow-sm">
      <View className="mr-4 flex-1">
        <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>
        <Text className="mt-1 text-sm text-gray-600">{item.description}</Text>
        {item.pointsNeeded && (
          <Text className="mt-1 text-sm font-medium text-blue-600">{item.pointsNeeded} points needed</Text>
        )}
      </View>

      <View className="relative">
        <TouchableOpacity onPress={() => setShowMenu(!showMenu)} className="p-2">
          <Ionicons name="ellipsis-vertical" size={20} color="#4B5563" />
        </TouchableOpacity>

        {showMenu && (
          <View className="absolute right-0 top-10 z-10 w-36 rounded-lg bg-white shadow-lg">
            <TouchableOpacity
              onPress={() => {
                onEdit(item)
                setShowMenu(false)
              }}
              className="flex-row items-center border-b border-gray-100 p-3"
            >
              <Ionicons name="create-outline" size={16} color="#4B5563" />
              <Text className="ml-2 text-gray-700">Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onDelete(item)
                setShowMenu(false)
              }}
              className="flex-row items-center p-3"
            >
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
              <Text className="ml-2 text-red-500">Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}

// const RewardList = () => {
//   // Sample data - replace with your actual data
//   const [rewards, setRewards] = useState([
//     {
//       id: "1",
//       title: "Free Coffee",
//       description: "Get a free coffee from our café",
//       pointsNeeded: 100,
//     },
//     {
//       id: "2",
//       title: "10% Discount",
//       description: "Get 10% off on your next purchase",
//       pointsNeeded: 250,
//     },
//   ])

//   const handleEdit = (item) => {
//     // Implement your edit logic here
//     console.log("Edit item:", item)
//   }

//   const handleDelete = (item) => {
//     // Implement your delete logic here
//     setRewards(rewards.filter((reward) => reward.id !== item.id))
//   }

//   return (
//     <View className="flex-1 bg-gray-50 px-4 py-6">
//       <FlatList
//         data={rewards}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => }
//         className="w-full"
//       />
//     </View>
//   )
// }
