import { updatePoints } from "@/api/updatePoints"
import { Id, OperationType } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type Props = { amount: number; operationType: OperationType }

export const useUpdatePoints = ({ userId, storeId }: { userId: Id; storeId: Id }) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ amount, operationType }: Props) => {
      if (!userId || !storeId) {
        throw new Error("User ID and Store ID are required")
      }

      return updatePoints({ userId, storeId, amount, operationType })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserPoints", { userId, storeId }] })
      queryClient.invalidateQueries({
        queryKey: ["getUserHistory", { userId, storeId }],
      })
    },
  })

  const updateUserPoints = ({ amount, operationType }: Props) => {
    mutation.mutate({ amount, operationType })
  }

  return {
    updatePoints: updateUserPoints,
    ...mutation,
  }
}
