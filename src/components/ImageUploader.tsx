import React, { useState } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase/supabaseClient';

interface ImageUploaderProps {
  currentImageUrl?: string | null;
  onImageUploaded: (url: string) => void;
  onImageDeleted?: () => void;
  folder?: string;
  maxSizeMB?: number;
  acceptedFileTypes?: string;
  placeholderText?: string;
  className?: string;
  buttonText?: string;
  height?: string;
}

// Utility function to normalize URL (ensure https if site is on https)
const normalizeImageUrl = (url: string | null): string | null => {
  if (!url) return null;
  
  // If it's a relative URL, return as is
  if (url.startsWith('/')) return url;
  
  // If we're on https, ensure the image URL is also https to avoid mixed content
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && url.startsWith('http:')) {
    return url.replace('http:', 'https:');
  }
  
  return url;
};

// Utility function to check if a URL is external (not from our Supabase storage)
const isExternalUrl = (url: string): boolean => {
  // Check if URL is from our Supabase storage or has "supabase" in the domain
  const isSupabaseUrl = url.includes(import.meta.env.VITE_SUPABASE_URL) || 
                        url.includes('supabase');
  
  // It's external if it doesn't include our Supabase URL and starts with http or https
  return !isSupabaseUrl && (url.startsWith('http://') || url.startsWith('https://'));
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onImageUploaded,
  onImageDeleted,
  folder = 'uploads',
  maxSizeMB = 5,
  acceptedFileTypes = 'image/*',
  placeholderText = 'Upload an image',
  className = '',
  buttonText = 'Upload',
  height = 'h-32'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const normalizedImageUrl = normalizeImageUrl(currentImageUrl || null);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const directUploadToStorage = async (file: File, filePath: string): Promise<string> => {
    console.log('Attempting direct upload to storage...');
    
    try {
      // Create direct URL to storage API - use absolute URL
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yxwwmjubpkyzwmvilmsw.supabase.co';
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      // Ensure we have the URL with protocol
      const baseUrl = supabaseUrl.startsWith('http') ? supabaseUrl : `https://${supabaseUrl}`;
      
      // Create the full absolute URL for storage upload
      const url = `${baseUrl}/storage/v1/object/site-images/${filePath}`;
      
      console.log('Using storage upload URL:', url);
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Use fetch API for direct upload
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Direct upload failed:', errorText);
        throw new Error(`Upload failed: ${errorText}`);
      }
      
      // Get public URL
      const publicUrl = `${baseUrl}/storage/v1/object/public/site-images/${filePath}`;
      console.log('Image uploaded successfully at:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error in direct upload:', error);
      throw error;
    }
  };

  const extractFilePath = (imageUrl: string): string | null => {
    try {
      // Handle external URLs
      if (isExternalUrl(imageUrl)) {
        console.log('External URL detected, no file path to extract');
        return null;
      }
      
      // Parse the URL
      const urlObj = new URL(imageUrl);
      
      // Check for different path patterns
      // Pattern 1: /public/site-images/{path}
      const publicMatch = urlObj.pathname.match(/\/public\/site-images\/(.+)$/);
      if (publicMatch && publicMatch[1]) {
        return publicMatch[1];
      }
      
      // Pattern 2: /object/public/site-images/{path}
      const objectMatch = urlObj.pathname.match(/\/object\/public\/site-images\/(.+)$/);
      if (objectMatch && objectMatch[1]) {
        return objectMatch[1];
      }
      
      // Pattern 3: /{folder}/{filename}
      // Look for common folder names in the URL
      const folderPatterns = [
        '/hero-slides/', '/hero/', 
        '/why-choose-us/', 
        '/program-images/', 
        '/location-images/',
        '/uploads/'
      ];
      
      for (const pattern of folderPatterns) {
        if (imageUrl.includes(pattern)) {
          const parts = imageUrl.split(pattern);
          if (parts.length > 1) {
            const filename = parts[1].split('?')[0]; // Remove query parameters
            return `${pattern.replace(/\//g, '')}/${filename}`;
          }
        }
      }
      
      console.warn('Could not extract file path from URL:', imageUrl);
      return null;
    } catch (err) {
      console.error('Error extracting file path:', err);
      return null;
    }
  };

  const deleteImage = async (imageUrl: string) => {
    try {
      console.log('Attempting to delete image:', imageUrl);
      
      // Check if it's an external URL
      if (isExternalUrl(imageUrl)) {
        console.log('External URL detected, no deletion needed from storage:', imageUrl);
        return true;
      }
      
      // Extract file path from the URL
      const filePath = extractFilePath(imageUrl);
      
      if (!filePath) {
        console.warn('Could not extract file path from URL:', imageUrl);
        // Return true anyway to allow UI update even if we couldn't delete the file
        return true;
      }
      
      console.log('Extracted file path:', filePath);
      
      try {
        // Get Supabase URL and key
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yxwwmjubpkyzwmvilmsw.supabase.co';
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        // Ensure we have the URL with protocol
        const baseUrl = supabaseUrl.startsWith('http') ? supabaseUrl : `https://${supabaseUrl}`;
        
        // Try direct delete first
        const url = `${baseUrl}/storage/v1/object/site-images/${filePath}`;
        
        console.log('Using storage delete URL:', url);
        
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`
          }
        });
        
        if (!response.ok) {
          console.error('Direct delete failed, trying Supabase client');
          throw new Error('Direct delete failed');
        }
        
        console.log('Image deleted successfully via direct method');
        return true;
      } catch (directError) {
        console.error('Direct delete failed, trying Supabase client:', directError);
        
        // Fallback to Supabase client
        const { error } = await supabase.storage
          .from('site-images')
          .remove([filePath]);
          
        if (error) {
          console.error('Error deleting image with Supabase client:', error);
          throw error;
        } else {
          console.log('Image deleted successfully via Supabase client');
          return true;
        }
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      return false;
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    
    try {
      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are supported.');
      }
      
      // Create unique file path
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileName = `${timestamp}-${randomString}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;
      
      console.log('Uploading file to storage bucket:', filePath);
      
      let publicUrl: string;
      
      // Try direct upload first
      try {
        publicUrl = await directUploadToStorage(file, filePath);
      } catch (directError) {
        console.error('Direct upload failed, trying Supabase client:', directError);
        
        // Try standard Supabase upload
        const { error: uploadError } = await supabase.storage
          .from('site-images')
          .upload(filePath, file, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: true
          });
          
        if (uploadError) {
          console.error('Supabase upload error:', uploadError);
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
        
        // Get public URL
        const { data: { publicUrl: standardUrl } } = supabase.storage
          .from('site-images')
          .getPublicUrl(filePath);
          
        if (!standardUrl) {
          throw new Error('Failed to get public URL for uploaded image');
        }
        
        publicUrl = standardUrl;
        console.log('Standard upload successful, URL:', publicUrl);
      }
      
      // Return the public URL to the parent component
      onImageUploaded(publicUrl);
      showSuccessMessage('Image uploaded successfully');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!normalizedImageUrl) return;
    
    try {
      setIsUploading(true);
      const success = await deleteImage(normalizedImageUrl);
      
      if (success) {
        if (onImageDeleted) {
          onImageDeleted();
        }
        showSuccessMessage('Image deleted successfully');
      } else {
        setError('Failed to delete image');
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {normalizedImageUrl ? (
        <div className="relative">
          <img
            src={normalizedImageUrl}
            alt="Uploaded image"
            className={`w-full rounded ${height} object-cover`}
            onError={(e) => {
              console.error(`Error loading image: ${normalizedImageUrl}`);
              e.currentTarget.src = '/images/Logo hog 2 - 1.png'; // Fallback to default image
              e.currentTarget.onerror = null; // Prevent infinite error loop
            }}
          />
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              type="button"
              onClick={() => document.getElementById('image-upload-file')?.click()}
              className="bg-white p-1 rounded-full shadow hover:bg-background"
              title="Replace image"
            >
              <Upload className="h-5 w-5 text-text" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-white p-1 rounded-full shadow hover:bg-background"
              title="Remove image"
            >
              <Trash2 className="h-5 w-5 text-text" />
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-neutral-300 rounded p-4 text-center">
          <label
            htmlFor="image-upload-file"
            className={`cursor-pointer flex flex-col items-center justify-center ${height}`}
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-neutral-900"></div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-text mb-2" />
                <span className="text-text">{placeholderText}</span>
                <button
                  type="button"
                  className="mt-2 px-3 py-1 bg-background hover:bg-gray-200 rounded text-sm"
                  onClick={() => document.getElementById('image-upload-file')?.click()}
                >
                  {buttonText}
                </button>
              </>
            )}
          </label>
          <input
            type="file"
            id="image-upload-file"
            className="hidden"
            accept={acceptedFileTypes}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                e.target.value = '';
                handleImageUpload(file);
              }
            }}
          />
        </div>
      )}
      {error && (
        <div className="text-text text-sm mt-1">{error}</div>
      )}
      {successMessage && (
        <div className="text-text text-sm mt-1">{successMessage}</div>
      )}
    </div>
  );
};

export default ImageUploader; 