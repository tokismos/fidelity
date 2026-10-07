import { Text } from "react-native"

type Props = {
  title: string
  tone?: "default" | "success"
}

// Small uppercase label above a group of cards
export const SectionTitle = ({ title, tone = "default" }: Props) => (
  <Text
    className={`mb-2 mt-3 text-xs font-extrabold uppercase tracking-wide ${
      tone === "success" ? "text-green-700" : "text-gray-500"
    }`}
  >
    {title}
  </Text>
)
