import { AppText } from "@/components/ui/AppText"
import { ReactNode } from "react"
import { KeyboardAvoidingView, Modal, Pressable, ScrollView, View } from "react-native"
import Animated, { SlideInDown } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type Props = {
  visible: boolean
  onClose: () => void
  title: string
  subtitle?: string
  // Shown centered above the title. With it, the title and subtitle are centered too.
  icon?: ReactNode
  children: ReactNode
}

// Bottom sheet for one task: a title, at most 3 inputs and one main button.
// The scrim fades in, the sheet slides up, and it rides above the keyboard.
export const Sheet = ({ visible, onClose, title, subtitle, icon, children }: Props) => {
  const insets = useSafeAreaInsets()

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <KeyboardAvoidingView behavior="padding" className="flex-1 justify-end">
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
          className="absolute inset-0 bg-ink/45"
        />
        <Animated.View
          entering={SlideInDown.duration(260)}
          className="max-h-[92%] rounded-t-[28px] bg-ground px-4 pt-[10px]"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <View className="mx-auto mb-[14px] h-[5px] w-10 rounded-[3px] bg-line-2" />
          {icon && <View className="mb-[14px] mt-[6px] items-center">{icon}</View>}
          <AppText
            weight="black"
            accessibilityRole="header"
            className={`mx-1 text-[22px] tracking-[-0.3px] ${subtitle ? "" : "mb-4"} ${icon ? "text-center" : ""}`}
          >
            {title}
          </AppText>
          {subtitle && (
            <AppText
              className={`text-[14px] text-ink-2 ${icon ? "mx-6 mb-[14px] mt-[6px] text-center" : "mx-1 mb-4 mt-[2px]"}`}
            >
              {subtitle}
            </AppText>
          )}
          <ScrollView className="grow-0" bounces={false} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
