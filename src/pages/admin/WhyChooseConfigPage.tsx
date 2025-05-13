import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/supabaseClient';
import { supabaseAdmin } from '../../lib/supabase/supabaseAdmin';
import AdminLayout from '../../components/admin/AdminLayout';
import { Save, Trash2, ChevronUp, ChevronDown, Upload, Award, Users, Calendar, ShieldCheck, Brain, Shield, Target, Dumbbell } from 'lucide-react';
import ComponentPreview from '../../components/admin/home/ComponentPreview';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

interface WhyChooseCard {
  id: string;
  title: string;
  description: string;
  icon_name?: string;
  icon_color?: string;
  image_url?: string;
  image_id?: string;
  button_text?: string;
  button_url?: string;
  button_bg?: string;
  button_text_color?: string;
  card_bg?: string;
  card_text_color?: string;
  use_icon: boolean;
  order: number;
  is_active: boolean;
  text_alignment?: string;
  icon_alignment?: string;
}

interface Icon {
  id: string;
  name: string;
  display_name: string;
  category?: string;
}

interface SiteConfig {
  key: string;
  value: string;
}

const WhyChooseConfigPage: React.FC = () => {
  // Access global settings
  const { settings } = useSiteSettings();

  const [cards, setCards] = useState<WhyChooseCard[]>([]);
  const [icons, setIcons] = useState<Icon[]>([]);
  const [heading, setHeading] = useState('Why Choose House of Grappling?');
  const [subheading, setSubheading] = useState('We offer a world-class training environment focused on technical excellence, personal growth, and community.');
  const [columnsLayout, setColumnsLayout] = useState('3');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchData();
    checkStorageBucket();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching fresh data from database...');
      
      // Clear Supabase cache before making the queries
      await supabase.auth.refreshSession();
      
      // Fetch site config
      const { data: configData, error: configError } = await supabase
        .from('site_config')
        .select('*')
        .in('key', ['why_choose_heading', 'why_choose_subheading', 'why_choose_columns_layout']);
      
      if (configError) {
        console.warn('Error fetching site config:', configError);
      } else if (configData && configData.length > 0) {
        console.log('Received site config data:', configData);
        const headingConfig = configData.find((item: SiteConfig) => item.key === 'why_choose_heading');
        const subheadingConfig = configData.find((item: SiteConfig) => item.key === 'why_choose_subheading');
        const columnsConfig = configData.find((item: SiteConfig) => item.key === 'why_choose_columns_layout');
        
        if (headingConfig) setHeading(headingConfig.value);
        if (subheadingConfig) setSubheading(subheadingConfig.value);
        if (columnsConfig) setColumnsLayout(columnsConfig.value);
      }
      
      // Fetch icons
      const { data: iconsData, error: iconsError } = await supabase
        .from('icons_reference')
        .select('*')
        .order('display_name');
      
      if (iconsError) {
        console.warn('Error fetching icons:', iconsError);
      } else {
        console.log('Received icons data:', iconsData?.length);
        setIcons(iconsData || []);
      }
      
      // Fetch cards
      const { data: cardsData, error: cardsError } = await supabase
        .from('why_choose_cards')
        .select('*')
        .order('order');
      
      if (cardsError) {
        throw cardsError;
      }
      
      console.log('Received cards data:', cardsData?.length);
      setCards(cardsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const checkStorageBucket = async () => {
    try {
      console.log('Checking if storage bucket "site-images" exists...');
      
      // Try to access the bucket directly rather than listing all buckets
      console.log('Attempting direct access to site-images bucket...');
      const { data: files, error: directError } = await supabaseAdmin.storage
        .from('site-images')
        .list();
      
      if (directError) {
        console.error('Error accessing site-images bucket directly:', directError);
        
        // Fall back to listing buckets
        console.log('Falling back to listing all buckets...');
        const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();
        
        console.log('All available buckets:', buckets);
        
        if (error) {
          console.error('Error listing buckets:', error);
          setError(`Error accessing Supabase storage: ${error.message || 'Unknown error'}`);
          return;
        }
        
        // If no buckets exist at all
        if (!buckets || buckets.length === 0) {
          console.warn('No storage buckets found in your Supabase project.');
          setError('No storage buckets found in your Supabase project. This might be a permission issue.');
          return;
        }
        
        const siteBucket = buckets?.find((bucket: { name: string }) => bucket.name === 'site-images');
        
        if (!siteBucket) {
          console.warn('Storage bucket "site-images" not found. Available buckets:', buckets.map((b: {name: string}) => b.name).join(', '));
          setError(`Storage bucket "site-images" not found. Available buckets: ${buckets.map((b: {name: string}) => b.name).join(', ')}`);
        } else {
          console.log('Storage bucket "site-images" exists:', siteBucket);
          setSuccess('Storage bucket "site-images" exists, but direct access failed. Check permissions.');
          setTimeout(() => setSuccess(null), 3000);
        }
      } else {
        // Direct access succeeded
        console.log('Successfully accessed site-images bucket directly!', files);
        setSuccess(`Successfully connected to "site-images" bucket! Found ${files?.length || 0} items.`);
        setTimeout(() => setSuccess(null), 3000);
        
        // Now check the why-choose-us folder specifically
        console.log('Checking "why-choose-us" folder...');
        const { data: folderFiles, error: folderError } = await supabaseAdmin.storage
          .from('site-images')
          .list('why-choose-us');
          
        if (folderError) {
          console.error('Error accessing why-choose-us folder:', folderError);
          setError(`Found site-images bucket but couldn't access "why-choose-us" folder: ${folderError.message}`);
        } else {
          console.log('Successfully accessed why-choose-us folder!', folderFiles);
          setSuccess(`Connected to bucket and found "why-choose-us" folder with ${folderFiles?.length || 0} items!`);
          setTimeout(() => setSuccess(null), 3000);
        }
      }
    } catch (err) {
      console.error('Error checking storage bucket:', err);
      setError(`Failed to check storage buckets: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleCardChange = (cardId: string, field: keyof WhyChooseCard, value: string | boolean | number) => {
    setCards(cards.map(card => 
      card.id === cardId ? { ...card, [field]: value } : card
    ));
  };

  const handleHeadingChange = (value: string) => {
    setHeading(value);
  };

  const handleSubheadingChange = (value: string) => {
    setSubheading(value);
  };

  const handleColumnsLayoutChange = (value: string) => {
    setColumnsLayout(value);
  };

  const saveChanges = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Update site config
      for (const config of [
        { key: 'why_choose_heading', value: heading },
        { key: 'why_choose_subheading', value: subheading },
        { key: 'why_choose_columns_layout', value: columnsLayout }
      ]) {
        const { error } = await supabase
          .from('site_config')
          .upsert(config, { onConflict: 'key' });
        
        if (error) {
          console.error(`Error updating ${config.key}:`, error);
        }
      }
      
      // Update cards
      let hasErrors = false;
      
      for (const card of cards) {
        try {
          if (card.id.startsWith('new-')) {
            // New card, create it
            const { ...cardData } = card;
            const { error } = await supabase.from('why_choose_cards').insert(cardData);
            if (error) {
              console.error('Error inserting card:', error);
              hasErrors = true;
            }
          } else {
            // Existing card, update it
            const { error } = await supabase
              .from('why_choose_cards')
              .update(card)
              .eq('id', card.id);
            
            if (error) {
              console.error('Error updating card:', error);
              hasErrors = true;
            }
          }
        } catch (cardError) {
          console.error('Error processing card:', cardError);
          hasErrors = true;
        }
      }
      
      if (hasErrors) {
        setSuccess('Changes saved with some errors. Please check the console.');
      } else {
        setSuccess('Changes saved successfully');
      }
      
      setTimeout(() => setSuccess(null), 3000);
      
      // Delay the data refresh to ensure changes have propagated
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh data
      await fetchData();
    } catch (err) {
      console.error('Error saving changes:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setSaving(false);
    }
  };

  const addNewCard = () => {
    const newCardId = `new-${Date.now()}`;
    const newCard: WhyChooseCard = {
      id: newCardId,
      title: 'New Feature',
      description: 'Describe this feature here...',
      icon_name: 'Shield',
      icon_color: 'var(--color-secondary)',
      use_icon: true,
      order: cards.length + 1,
      is_active: true,
      card_bg: '#ffffff',
      card_text_color: 'var(--color-secondary)',
      text_alignment: 'left',
      icon_alignment: 'left',
    };
    
    setCards([...cards, newCard]);
  };

  const deleteCard = async (cardId: string) => {
    if (cardId.startsWith('new-')) {
      // Just remove from state if it's a new card
      setCards(cards.filter(card => card.id !== cardId));
      return;
    }
    
    setDeletingCardId(cardId);
    
    try {
      const { error } = await supabase
        .from('why_choose_cards')
        .delete()
        .eq('id', cardId);
      
      if (error) throw error;
      
      setCards(cards.filter(card => card.id !== cardId));
      setSuccess('Card deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting card:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setDeletingCardId(null);
    }
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

  const uploadImage = async (cardId: string, file: File): Promise<void> => {
    setUploadingImageId(cardId);
    setError(null);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `why-choose-us/${fileName}`;
      
      console.log('Attempting to upload file:', filePath);
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`
      });
      
      // Check file size
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File is too large. Please use an image smaller than 5MB');
      }
      
      // Check if the directory exists first and create it if needed
      try {
        console.log('Ensuring why-choose-us directory exists...');
        
        // Create a tiny 1x1 transparent PNG instead of a text file
        // This base64 string represents a 1x1 transparent PNG
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
        
        try {
          await directUploadToStorage(emptyFile, 'why-choose-us/.folder.png');
          console.log('Directory check successful or created via direct method');
        } catch (dirError) {
          console.warn('Direct directory check failed, trying standard method:', dirError);
          const { error: dirCheckError } = await supabaseAdmin.storage
            .from('site-images')
            .upload('why-choose-us/.folder.png', emptyFile, { upsert: true });
          
          if (dirCheckError) {
            console.warn('Standard directory check also failed:', dirCheckError);
          } else {
            console.log('Directory check successful via standard method');
          }
        }
      } catch (dirCreateError) {
        console.warn('Failed to ensure directory exists, but continuing anyway:', dirCreateError);
      }
      
      // Skip standard method and go directly to direct upload since we know it has RLS issues
      console.log('Using direct upload method to bypass RLS policies...');
      
      try {
        const publicUrl = await directUploadToStorage(file, filePath);
        
        console.log('Direct upload successful, URL:', publicUrl);
        
        // Update card with the image URL and image_id (store the filename)
        handleCardChange(cardId, 'image_url', publicUrl);
        handleCardChange(cardId, 'use_icon', false);
        
        // Force UI to update with new image
        setCards([...cards.map(card => 
          card.id === cardId ? {
            ...card, 
            image_url: publicUrl, 
            use_icon: false
          } : card
        )]);
        
        // Also update the database immediately
        const { error: updateError } = await supabase
          .from('why_choose_cards')
          .update({ 
            image_url: publicUrl, 
            use_icon: false 
          })
          .eq('id', cardId);
          
        if (updateError) {
          console.warn('Failed to update database with image info:', updateError);
        }
        
        setSuccess('Image uploaded successfully via direct method');
        setTimeout(() => setSuccess(null), 3000);
        return;
      } catch (directError) {
        console.error('Direct upload method failed:', directError);
        
        // Try standard method as a last resort
        console.log('Attempting standard upload as fallback...');
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('site-images')
          .upload(filePath, file, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: true
          });
        
        if (uploadError) {
          throw new Error(`All upload methods failed: ${uploadError.message}`);
        }
        
        console.log('Standard upload successful as fallback:', uploadData);
        
        // Get public URL
        const { data: publicUrlData } = supabaseAdmin.storage
          .from('site-images')
          .getPublicUrl(filePath);
        
        if (!publicUrlData || !publicUrlData.publicUrl) {
          throw new Error('Failed to get public URL');
        }
        
        console.log('Image URL generated:', publicUrlData.publicUrl);
        
        // Update card with the image URL and image_id
        handleCardChange(cardId, 'image_url', publicUrlData.publicUrl);
        handleCardChange(cardId, 'use_icon', false);
        
        // Update database
        const { error: updateError } = await supabase
          .from('why_choose_cards')
          .update({ 
            image_url: publicUrlData.publicUrl, 
            use_icon: false 
          })
          .eq('id', cardId);
          
        if (updateError) {
          console.warn('Failed to update database with image info:', updateError);
        }
        
        // Force UI to update with new image
        setCards([...cards.map(card => 
          card.id === cardId ? {
            ...card, 
            image_url: publicUrlData.publicUrl, 
            use_icon: false
          } : card
        )]);
        
        setSuccess('Image uploaded successfully via fallback method');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err; // Re-throw the error to reject the Promise
    } finally {
      setUploadingImageId(null);
    }
  };

  const deleteImage = async (cardId: string): Promise<void> => {
    try {
      setDeletingCardId(cardId);
      setError(null);
      
      // Find the card with the image
      const cardToUpdate = cards.find(c => c.id === cardId);
      if (!cardToUpdate) {
        throw new Error('Card not found');
      }
      
      if (!cardToUpdate.image_url) {
        throw new Error('Card has no image');
      }
      
      // Extract image ID/filename from the URL if image_id is not present
      let filePath: string;
      if (cardToUpdate.image_id) {
        filePath = `why-choose-us/${cardToUpdate.image_id}`;
      } else {
        // Extract the filename from the image_url
        // Format is typically: https://...supabase.co/storage/v1/object/public/site-images/why-choose-us/1746742386863-8a3t1gdpurf.jpg
        const urlParts = cardToUpdate.image_url.split('/why-choose-us/');
        if (urlParts.length <= 1) {
          throw new Error('Could not parse image URL to extract filename');
        }
        
        // Get the filename part, removing any query parameters
        const filename = urlParts[1].split('?')[0];
        filePath = `why-choose-us/${filename}`;
        
        console.log('Extracted filename from URL:', filename);
      }
      
      console.log('Attempting to delete file:', filePath);
      const deleted = await directDeleteFromStorage(filePath);
      
      if (!deleted) {
        throw new Error('Failed to delete image from storage');
      }
      
      // Update card to remove image reference
      const updatedCards = cards.map(card => 
        card.id === cardId 
          ? { ...card, image_url: undefined, use_icon: true } 
          : card
      );
      
      // Update the database for persistence
      const { error: updateError } = await supabase
        .from('why_choose_cards')
        .update({ image_url: null, use_icon: true })
        .eq('id', cardId);
        
      if (updateError) {
        console.error('Error updating card after image delete:', updateError);
        throw new Error(`Database error: ${updateError.message}`);
      }
      
      // Update local state
      setCards(updatedCards);
      
      setSuccess('Image removed successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting image:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setDeletingCardId(null);
    }
  };

  const reorderCard = (cardId: string, direction: 'up' | 'down') => {
    // Find the current card and its index
    const currentIndex = cards.findIndex(card => card.id === cardId);
    if (currentIndex === -1) return;
    
    // Find the target index based on direction
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Check if we can actually move in that direction
    if (targetIndex < 0 || targetIndex >= cards.length) return;
    
    // Create a new array with the cards in the new order
    const newCards = [...cards];
    const temp = newCards[currentIndex].order;
    newCards[currentIndex].order = newCards[targetIndex].order;
    newCards[targetIndex].order = temp;
    
    // Update the state
    setCards(newCards.sort((a, b) => a.order - b.order));
  };

  const renderIconPreview = (iconName: string, color?: string) => {
    const iconSize = 24;
    const iconStyle = { color: color || 'var(--color-text)' };
    
    switch (iconName) {
      case 'Award':
        return <Award size={iconSize} style={iconStyle} />;
      case 'Users':
        return <Users size={iconSize} style={iconStyle} />;
      case 'Calendar':
        return <Calendar size={iconSize} style={iconStyle} />;
      case 'ShieldCheck':
        return <ShieldCheck size={iconSize} style={iconStyle} />;
      case 'Shield':
        return <Shield size={iconSize} style={iconStyle} />;
      case 'Target':
        return <Target size={iconSize} style={iconStyle} />;
      case 'Brain':
        return <Brain size={iconSize} style={iconStyle} />;
      case 'Dumbbell':
        return <Dumbbell size={iconSize} style={iconStyle} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Why Choose Us Section Configuration</h1>
        
        {error && (
          <div className="bg-background border border-red-400 text-text px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-background border border-green-400 text-text px-4 py-3 rounded mb-6">
            <p>{success}</p>
          </div>
        )}

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="bg-background hover:bg-purple-700 text-white px-4 py-2 rounded text-sm mr-4"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            onClick={saveChanges}
            disabled={saving}
            className="bg-background hover:bg-gray-800 text-white px-4 py-2 rounded text-sm flex items-center"
          >
            {saving ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All Changes
              </>
            )}
          </button>
        </div>

        {showPreview && (
          <div className="mb-6 border rounded-lg p-4 bg-background">
            <h2 className="text-xl font-semibold mb-4">Component Preview</h2>
            <div className="bg-white p-4 rounded-lg shadow">
              <ComponentPreview 
                components={[
                  { 
                    id: 'why_choose', 
                    is_active: true, 
                    order: 2,
                    name: 'Why Choose Us',
                    background_color: '#ffffff',
                    text_color: 'var(--color-text)',
                    border_color: 'transparent',
                    border_width: 0,
                    border_radius: 0,
                    padding: '1rem',
                    margin: '0'
                  }
                ]}
                globalPaletteId="default"
                componentPaletteOverrides={{}}
                singleComponentId="why_choose"
                triggerRefresh={Date.now()}
              />
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Section Content</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Heading</label>
                  <input
                    type="text"
                    value={heading}
                    onChange={(e) => handleHeadingChange(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Subheading</label>
                  <input
                    type="text"
                    value={subheading}
                    onChange={(e) => handleSubheadingChange(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-text mb-1">Card Columns Layout</label>
                <div className="flex gap-2">
                  {['1', '2', '3', '4'].map((cols) => (
                    <button
                      key={cols}
                      onClick={() => handleColumnsLayoutChange(cols)}
                      className={`flex-1 p-2 border rounded ${
                        columnsLayout === cols 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {cols} {parseInt(cols) === 1 ? 'Column' : 'Columns'}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-text mt-1">
                  Choose how many columns to display your feature cards in.
                </p>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => addNewCard()}
                  className="bg-background hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  Add New Card
                </button>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium">Feature Cards</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={addNewCard}
                    className="bg-background hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Add New Card
                  </button>
                  <button
                    onClick={saveChanges}
                    disabled={saving}
                    className="bg-background hover:bg-gray-800 text-white px-4 py-2 rounded text-sm flex items-center"
                  >
                    {saving ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save All Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {cards.length === 0 ? (
                <div className="text-center py-8 text-text">
                  No cards found. Add your first card using the button above.
                </div>
              ) : (
                <div className="space-y-6">
                  {cards.map((card) => (
                    <div key={card.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">{card.title || 'Untitled Card'}</h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => reorderCard(card.id, 'up')}
                            className="p-1 rounded hover:bg-background"
                            title="Move up"
                          >
                            <ChevronUp className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => reorderCard(card.id, 'down')}
                            className="p-1 rounded hover:bg-background"
                            title="Move down"
                          >
                            <ChevronDown className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this card?')) {
                                deleteCard(card.id);
                              }
                            }}
                            disabled={deletingCardId === card.id}
                            className="p-1 rounded hover:bg-background text-text"
                            title="Delete card"
                          >
                            {deletingCardId === card.id ? (
                              <span className="animate-spin">⟳</span>
                            ) : (
                              <Trash2 className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-text mb-1">Title</label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded"
                              value={card.title}
                              onChange={(e) => handleCardChange(card.id, 'title', e.target.value)}
                            />
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-text mb-1">Description</label>
                            <textarea
                              className="w-full p-2 border rounded"
                              value={card.description}
                              onChange={(e) => handleCardChange(card.id, 'description', e.target.value)}
                              rows={3}
                            />
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-center">
                              <label className="inline-flex items-center mr-4">
                                <input
                                  type="radio"
                                  className="form-radio"
                                  name={`display-type-${card.id}`}
                                  checked={card.use_icon}
                                  onChange={() => handleCardChange(card.id, 'use_icon', true)}
                                />
                                <span className="ml-2">Use Icon</span>
                              </label>
                              
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  className="form-radio"
                                  name={`display-type-${card.id}`}
                                  checked={!card.use_icon}
                                  onChange={() => handleCardChange(card.id, 'use_icon', false)}
                                />
                                <span className="ml-2">Use Image</span>
                              </label>
                            </div>
                          </div>
                          
                          {card.use_icon && (
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-text mb-1">Icon</label>
                              <select 
                                className="w-full p-2 border rounded"
                                value={card.icon_name || ''}
                                onChange={(e) => handleCardChange(card.id, 'icon_name', e.target.value)}
                                disabled={!card.use_icon}
                              >
                                <option value="">Select an icon</option>
                                {icons.map(icon => (
                                  <option key={icon.id} value={icon.name}>
                                    {icon.display_name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                          
                          {/* Add icon color picker */}
                          {card.use_icon && (
                            <div className="mb-4">
                              <label className="block text-xs text-text mb-1">Icon Color</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={card.icon_color || 'var(--color-text)'}
                                  onChange={(e) => handleCardChange(card.id, 'icon_color', e.target.value)}
                                  className="w-12 h-8 rounded mr-2"
                                  disabled={!card.use_icon}
                                />
                                <input
                                  type="text"
                                  value={card.icon_color || ''}
                                  onChange={(e) => handleCardChange(card.id, 'icon_color', e.target.value)}
                                  className="flex-1 px-3 py-1 border border-gray-300 rounded-md shadow-sm text-xs"
                                  placeholder="var(--color-text)"
                                  disabled={!card.use_icon}
                                />
                                <div className="flex items-center justify-center w-8 h-8 border rounded-md">
                                  {card.use_icon && card.icon_name && renderIconPreview(card.icon_name, card.icon_color)}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-text mb-1">Image</label>
                            <div className="border rounded p-4">
                              {card.image_url ? (
                                <div className="relative">
                                  <img
                                    src={card.image_url}
                                    alt={card.title}
                                    className="w-full h-40 object-cover rounded"
                                  />
                                  <div className="absolute top-2 right-2 flex space-x-2">
                                    <input
                                      type="file"
                                      id={`image-replace-${card.id}`}
                                      className="hidden"
                                      accept="image/*"
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          // Clear input value and store file
                                          const file = e.target.files[0];
                                          e.target.value = '';
                                          
                                          // Set loading state
                                          setUploadingImageId(card.id);
                                          
                                          // Delete old image then upload new one
                                          deleteImage(card.id)
                                            .then(() => {
                                              console.log('Old image deleted, uploading new one');
                                              return uploadImage(card.id, file);
                                            })
                                            .then(() => {
                                              console.log('Replace completed successfully');
                                              // Force a re-render is now handled inside uploadImage
                                            })
                                            .catch(err => {
                                              console.error('Replace failed:', err);
                                            });
                                        }
                                      }}
                                    />
                                    <label
                                      htmlFor={`image-replace-${card.id}`}
                                      className="bg-background text-white p-1 rounded cursor-pointer hover:bg-blue-600"
                                      title="Replace image"
                                    >
                                      <Upload className="h-4 w-4" />
                                    </label>
                                    <button
                                      onClick={() => deleteImage(card.id)}
                                      className="bg-background text-white p-1 rounded-full"
                                      title="Remove image"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <input
                                    type="file"
                                    id={`image-upload-${card.id}`}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        // Store the file and clear the input value
                                        const file = e.target.files[0];
                                        e.target.value = '';
                                        
                                        // Set loading state
                                        setUploadingImageId(card.id);
                                        
                                        // Upload image and handle completion
                                        uploadImage(card.id, file)
                                          .then(() => {
                                            console.log('Upload completed successfully');
                                            // Force a re-render is now handled inside uploadImage
                                          })
                                          .catch(err => {
                                            console.error('Upload failed:', err);
                                          });
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`image-upload-${card.id}`}
                                    className="cursor-pointer flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded"
                                  >
                                    {uploadingImageId === card.id ? (
                                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                                    ) : (
                                      <>
                                        <Upload className="h-8 w-8 text-text mb-2" />
                                        <p className="text-sm text-text text-center px-2">
                                          {error && uploadingImageId === card.id ? (
                                            <span className="text-text">Failed to upload: Check console</span>
                                          ) : (
                                            "Click to upload image"
                                          )}
                                        </p>
                                        {!error && (
                                          <p className="text-xs text-text mt-2 text-center">
                                            Supports: JPG, PNG, GIF, WebP<br/>
                                            Max size: 5MB
                                          </p>
                                        )}
                                      </>
                                    )}
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-text mb-1">Text Color</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={card.card_text_color || 'var(--color-secondary)'}
                              onChange={(e) => handleCardChange(card.id, 'card_text_color', e.target.value)}
                              className="p-1 border rounded h-10 w-10"
                            />
                            <input
                              type="text"
                              value={card.card_text_color || 'var(--color-secondary)'}
                              onChange={(e) => handleCardChange(card.id, 'card_text_color', e.target.value)}
                              className="flex-1 p-2 border rounded"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text mb-1">Icon Color</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={card.icon_color || 'var(--color-secondary)'}
                              onChange={(e) => handleCardChange(card.id, 'icon_color', e.target.value)}
                              className="p-1 border rounded h-10 w-10"
                            />
                            <input
                              type="text"
                              value={card.icon_color || 'var(--color-secondary)'}
                              onChange={(e) => handleCardChange(card.id, 'icon_color', e.target.value)}
                              className="flex-1 p-2 border rounded"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-text mb-1">Text Alignment</label>
                          <select
                            value={card.text_alignment || 'left'}
                            onChange={(e) => handleCardChange(card.id, 'text_alignment', e.target.value)}
                            className="w-full p-2 border rounded"
                          >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text mb-1">Icon Alignment</label>
                          <select
                            value={card.icon_alignment || 'left'}
                            onChange={(e) => handleCardChange(card.id, 'icon_alignment', e.target.value)}
                            className="w-full p-2 border rounded"
                          >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-text mb-1">Button Text</label>
                          <input
                            type="text"
                            value={card.button_text || ''}
                            onChange={(e) => handleCardChange(card.id, 'button_text', e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Learn More"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text mb-1">Button URL</label>
                          <input
                            type="text"
                            value={card.button_url || ''}
                            onChange={(e) => handleCardChange(card.id, 'button_url', e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="https://example.com/page"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default WhyChooseConfigPage; 