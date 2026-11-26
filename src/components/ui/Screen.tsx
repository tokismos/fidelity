import { ReactElement, ReactNode } from "react"
import { RefreshControlProps, ScrollView, View } from "react-native"
import { Edge, useSafeAreaInsets } from "react-native-safe-area-context"

type Props = {
  children: ReactNode
  // Safe area sides this screen must keep clear. Tab screens with a LargeTitle and pushed screens
  // with a native header need none on top. Add "bottom" on screens that are not inside the tab bar.
  edges?: Edge[]
  scroll?: boolean
  // Pinned at the bottom (the main button of the screen), 16 from the sides
  footer?: ReactNode
  // Classes for the content: the scroll content container when `scroll`, else the inner view
  contentClassName?: string
  refreshControl?: ReactElement<RefreshControlProps>
}

export const Screen = ({
  children,
  edges = [],
  scroll = false,
  footer,
  contentClassName = "",
  refreshControl,
}: Props) => {
  const insets = useSafeAreaInsets()
  const top = edges.includes("top") ? insets.top : 0
  const left = edges.includes("left") ? insets.left : 0
  const right = edges.includes("right") ? insets.right : 0
  const bottomInset = edges.includes("bottom") ? insets.bottom : 0
  // With a footer the bottom safe area goes under the footer, at least 16 so the button never touches the edge
  const footerBottom = Math.max(bottomInset, 16)
  const contentBottom = footer ? 0 : bottomInset

  return (
    <View className="flex-1 bg-ground" style={{ paddingTop: top, paddingLeft: left, paddingRight: right }}>
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName={contentClassName}
          contentContainerStyle={{ paddingBottom: contentBottom + 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        >
          {children}
        </ScrollView>
      ) : (
        <View className={`flex-1 ${contentClassName}`} style={{ paddingBottom: contentBottom }}>
          {children}
        </View>
      )}
      {footer && (
        <View className="gap-[10px] px-4 pt-3" style={{ paddingBottom: footerBottom }}>
          {footer}
        </View>
      )}
    </View>
  )
}
