import { updatePoints } from "@/api/updatePoints"
import { Id, UserStore } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdatePoints = ({ userId, storeId }: { userId: Id; storeId: Id }) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ pointsChange }: { pointsChange: number }) => {
      if (!userId || !storeId) {
        throw new Error("User ID and Store ID are required")
      }

      const userStore = await queryClient.fetchQuery<UserStore>({
        queryKey: ["getUserPoints", { userId, storeId }],
      })

      if (userStore?.points === undefined) {
        throw new Error("Could not retrieve current points")
      }

      const newPoints = Math.max(0, userStore.points + pointsChange)
      return updatePoints({ userId, storeId, points: newPoints })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserPoints", { userId, storeId }] })
    },
  })

  const updateUserPoints = ({ pointsChange }: { pointsChange: number }) => {
    mutation.mutate({ pointsChange })
  }

  return {
    updatePoints: updateUserPoints,
    ...mutation,
  }
}
