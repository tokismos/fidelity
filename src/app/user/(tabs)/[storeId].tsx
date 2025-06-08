import { ButtonWithIndicator } from '../../../components/ButtonWithIndicator';
import { useAuth } from '../../../hooks/useAuth';
import { useGetRewardsByStoreId } from '../../../hooks/useGetRewardsByStoreId';
import { useGetUserRedeemedRewardIds } from '../../../hooks/useGetUserRedeemedRewardIds';
import { useRedeemReward } from '../../../hooks/useRedeemReward';
import { Reward } from '../../../types';
import { FlashList } from '@shopify/flash-list';
import { Link, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { View, Text, Alert, Pressable } from 'react-native';

export default function StoreRewards() {
  const { userId } = useAuth();

  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const { rewards, error, isLoading } = useGetRewardsByStoreId({ storeId });
  const { userRedeemedRewards, isLoading: redeemedLoading } =
    useGetUserRedeemedRewardIds({ userId, storeId });
  const {
    redeemReward,
    isPending,
    error: redeemRewardError,
  } = useRedeemReward();

  const renderItem = useCallback(
    ({ item }: { item: Reward }) => {
      const isRedeemed = userRedeemedRewards?.includes(item.id);

      return (
        <Link href={`/user/reward/${item.id}`} asChild>
          <Pressable className='mb-3 flex-row items-center justify-between rounded-lg bg-white p-4 shadow'>
            <View className='flex-1'>
              <Text className='text-lg font-bold text-gray-800'>
                {item.title}
              </Text>
              <Text className='text-base font-semibold text-blue-600'>
                {item.config.points_needed_value} pts
              </Text>
              {isRedeemed ? (
                <Text className='text-sm text-gray-500'>Redeemed</Text>
              ) : (
                <ButtonWithIndicator
                  isLoading={redeemedLoading}
                  title='Redeem'
                  onPress={() => {
                    Alert.alert(
                      'Redeem Reward',
                      'Are you sure you want to redeem this reward?',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'Redeem',
                          onPress: () => {
                            redeemReward({
                              userId,
                              rewardId: item.id,
                              config: item.config,
                              storeId: item.store_id,
                            });
                          },
                        },
                      ]
                    );
                  }}
                />
              )}
            </View>
          </Pressable>
        </Link>
      );
    },
    [userRedeemedRewards, rewards]
  );

  if (isLoading) {
    return <Text> IS Loading ...</Text>;
  }

  if (error) {
    console.log('Error in Rewards component');
  }

  return (
    <View className='flex-1 bg-gray-100 p-4'>
      <FlashList
        data={rewards}
        extraData={userRedeemedRewards}
        ListEmptyComponent={<Text>No rewards available.</Text>}
        renderItem={renderItem}
        estimatedItemSize={70}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
