import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { LoadingView } from "@/components/LoadingView"
import { ScannerOverlay } from "@/components/ScannerOverlay"
import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera"
import { router } from "expo-router"
import { useState } from "react"
import { Alert, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

// Customer QR codes contain the customer id
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions()
  const [hasScanned, setHasScanned] = useState(false)
  const [isTorchOn, setIsTorchOn] = useState(false)

  if (!permission) return <LoadingView />

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50 px-6">
        <Ionicons name="camera-outline" size={48} color={colors.muted} />
        <Text className="mb-5 mt-3 text-center text-gray-600">
          Camera access is needed to scan your customers' QR codes.
        </Text>
        <ButtonWithIndicator title="Allow camera" isLoading={false} onPress={requestPermission} />
        <ButtonWithIndicator title="Back" variant="secondary" isLoading={false} onPress={() => router.back()} />
      </SafeAreaView>
    )
  }

  const handleScan = ({ data }: BarcodeScanningResult) => {
    if (hasScanned) return
    setHasScanned(true)

    if (!UUID_PATTERN.test(data)) {
      Alert.alert("Unknown QR code", "This is not a customer QR code.", [
        { text: "OK", onPress: () => setHasScanned(false) },
      ])
      return
    }

    router.replace({ pathname: "/admin/customer/[userId]", params: { userId: data } })
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        enableTorch={isTorchOn}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleScan}
      />
      <ScannerOverlay
        isTorchOn={isTorchOn}
        onToggleTorch={() => setIsTorchOn((value) => !value)}
        onClose={() => router.back()}
        onSearchInstead={() => router.replace("/admin/home")}
      />
    </View>
  )
}
