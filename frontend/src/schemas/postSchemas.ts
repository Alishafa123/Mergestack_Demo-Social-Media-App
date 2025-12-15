import * as yup from 'yup';

export const createPostSchema = yup.object({
  content: yup
    .string()
    .max(2000, 'Post content must be less than 2000 characters')
    .optional(),
});

export type CreatePostFormData = yup.InferType<typeof createPostSchema>;

// Custom validation function for posts
export const validatePost = (content: string, images: File[]) => {
  const errors: string[] = [];

  // Must have either content or images
  if (!content.trim() && images.length === 0) {
    errors.push('Post must have either text content or images');
  }

  // Content length validation
  if (content.length > 2000) {
    errors.push('Post content must be less than 2000 characters');
  }

  // Images validation
  if (images.length > 10) {
    errors.push('Maximum 10 images allowed per post');
  }

  // Individual image validation
  images.forEach((image, index) => {
    if (!image.type.startsWith('image/')) {
      errors.push(`File ${index + 1} is not a valid image`);
    }
    if (image.size > 5 * 1024 * 1024) {
      errors.push(`Image ${index + 1} is larger than 5MB`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};