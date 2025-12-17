import { useState, useRef } from 'react';
import { X, ImageIcon, Plus } from 'lucide-react';

interface PostImageUploadProps {
  onImagesChange: (files: File[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export default function PostImageUpload({ 
  onImagesChange, 
  maxImages = 10, 
  disabled = false 
}: PostImageUploadProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      alert('Please select only image files');
      return;
    }

    // Check file sizes (5MB limit per file)
    const oversizedFiles = validFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Some files are larger than 5MB. Please choose smaller files.');
      return;
    }

    // Combine with existing images, respect max limit
    const newImages = [...selectedImages, ...validFiles].slice(0, maxImages);
    
    // Create preview URLs
    const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
    
    // Clean up old URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    setSelectedImages(newImages);
    setPreviewUrls(newPreviewUrls);
    onImagesChange(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    
    // Clean up removed URL
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedImages(newImages);
    setPreviewUrls(newPreviewUrls);
    onImagesChange(newImages);
  };

  const handleAddMore = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Image previews grid */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          
          {/* Add more button */}
          {selectedImages.length < maxImages && !disabled && (
            <button
              type="button"
              onClick={handleAddMore}
              className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
            >
              <Plus size={24} />
              <span className="text-sm mt-1">Add More</span>
            </button>
          )}
        </div>
      )}

      {/* Initial upload area */}
      {previewUrls.length === 0 && (
        <button
          type="button"
          onClick={handleAddMore}
          disabled={disabled}
          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ImageIcon size={32} />
          <span className="mt-2 text-sm">Add Photos</span>
          <span className="text-xs text-gray-400">Up to {maxImages} images, 5MB each</span>
        </button>
      )}

      {/* Image count */}
      {selectedImages.length > 0 && (
        <p className="text-sm text-gray-600">
          {selectedImages.length} of {maxImages} images selected
        </p>
      )}
    </div>
  );
}