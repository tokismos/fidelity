import { ReactNode } from "react"
import { Pressable, View } from "react-native"

type Props = {
  children: ReactNode
  onPress?: () => void
  accessibilityLabel?: string
  // Extra classes for spacing or padding. A `bg-` class replaces the white surface.
  className?: string
}

const HAS_BACKGROUND = /(^|\s)bg-/

// White surface with 18 corners and no shadow: the surface on the ground is enough contrast
export const Card = ({ children, onPress, accessibilityLabel, className = "" }: Props) => {
  const classes = `overflow-hidden rounded-[18px] ${HAS_BACKGROUND.test(className) ? "" : "bg-surface"} ${className}`

  if (!onPress) return <View className={classes}>{children}</View>

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={`${classes} active:opacity-70`}
    >
      {children}
    </Pressable>
  )
}
