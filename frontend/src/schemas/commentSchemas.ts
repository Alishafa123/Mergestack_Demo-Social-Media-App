import { z } from 'zod';

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment cannot exceed 1000 characters')
    .trim(),
});

export type CommentFormData = z.infer<typeof commentSchema>;

export const validateComment = (content: string) => {
  try {
    commentSchema.parse({ content });
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(err => err.message)
      };
    }
    return { isValid: false, errors: ['Invalid comment'] };
  }
};