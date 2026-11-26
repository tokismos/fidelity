import { Redirect } from "expo-router"

// The tab button opens the scanner directly, this route only exists for the tab bar
export default function Scan() {
  return <Redirect href="/admin/scanner" />
}
