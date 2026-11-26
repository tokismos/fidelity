import { RaisedTabButton } from "@/components/RaisedTabButton"
import { router } from "expo-router"

// The raised center button of the owner tab bar: it opens the scanner from any tab
export const ScanTabButton = () => (
  <RaisedTabButton
    icon="scan-outline"
    label="Scan"
    accessibilityLabel="Scan a customer"
    onPress={() => router.push("/admin/scanner")}
  />
)
