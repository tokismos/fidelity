import { AppText } from "@/components/ui/AppText"
import { shadows } from "@/constants/colors"
import { useEffect, useRef } from "react"
import { Pressable, View } from "react-native"
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type Props = {
  message: string
  // The button in the pill, e.g. "Undo". Leave it out for a plain notice.
  actionLabel?: string
  onAction?: () => void
  durationMs?: number
  // Called when the toast should go away: after the duration, or after the action
  onHide: () => void
  // Distance from the bottom of the screen. Default: just above a footer button.
  bottom?: number
}

// Floating navy pill above the footer. Mount it to show it; it calls onHide after `durationMs`.
// Give it a new `key` to show the same message again.
export const UndoToast = ({ message, actionLabel, onAction, durationMs = 8000, onHide, bottom }: Props) => {
  const insets = useSafeAreaInsets()
  // The latest callback, so a new function from the parent does not restart the timer
  const onHideRef = useRef(onHide)
  useEffect(() => {
    onHideRef.current = onHide
  }, [onHide])

  useEffect(() => {
    const timer = setTimeout(() => onHideRef.current(), durationMs)
    return () => clearTimeout(timer)
  }, [message, durationMs])

  // Footer button (58) plus its bottom space, plus 16
  const offset = bottom ?? Math.max(insets.bottom, 16) + 58 + 16
  const hasAction = !!actionLabel && !!onAction

  return (
    <View pointerEvents="box-none" className="absolute left-4 right-4 items-center" style={{ bottom: offset }}>
      <Animated.View
        entering={FadeInDown.duration(200)}
        exiting={FadeOut.duration(150)}
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
        className={`min-h-12 flex-row items-center gap-[14px] rounded-3xl bg-ink py-[7px] pl-5 ${
          hasAction ? "pr-2" : "pr-5"
        }`}
        style={shadows.toast}
      >
        <AppText numberOfLines={2} className="shrink text-[14px] text-white">
          {message}
        </AppText>
        {hasAction && (
          <Pressable
            onPress={() => {
              onAction?.()
              onHideRef.current()
            }}
            accessibilityRole="button"
            hitSlop={6}
            className="h-[34px] items-center justify-center rounded-[17px] bg-white/[0.16] px-[14px] active:opacity-70"
          >
            <AppText weight="bold" className="text-[14px] text-white">
              {actionLabel}
            </AppText>
          </Pressable>
        )}
      </Animated.View>
    </View>
  )
}
