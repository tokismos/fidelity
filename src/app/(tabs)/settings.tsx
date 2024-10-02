import { supabase } from "@/utils/supabase"
import { View, Text, StyleSheet, Button } from "react-native"

export default function Tab() {
  return (
    <View>
      <Text>Setting</Text>
      <Button title="Log out" onPress={() => supabase.auth.signOut()} />
    </View>
  )
}
