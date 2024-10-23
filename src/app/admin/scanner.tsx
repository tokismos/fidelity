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
  }, [])

  if (!permission) {
    return <View />
  }

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (scanned) return
    setScanned(true)
    router.replace(`/admin/${result.data}`)
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
