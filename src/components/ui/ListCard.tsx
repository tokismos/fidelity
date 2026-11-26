import { Card } from "@/components/ui/Card"
import { Children, Fragment, isValidElement, ReactNode } from "react"
import { View } from "react-native"

type Props = {
  children: ReactNode
  className?: string
}

// A Card holding rows, with a 1px ground line between them. Empty children (false, null) are skipped.
export const ListCard = ({ children, className }: Props) => {
  const rows = Children.toArray(children).filter(isValidElement)

  return (
    <Card className={className}>
      {rows.map((row, index) => (
        <Fragment key={row.key ?? index}>
          {index > 0 && <View className="h-px bg-ground" />}
          {row}
        </Fragment>
      ))}
    </Card>
  )
}
