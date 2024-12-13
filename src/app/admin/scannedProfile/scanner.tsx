import { CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { View } from "react-native"

export default function QrScanner() {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const router = useRouter()
  useEffect(() => {
    requestPermission()
    router.replace(`/admin/scannedProfile/41ee8028-6361-47c2-888d-5109f7fabcd4`)
  }, [])

  if (!permission) {
    return <View />
  }

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (scanned) return
    setScanned(true)
    // TOCHANGE
    // router.replace(`/admin/scannedProfile/${result.data}`)
    router.replace(`/admin/scannedProfile/41ee8028-6361-47c2-888d-5109f7fabcd4`)
  }

  return (
    <CameraView
      className="flex-1"
      facing={"back"}
      barcodeScannerSettings={{
        barcodeTypes: ["qr"],
      }}
      onBarcodeScanned={handleBarCodeScanned}
    />
  )
}
