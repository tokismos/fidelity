import { signUpWithEmail } from "@/api/signUpWithEmail"
import { AppText } from "@/components/ui/AppText"
import { Button } from "@/components/ui/Button"
import { Field } from "@/components/ui/Field"
import { IconButton } from "@/components/ui/IconButton"
import { Screen } from "@/components/ui/Screen"
import { router } from "expo-router"
import { useState } from "react"
import { Alert, KeyboardAvoidingView, Platform, Pressable, View } from "react-native"

const MIN_PASSWORD_LENGTH = 6

const goToSignIn = () => (router.canGoBack() ? router.back() : router.replace("/sign-in"))

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async () => {
    const trimmedEmail = email.trim()
    if (!name.trim()) {
      Alert.alert("Missing information", "Please enter your name.")
      return
    }
    if (!trimmedEmail || password.length < MIN_PASSWORD_LENGTH) {
      Alert.alert(
        "Missing information",
        `Enter your email and a password of at least ${MIN_PASSWORD_LENGTH} characters.`,
      )
      return
    }

    setIsLoading(true)
    try {
      const { session } = await signUpWithEmail({ email: trimmedEmail, password, name: name.trim() })
      if (!session) Alert.alert("Check your inbox", "We sent you an email to confirm your account.")
    } catch (error) {
      Alert.alert("Sign up failed", error instanceof Error ? error.message : "Please try again.")
    }
    setIsLoading(false)
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-ground">
      <Screen edges={["top", "bottom"]} scroll>
        <View className="h-12 flex-row items-center px-3">
          <IconButton icon="chevron-back" onPress={goToSignIn} accessibilityLabel="Back" />
        </View>

        <View className="px-5 pb-[22px] pt-2">
          <AppText weight="black" accessibilityRole="header" className="text-[34px] leading-[38px] tracking-[-0.8px]">
            Create your account
          </AppText>
          <AppText className="mt-[6px] text-[16px] text-ink-2">Collect points in your favorite shops.</AppText>
        </View>

        <View className="px-4">
          <View className="gap-[14px]">
            <Field
              label="Your name"
              value={name}
              onChangeText={setName}
              placeholder="First and last name"
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
            />
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
              placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
              textContentType="newPassword"
            />
          </View>

          <Button title="Create account" onPress={handleSignUp} isLoading={isLoading} className="mt-[22px]" />

          <View className="mt-[18px] flex-row items-center justify-center">
            <AppText className="text-ink-2">Already have an account? </AppText>
            <Pressable onPress={goToSignIn} accessibilityRole="link" hitSlop={12} className="active:opacity-60">
              <AppText weight="bold" className="text-rose-ink">
                Sign in
              </AppText>
            </Pressable>
          </View>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  )
}
