import { Link, Redirect } from "expo-router"
import { Button } from "react-native"

export default function Auth() {
  return <Redirect href={"/sign-in"} />
}
