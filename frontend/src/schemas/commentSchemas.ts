import * as yup from 'yup';

export const commentSchema = yup.object({
  content: yup
    .string()
    .required('Comment cannot be empty')
    .max(1000, 'Comment cannot exceed 1000 characters')
    .trim(),
});

export type CommentFormData = yup.InferType<typeof commentSchema>;

export const validateComment = async (content: string) => {
  try {
    await commentSchema.validate({ content });
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        isValid: false,
        errors: [error.message]
      };
    }
    return { isValid: false, errors: ['Invalid comment'] };
  }
};