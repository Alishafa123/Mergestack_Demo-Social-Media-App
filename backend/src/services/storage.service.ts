import { supabase } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

export class StorageService {
  private static readonly BUCKET_NAME = 'profile-images';

  static async uploadProfileImage(
    userId: string,
    file: Express.Multer.File
  ): Promise<string> {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${userId}/${uuidv4()}.${fileExtension}`;

      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async deleteProfileImage(imageUrl: string): Promise<void> {
    try {
      const urlParts = imageUrl.split('/');
      const bucketIndex = urlParts.findIndex(part => part === this.BUCKET_NAME);
      
      if (bucketIndex === -1) {
        throw new Error('Invalid image URL');
      }

      const filePath = urlParts.slice(bucketIndex + 1).join('/');

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  }
}