import { v4 as uuidv4 } from 'uuid';

import { supabase } from '@config/supabase.js';

export class StorageService {
  private static readonly PROFILE_BUCKET = 'profile-images';
  private static readonly POST_BUCKET = 'post-images';

  static async uploadProfileImage(userId: string, file: Express.Multer.File): Promise<string> {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${userId}/${uuidv4()}.${fileExtension}`;

      const { data, error } = await supabase.storage.from(this.PROFILE_BUCKET).upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      const { data: urlData } = supabase.storage.from(this.PROFILE_BUCKET).getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async deleteProfileImage(imageUrl: string): Promise<void> {
    try {
      const urlParts = imageUrl.split('/');
      const bucketIndex = urlParts.findIndex((part) => part === this.PROFILE_BUCKET);

      if (bucketIndex === -1) {
        throw new Error('Invalid image URL');
      }

      const filePath = urlParts.slice(bucketIndex + 1).join('/');

      const { error } = await supabase.storage.from(this.PROFILE_BUCKET).remove([filePath]);

      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  }

  static async uploadPostImages(userId: string, postId: string, files: Express.Multer.File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map(async (file, index) => {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${userId}/${postId}/${index + 1}.${fileExtension}`;

        const { data, error } = await supabase.storage.from(this.POST_BUCKET).upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

        if (error) {
          throw new Error(`Upload failed: ${error.message}`);
        }

        const { data: urlData } = supabase.storage.from(this.POST_BUCKET).getPublicUrl(data.path);

        return urlData.publicUrl;
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new Error(`Failed to upload post images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async deletePostImages(imageUrls: string[]): Promise<void> {
    try {
      const filePaths = imageUrls.map((url) => {
        const urlParts = url.split('/');
        const bucketIndex = urlParts.findIndex((part) => part === this.POST_BUCKET);

        if (bucketIndex === -1) {
          throw new Error('Invalid image URL');
        }

        return urlParts.slice(bucketIndex + 1).join('/');
      });

      const { error } = await supabase.storage.from(this.POST_BUCKET).remove(filePaths);

      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to delete post images:', error);
    }
  }
}
