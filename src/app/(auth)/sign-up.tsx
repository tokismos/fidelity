import { Link } from "expo-router"
import { useState } from "react"
import { Alert, Button, Text, TextInput, TouchableOpacity, View } from "react-native"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignIn = () => {
    Alert.alert("Sign In", `Email: ${email}\nPassword: ${password}`)
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

      <TouchableOpacity onPress={handleSignIn} className="mb-4 w-full rounded-lg bg-blue-600 py-3 text-center">
        <Text className="text-center text-lg font-semibold text-white">Sign Up</Text>
      </TouchableOpacity>

      <View className="mt-6 flex-row items-center justify-center">
        <Text className="text-gray-600">Already have an account ? </Text>
        <Link href={"/sign-in"} replace>
          Sign In
        </Link>
      </View>
    </View>
  )
}