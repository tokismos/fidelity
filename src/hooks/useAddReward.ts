import { useMutation, useQueryClient } from "@tanstack/react-query"

import { addReward } from "@/api/addReward"
import { useGetStore } from "./useGetStore"

type Props = { title: string; pointsCost: number }

export const useAddReward = () => {
  const queryClient = useQueryClient()
  const { data: store, error, isLoading } = useGetStore()

  const mutation = useMutation({
    mutationFn: ({ title, pointsCost }: Props) => {
      if (!store) {
        throw new Error("Error, there is no store.")
      }
      return addReward({ title, pointsCost, storeId: store.id })
    },

    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getRewards"] }),
  })

  const addNewReward = ({ title, pointsCost }: Props) => {
    if (isLoading) {
      console.log("Fetching the store is still loading")
      return
    }
    if (error) {
      console.log("Error while getting the store")
      return
    }

    mutation.mutate({ title, pointsCost })
  }
  return { addReward: addNewReward, ...mutation }
}
