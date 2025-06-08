import { useState } from 'react';
import { Alert } from 'react-native';
import { Reward } from '../types';
import { useAddReward } from './useAddReward';
import { useUpdateReward } from './useUpdateReward';
import { uploadImageToBucket } from '../utils/uploadImageToBucket';

type FormDataProps = Reward & {
  image?: string | null;
};

interface UseRewardSubmitProps {
  rewardId: string;
}

export const useRewardSubmit = ({ rewardId }: UseRewardSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addReward, isPending: addIsPending } = useAddReward();
  const { updateReward, isPending: updateIsPending } = useUpdateReward({
    rewardId,
  });

  const isEditMode = Boolean(rewardId);

  const handleImageUpload = async (imageUri: string) => {
    try {
      return await uploadImageToBucket(imageUri);
    } catch (error) {
      Alert.alert(
        'Image Upload Failed',
        'Failed to upload image. Please try again.'
      );
      console.error('Image upload error:', error);
      throw error;
    }
  };

  const submitReward = async (formData: FormDataProps) => {
    try {
      setIsSubmitting(true);

      const reward = { ...formData };

      if (formData.image) {
        const imagePath = await handleImageUpload(formData.image);
        reward.config = {
          ...reward.config,
          image_path: imagePath,
        };
      }

      if (isEditMode) {
        return updateReward({
          updatedReward: reward,
        });
      }

      addReward(reward);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      Alert.alert(
        'Error',
        `Failed to ${isEditMode ? 'update' : 'create'} reward: ${errorMessage}`
      );
      console.error('useRewardSubmit error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitReward,
    isSubmitting,
    isLoading: isSubmitting || addIsPending || updateIsPending,
    isEditMode,
  };
};
