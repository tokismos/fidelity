import { signUpWithEmail } from "@/api"
import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { Link } from "expo-router"
import { useState } from "react"
import { Text, TextInput, View } from "react-native"

export default function SignUp() {
  const [email, setEmail] = useState("medber1997@gmail.com")
  const [password, setPassword] = useState("aaaaaaaa")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async () => {
    setIsLoading(true)
    await signUpWithEmail({ email, password })
    setIsLoading(false)
  }

  return (
    <View className="px-6">
      <View className="mb-8">
        <Text className="text-center text-3xl font-bold text-blue-600">Register!</Text>
        <Text className="mt-2 text-center text-gray-600">Sign up to continue</Text>
      </View>

      <View className="mb-4">
        <Text className="mb-1 text-sm font-semibold text-gray-700">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500"
        />
      </View>

      <View className="mb-6">
        <Text className="mb-1 text-sm font-semibold text-gray-700">Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500"
        />
      </View>

      <ButtonWithIndicator isLoading={isLoading} title="Sign Up" onPress={handleSignUp} />

      <View className="mt-6 flex-row items-center justify-center">
        <Text className="text-gray-600">Already have an account ? </Text>
        <Link href={"/sign-in"} replace>
          Sign In
        </Link>
      </View>
    </View>
  );
}
