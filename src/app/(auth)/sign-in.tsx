import { signInWithEmail } from "@/api/signInWithEmail"
import { DevLoginButtons } from "@/components/DevLoginButtons"
import { PathMark } from "@/components/PathMark"
import { AppText } from "@/components/ui/AppText"
import { Button } from "@/components/ui/Button"
import { Field } from "@/components/ui/Field"
import { Screen } from "@/components/ui/Screen"
import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { Link } from "expo-router"
import { useState } from "react"
import { Alert, KeyboardAvoidingView, Platform, Pressable, View } from "react-native"

type Credentials = {
  email: string
  password: string
}

const signIn = async (credentials: Credentials) => {
  if (!credentials.email || !credentials.password) {
    Alert.alert("Missing information", "Please enter your email and password.")
    return
  }

  try {
    await signInWithEmail(credentials)
  } catch (error) {
    Alert.alert("Sign in failed", error instanceof Error ? error.message : "Please try again.")
  }
}

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    await signIn({ email: email.trim(), password })
    setIsLoading(false)
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-ground">
      <Screen edges={["top", "bottom"]} scroll>
        <View className="mx-5 mt-[60px]">
          <PathMark />
        </View>

        <View className="px-5 pb-[26px] pt-[26px]">
          <AppText weight="black" accessibilityRole="header" className="text-[34px] leading-[38px] tracking-[-0.8px]">
            Welcome back
          </AppText>
          <AppText className="mt-[6px] text-[16px] text-ink-2">Sign in to see your points and rewards.</AppText>
        </View>

        <View className="px-4">
          <View className="gap-[14px]">
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
            />
            <Field
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="current-password"
              textContentType="password"
              trailing={
                <Pressable
                  onPress={() => setShowPassword((shown) => !shown)}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                  hitSlop={12}
                  className="active:opacity-60"
                >
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color={colors.ink2} />
                </Pressable>
              }
            />
          </View>

          <Button title="Sign in" onPress={handleSignIn} isLoading={isLoading} className="mt-[22px]" />

          <View className="mt-[18px] flex-row items-center justify-center">
            <AppText className="text-ink-2">No account yet? </AppText>
            <Link href="/sign-up" asChild>
              <Pressable accessibilityRole="link" hitSlop={12} className="active:opacity-60">
                <AppText weight="bold" className="text-rose-ink">
                  Sign up
                </AppText>
              </Pressable>
            </Link>
          </View>

          <DevLoginButtons disabled={isLoading} onLogin={signIn} />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  )
}
