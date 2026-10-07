import { signUpWithEmail } from "@/api/signUpWithEmail"
import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { FormField } from "@/components/RewardFormField"
import { Link } from "expo-router"
import { useState } from "react"
import { Alert, KeyboardAvoidingView, Platform, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const MIN_PASSWORD_LENGTH = 6

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async () => {
    if (!email || password.length < MIN_PASSWORD_LENGTH) {
      Alert.alert(
        "Missing information",
        `Enter your email and a password of at least ${MIN_PASSWORD_LENGTH} characters.`,
      )
      return
    }

    setIsLoading(true)
    try {
      const { session } = await signUpWithEmail({ email, password })
      if (!session) Alert.alert("Check your inbox", "We sent you an email to confirm your account.")
    } catch (error) {
      Alert.alert("Sign up failed", error instanceof Error ? error.message : "Please try again.")
    }
    setIsLoading(false)
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center px-6"
      >
        <View className="mb-8">
          <Text className="text-center text-3xl font-bold text-blue-600">Create an account</Text>
          <Text className="mt-2 text-center text-gray-600">Collect points in your favorite stores</Text>
        </View>

        <FormField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <FormField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          secureTextEntry
        />

        <ButtonWithIndicator isLoading={isLoading} title="Sign up" onPress={handleSignUp} />

        <View className="mt-4 flex-row items-center justify-center">
          <Text className="text-gray-600">Already have an account? </Text>
          <Link href="/sign-in" replace asChild>
            <Text className="font-semibold text-blue-600">Sign in</Text>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
