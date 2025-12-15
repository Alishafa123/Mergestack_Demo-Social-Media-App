import * as yup from 'yup';

export const profileSchema = yup.object({
  first_name: yup.string().optional(),
  last_name: yup.string().optional(),
  phone: yup.string().optional(),
  date_of_birth: yup.string().optional(),
  gender: yup.string().oneOf(['male', 'female', 'other', 'prefer_not_to_say', '']).optional(),
  bio: yup.string().max(500, 'Bio must be less than 500 characters').optional(),
  profile_url: yup.string().url('Must be a valid URL').optional(),
  city: yup.string().optional(),
  country: yup.string().optional(),
});

export type ProfileFormData = yup.InferType<typeof profileSchema>;