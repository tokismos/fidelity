import { Text, TextProps } from "react-native"

type Weight = "medium" | "bold" | "black"

type Props = TextProps & {
  weight?: Weight
  // Digits all take the same width, so numbers do not jump when they change
  tabular?: boolean
  className?: string
}

const WEIGHT_CLASS: Record<Weight, string> = {
  medium: "font-rh",
  bold: "font-rh-bold",
  black: "font-rh-black",
}

// NativeWind applies classes in stylesheet order, not className order, so a default is only added
// when the caller did not set that property
const HAS_SIZE = /(^|\s)text-(\[\d|xs\b|sm\b|base\b|lg\b|\d?xl\b)/
const HAS_COLOR = /(^|\s)text-(white|black|ink|rose|sun|danger|line|surface|ground|sunk|primary|gray|red|green|amber)/

const TABULAR = { fontVariant: ["tabular-nums" as const] }

// Every text in the app goes through this, so it always uses Red Hat Display
export const AppText = ({ weight = "medium", tabular = false, className = "", style, ...props }: Props) => {
  const classes = [
    WEIGHT_CLASS[weight],
    HAS_SIZE.test(className) ? "" : "text-[15px]",
    HAS_COLOR.test(className) ? "" : "text-ink",
    className,
  ]

  return <Text className={classes.filter(Boolean).join(" ")} style={tabular ? [TABULAR, style] : style} {...props} />
}
