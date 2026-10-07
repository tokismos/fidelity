import { signInWithEmail } from "@/api/signInWithEmail"
import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { DevLoginButtons } from "@/components/DevLoginButtons"
import { FormField } from "@/components/RewardFormField"
import { Link } from "expo-router"
import { useState } from "react"
import { Alert, KeyboardAvoidingView, Platform, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

type Credentials = {
  email: string
  password: string
}

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (credentials: Credentials) => {
    if (!credentials.email || !credentials.password) {
      Alert.alert("Missing information", "Please enter your email and password.")
      return
    }

    setIsLoading(true)
    try {
      await signInWithEmail(credentials)
    } catch (error) {
      Alert.alert("Sign in failed", error instanceof Error ? error.message : "Please try again.")
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
          <Text className="text-center text-3xl font-bold text-blue-600">Welcome back</Text>
          <Text className="mt-2 text-center text-gray-600">Sign in to see your points and rewards</Text>
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
          placeholder="Your password"
          secureTextEntry
        />

        <ButtonWithIndicator isLoading={isLoading} title="Sign in" onPress={() => handleSignIn({ email, password })} />

        <View className="mt-4 flex-row items-center justify-center">
          <Text className="text-gray-600">No account yet? </Text>
          <Link href="/sign-up" replace asChild>
            <Text className="font-semibold text-blue-600">Sign up</Text>
          </Link>
        </View>

        <DevLoginButtons isLoading={isLoading} onLogin={handleSignIn} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
