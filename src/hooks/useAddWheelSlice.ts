import { addWheelSlice } from "@/api/addWheelSlice"
import { queryKeys } from "@/hooks/queryKeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAddWheelSlice = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: addWheelSlice,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.wheelSlices.all }),
  })

  return { addWheelSlice: mutation.mutate, ...mutation }
}
