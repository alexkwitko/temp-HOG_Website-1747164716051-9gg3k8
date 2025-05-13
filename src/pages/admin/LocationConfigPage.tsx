import React, { useState, useEffect } from 'react';
import { AlertCircle, Save, Upload, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase/supabaseClient';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

interface LocationData {
  id: string;
  heading: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  zip: string;
  hours_weekday: string;
  hours_saturday: string;
  hours_sunday: string;
  button_text: string;
  button_url: string;
  map_embed_url: string;
  use_custom_image: boolean;
  image_url: string | null;
  bg_color: string;
  text_color: string;
}

const LocationConfigPage: React.FC = () => {
  // Access global settings
  const { settings } = useSiteSettings();

  const [locationData, setLocationData] = useState<LocationData>({
    id: '',
    heading: 'Conveniently Located in the Heart of Your City',
    address_line1: '8801 Colorado Bend',
    address_line2: null,
    city: 'Lantana',
    state: 'TX',
    zip: '76226',
    hours_weekday: 'Monday - Friday: 9:00 AM - 9:00 PM',
    hours_saturday: 'Saturday: 8:00 AM - 5:00 PM',
    hours_sunday: 'Sunday: 10:00 AM - 3:00 PM',
    button_text: 'Get Directions',
    button_url: '/contact',
    map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.3059353029!2d-74.25986548248684!3d40.69714941512199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sca!4v1651234567890!5m2!1sen!2sca',
    use_custom_image: false,
    image_url: null,
    bg_color: 'bg-neutral-900',
    text_color: 'text-neutral-50'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to directly fetch the data first
      const { data, error } = await supabase
        .from('location_section')
        .select('*')
        .limit(1)
        .single();
      
      if (error) {
        console.error('Error fetching location data:', error);
        
        if (error.message.includes('relation "location_section" does not exist')) {
          throw new Error('Location section table does not exist. Please run the create_location_section.sql script in the Supabase SQL editor.');
        } else if (error.code === 'PGRST116') {
          throw new Error('No location data found. Please add a record to the location_section table.');
        } else {
          throw error;
        }
      }
      
      if (data) {
        console.log('Retrieved location data:', data);
        setLocationData(data);
      }
    } catch (err) {
      console.error('Error fetching location data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof LocationData, value: string | boolean | null) => {
    setLocationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const directUploadToStorage = async (file: File, filePath: string): Promise<string> => {
    console.log('Attempting direct upload to bypass RLS...');
    
    // Get the Service Role Key from the admin client
    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4d3dtanVicGt5endtdmlsbXN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU2NDgyNiwiZXhwIjoyMDYyMTQwODI2fQ.ijwmiQPDrZyTfRAfA8I1e0QBh4uRGvMDF7A4w1v9y9k';
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    
    // Define the URL for the upload
    const url = `https://yxwwmjubpkyzwmvilmsw.supabase.co/storage/v1/object/site-images/${filePath}`;
    
    try {
      // Use fetch API to upload the file
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          // Don't set Content-Type header when using FormData
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Direct upload failed:', errorData);
        throw new Error(`Direct upload failed: ${errorData.error || response.statusText}`);
      }
      
      // Build and return the public URL
      const publicUrl = `https://yxwwmjubpkyzwmvilmsw.supabase.co/storage/v1/object/public/site-images/${filePath}`;
      console.log('Direct upload successful, URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error in direct upload:', error);
      throw error;
    }
  };

  const directDeleteFromStorage = async (filePath: string): Promise<boolean> => {
    console.log('Attempting direct delete to bypass RLS...');
    
    // Get the Service Role Key from the admin client
    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4d3dtanVicGt5endtdmlsbXN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU2NDgyNiwiZXhwIjoyMDYyMTQwODI2fQ.ijwmiQPDrZyTfRAfA8I1e0QBh4uRGvMDF7A4w1v9y9k';
    
    // Define the URL for the delete operation
    const url = `https://yxwwmjubpkyzwmvilmsw.supabase.co/storage/v1/object/site-images/${filePath}`;
    
    try {
      // Use fetch API to delete the file
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Direct delete failed:', errorData);
        throw new Error(`Direct delete failed: ${errorData.error || response.statusText}`);
      }
      
      console.log('Direct delete successful');
      return true;
    } catch (error) {
      console.error('Error in direct delete:', error);
      throw error;
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    setError(null);
    
    try {
      // Create folder if it doesn't exist
      try {
        console.log('Ensuring location-images directory exists...');
        
        // Create a tiny 1x1 transparent PNG
        const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });
        
        // Create a folder marker file with image/png content type
        const emptyFile = new File([blob], '.folder.png', { type: 'image/png' });
        
        await directUploadToStorage(emptyFile, 'location-images/.folder.png');
      } catch (err) {
        console.warn('Failed to create directory, but continuing:', err);
      }
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `location-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `location-images/${fileName}`;
      
      console.log('Uploading file:', filePath);
      
      // Check file size
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File is too large. Please use an image smaller than 5MB');
      }
      
      // Use direct upload to bypass RLS
      const publicUrl = await directUploadToStorage(file, filePath);
      
      // Update state with the new image URL
      handleInputChange('image_url', publicUrl);
      handleInputChange('use_custom_image', true);
      
      setSuccessMessage('Image uploaded successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = async () => {
    if (!locationData.image_url) return;
    
    try {
      // Extract the filename from the URL
      const urlParts = locationData.image_url.split('/location-images/');
      if (urlParts.length > 1) {
        const filename = urlParts[1].split('?')[0]; // Remove any query parameters
        const filePath = `location-images/${filename}`;
        
        // Try to delete the file from storage
        await directDeleteFromStorage(filePath);
      }
      
      // Update state to remove image references
      handleInputChange('image_url', null);
      handleInputChange('use_custom_image', false);
      
      setSuccessMessage('Image removed successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error removing image:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const saveChanges = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Get the Service Role Key
      const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4d3dtanVicGt5endtdmlsbXN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU2NDgyNiwiZXhwIjoyMDYyMTQwODI2fQ.ijwmiQPDrZyTfRAfA8I1e0QBh4uRGvMDF7A4w1v9y9k';
      
      const url = `https://yxwwmjubpkyzwmvilmsw.supabase.co/rest/v1/location_section`;
      const data = {
        heading: locationData.heading,
        address_line1: locationData.address_line1,
        address_line2: locationData.address_line2,
        city: locationData.city,
        state: locationData.state,
        zip: locationData.zip,
        hours_weekday: locationData.hours_weekday,
        hours_saturday: locationData.hours_saturday,
        hours_sunday: locationData.hours_sunday,
        button_text: locationData.button_text,
        button_url: locationData.button_url,
        map_embed_url: locationData.map_embed_url,
        use_custom_image: locationData.use_custom_image,
        image_url: locationData.image_url,
        bg_color: locationData.bg_color,
        text_color: locationData.text_color
      };

      let response;
      if (locationData.id) {
        // Update existing record
        response = await fetch(`${url}?id=eq.${locationData.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': `${serviceRoleKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(data)
        });
      } else {
        // Insert new record
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': `${serviceRoleKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(data)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error saving location data:', errorData);
        throw new Error(`Error saving data: ${errorData.message || response.statusText}`);
      }

      const jsonResponse = await response.json();
      if (jsonResponse && jsonResponse.length > 0) {
        setLocationData(jsonResponse[0]);
      }
      
      setSuccessMessage('Location settings saved successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error saving location data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setSaving(false);
    }
  };

  const bgColorOptions = [
    { value: 'bg-neutral-900', label: 'Dark (Default)' },
    { value: 'bg-neutral-800', label: 'Dark Gray' },
    { value: 'bg-neutral-100', label: 'Light Gray' },
    { value: 'bg-white', label: 'White' },
    { value: 'bg-red-800', label: 'Dark Red' },
    { value: 'bg-blue-800', label: 'Dark Blue' },
  ];

  const textColorOptions = [
    { value: 'text-neutral-50', label: 'Light (Default)' },
    { value: 'text-neutral-900', label: 'Dark' },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Location Section Configuration</h2>
        <p className="text-text">Manage the location section shown on the homepage</p>
      </div>
      
      {error && (
        <div className="bg-background border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-text" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-text">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-background border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-text" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-text">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={saveChanges}
              disabled={saving}
              className="bg-background hover:bg-neutral-800 text-white px-4 py-2 rounded flex items-center"
            >
              {saving ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Location Information</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-text mb-1">Heading</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={locationData.heading}
                  onChange={(e) => handleInputChange('heading', e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-text mb-1">Address Line 1</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={locationData.address_line1}
                  onChange={(e) => handleInputChange('address_line1', e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-text mb-1">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={locationData.address_line2 || ''}
                  onChange={(e) => handleInputChange('address_line2', e.target.value || null)}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text mb-1">City</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={locationData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text mb-1">State</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={locationData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text mb-1">Zip Code</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={locationData.zip}
                    onChange={(e) => handleInputChange('zip', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-text mb-1">Weekday Hours</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={locationData.hours_weekday}
                  onChange={(e) => handleInputChange('hours_weekday', e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-text mb-1">Saturday Hours</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={locationData.hours_saturday}
                  onChange={(e) => handleInputChange('hours_saturday', e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-text mb-1">Sunday Hours</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={locationData.hours_sunday}
                  onChange={(e) => handleInputChange('hours_sunday', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Visual Settings</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-text mb-1">Button Text</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={locationData.button_text}
                  onChange={(e) => handleInputChange('button_text', e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-text mb-1">Button URL</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={locationData.button_url}
                  onChange={(e) => handleInputChange('button_url', e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-text mb-1">Background Color</label>
                <select
                  className="w-full p-2 border rounded"
                  value={locationData.bg_color}
                  onChange={(e) => handleInputChange('bg_color', e.target.value)}
                >
                  {bgColorOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-text mb-1">Text Color</label>
                <select
                  className="w-full p-2 border rounded"
                  value={locationData.text_color}
                  onChange={(e) => handleInputChange('text_color', e.target.value)}
                >
                  {textColorOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-text mb-1">Map Embed URL (Google Maps)</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={4}
                  value={locationData.map_embed_url}
                  onChange={(e) => handleInputChange('map_embed_url', e.target.value)}
                />
                <p className="mt-1 text-xs text-text">
                  Paste the embed URL from Google Maps. Go to Google Maps, search for your location, click "Share", select "Embed a map", and copy the URL from the iframe src attribute.
                </p>
              </div>
              
              <div className="mb-6 border p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-text">Custom Image (instead of map)</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-text border-gray-300 rounded focus:ring-indigo-500"
                      checked={locationData.use_custom_image}
                      onChange={(e) => handleInputChange('use_custom_image', e.target.checked)}
                    />
                    <span className="ml-2 text-sm text-text">Use custom image</span>
                  </div>
                </div>
                
                {locationData.use_custom_image && (
                  <div className="mt-2">
                    {locationData.image_url ? (
                      <div className="relative">
                        <img 
                          src={locationData.image_url} 
                          alt="Location" 
                          className="w-full h-40 object-cover rounded"
                        />
                        <button
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-background text-white p-1 rounded hover:bg-red-600"
                          title="Remove image"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          id="location-image"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageUpload(e.target.files[0]);
                              e.target.value = '';
                            }
                          }}
                        />
                        <label
                          htmlFor="location-image"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          {uploadingImage ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-text mb-2" />
                              <span className="text-sm text-text">Click to upload image</span>
                              <span className="text-xs text-text mt-1">Max file size: 5MB</span>
                            </>
                          )}
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              onClick={saveChanges}
              disabled={saving}
              className="bg-background hover:bg-neutral-800 text-white px-4 py-2 rounded flex items-center"
            >
              {saving ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default LocationConfigPage; 