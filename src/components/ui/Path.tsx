import { Children, cloneElement, isValidElement, ReactNode } from "react"
import { View } from "react-native"

type PathItemProps = {
  isFirst?: boolean
  isLast?: boolean
}

type Props = {
  // PathStop and PathHere items, far reward on top, start at the bottom
  children: ReactNode
}

// The vertical rail of stops. It tells each item whether it is the first or last one,
// so the rail starts and ends at the right place (an item's own isFirst/isLast wins).
export const Path = ({ children }: Props) => {
  const items = Children.toArray(children).filter(isValidElement<PathItemProps>)

  return (
    <View className="pr-4">
      {items.map((item, index) =>
        cloneElement(item, {
          isFirst: item.props.isFirst ?? index === 0,
          isLast: item.props.isLast ?? index === items.length - 1,
        }),
      )}
    </View>
  )
}
