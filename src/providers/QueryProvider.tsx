import { QueryClient, QueryClientProvider, focusManager } from "@tanstack/react-query"
import { PropsWithChildren, useEffect } from "react"
import { AppState } from "react-native"

const client = new QueryClient()

export default function QueryProvider({ children }: PropsWithChildren) {
  // Refetch when the app comes back to the foreground, so points stay up to date
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => focusManager.setFocused(state === "active"))
    return () => subscription.remove()
  }, [])

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
