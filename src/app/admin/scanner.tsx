import { CameraPermissionPrompt } from "@/components/owner/CameraPermissionPrompt"
import { CustomerSearchPanel } from "@/components/owner/CustomerSearchPanel"
import { ScannerOverlay } from "@/components/ScannerOverlay"
import { useGetStore } from "@/hooks/useGetStore"
import { useGetStoreCustomers } from "@/hooks/useGetStoreCustomers"
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useEffect, useRef, useState } from "react"
import { KeyboardAvoidingView, View } from "react-native"

// Customer QR codes contain the customer id
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// How long the "not a customer code" line stays before scanning starts again
const WRONG_CODE_MS = 2500

const MAX_RESULTS = 4

const CAMERA_FILL = { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 } as const

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions()
  const [hasScanned, setHasScanned] = useState(false)
  const [isWrongCode, setIsWrongCode] = useState(false)
  const [isTorchOn, setIsTorchOn] = useState(false)
  const [search, setSearch] = useState("")
  const wrongCodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const store = useGetStore()
  const customers = useGetStoreCustomers({ storeId: store.data?.id })

  useEffect(
    () => () => {
      if (wrongCodeTimer.current) clearTimeout(wrongCodeTimer.current)
    },
    [],
  )

  const query = search.trim().toLowerCase()
  const results = query
    ? (customers.data ?? [])
        .filter(({ profile }) => `${profile?.name ?? ""} ${profile?.email ?? ""}`.toLowerCase().includes(query))
        .slice(0, MAX_RESULTS)
    : []

  const openCustomer = (userId: string) => router.replace({ pathname: "/admin/customer/[userId]", params: { userId } })

  const handleScan = ({ data }: BarcodeScanningResult) => {
    if (hasScanned) return
    setHasScanned(true)

    if (UUID_PATTERN.test(data)) return openCustomer(data)

    setIsWrongCode(true)
    wrongCodeTimer.current = setTimeout(() => {
      setIsWrongCode(false)
      setHasScanned(false)
    }, WRONG_CODE_MS)
  }

  const isGranted = !!permission?.granted

  return (
    <View className="flex-1 bg-ink">
      <StatusBar style="light" />
      {isGranted && (
        <CameraView
          style={CAMERA_FILL}
          facing="back"
          enableTorch={isTorchOn}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleScan}
        />
      )}
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <ScannerOverlay
          isTorchOn={isTorchOn}
          onToggleTorch={isGranted ? () => setIsTorchOn((value) => !value) : undefined}
          onClose={() => router.back()}
          hint={
            isWrongCode ? "This is not a customer code." : "Point at the customer's code.\nTheir card opens by itself."
          }
        >
          {permission && !isGranted ? (
            <CameraPermissionPrompt canAskAgain={permission.canAskAgain} onAllow={requestPermission} />
          ) : undefined}
        </ScannerOverlay>
        <CustomerSearchPanel
          search={search}
          onSearchChange={setSearch}
          results={results}
          onPick={(customer) => openCustomer(customer.user_id)}
        />
      </KeyboardAvoidingView>
    </View>
  )
}
