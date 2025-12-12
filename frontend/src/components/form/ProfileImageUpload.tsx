import { useState, useRef } from 'react';
import { Box, Avatar, CircularProgress, Typography } from '@mui/material';
import { PhotoCamera,} from '@mui/icons-material';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
  error?: string;
}

export default function ProfileImageUpload({
  currentImageUrl,
  onFileSelect,
  disabled = false,
  error
}: ProfileImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsValidating(true);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      setIsValidating(false);
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      setIsValidating(false);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    onFileSelect(file);
    setIsValidating(false);
  };


  const handleAvatarClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        ref={fileInputRef}
        style={{ display: 'none' }}
        disabled={disabled}
      />
      
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={previewUrl || undefined}
          sx={{
            width: 120,
            height: 120,
            cursor: disabled ? 'default' : 'pointer',
            border: '4px solid',
            borderColor: error ? 'error.main' : 'grey.300',
            '&:hover': {
              borderColor: disabled ? 'grey.300' : 'primary.main',
            },
          }}
          onClick={handleAvatarClick}
        >
          {!previewUrl && <PhotoCamera sx={{ fontSize: 40, color: 'grey.500' }} />}
        </Avatar>
        
        {isValidating && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '50%',
            }}
          >
            <CircularProgress size={30} sx={{ color: 'white' }} />
          </Box>
        )}
      </Box>
      
      <Typography variant="caption" color="text.secondary" textAlign="center">
        Click to upload image<br />
        Supported: JPG, PNG, GIF (max 5MB)
      </Typography>
      
            {error && (
        <Typography variant="caption" color="error" textAlign="center">
          {error}
        </Typography>
      )}
    </Box>
  );
}