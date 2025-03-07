import React from 'react';
import { View, Text, Image, Button, Pressable } from 'react-native';
import { useAuth } from '../../../hooks/useAuth';
import { AddStoreForm } from '../../../components/AddStoreForm';
import { useGetStore } from '../../../hooks/useGetStore';
import { Link } from 'expo-router';

export default function Home() {
  const { data: store, error, isLoading } = useGetStore();

  if (isLoading) {
    return <Text className='text-center text-lg'>Loading...</Text>;
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }

  return (
    <View className='flex-1 items-center p-5'>
      <Text className='mb-5 text-2xl font-bold'>ADMIN DASHBOARD</Text>
      {store ? (
        <View className='items-center'>
          <Image
            source={{ uri: store.image_url }}
            className='mb-2 h-24 w-24 rounded-full'
          />
          <Text className='text-xl font-semibold'>{store.name}</Text>
          <Link href={'/admin/scannedProfile/scanner'} asChild>
            <Pressable className='m-2rounded-lg bg-white p-4 shadow-lg'>
              <Text className='text-gray-600'>Open camera</Text>
            </Pressable>
          </Link>
        </View>
      ) : (
        <AddStoreForm />
      )}
    </View>
  );
}
