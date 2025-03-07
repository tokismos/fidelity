import { supabase } from '../utils/supabase';
import { Alert } from 'react-native';

type Props = { email: string; password: string };

export async function signUpWithEmail({ email, password }: Props) {
  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) Alert.alert(error.message);
  if (!session) Alert.alert('Please check your inbox for email verification!');
}

export async function signInWithEmail({ email, password }: Props) {
  const { error, data } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) Alert.alert(error.message);
}
