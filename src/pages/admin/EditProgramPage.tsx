import React, { useState, useEffect } from 'react';
import { ArrowLeft, Award, Users, Calendar, Shield, Target, Dumbbell, Brain, ShieldCheck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase/supabaseClient';
import ImageUploader from '../../components/ImageUploader';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

interface ProgramCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
}

interface Icon {
  id: string;
  name: string;
  display_name: string;
  category?: string;
}

// Map icon names to Lucide icon components
const iconMap: Record<string, React.ReactNode> = {
  'Award': <Award />,
  'Users': <Users />,
  'Calendar': <Calendar />,
  'ShieldCheck': <ShieldCheck />,
  'Brain': <Brain />,
  'Shield': <Shield />,
  'Target': <Target />,
  'Dumbbell': <Dumbbell />,
};

interface FormData {
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  level: string;
  duration: number;
  image_url: string;
  is_featured: boolean;
  order: number;
  is_active: boolean;
  category_id: string;
  background_color: string;
  text_color: string;
  button_color: string;
  button_text_color: string;
  button_text: string;
  show_button: boolean;
  icon: string;
  use_icon: boolean;
  icon_color: string;
  border_color: string;
  border_width: number;
  border_radius: number;
  shadow_size: 'sm' | 'md' | 'lg';
  padding: 'small' | 'medium' | 'large';
  card_width: 'small' | 'medium' | 'large';
  card_height: 'small' | 'medium' | 'large' | 'auto';
  button_border_radius: number;
  button_hover_color: string;
  animation_type: 'none' | 'fade' | 'slide';
  hover_effect: 'none' | 'lift' | 'grow' | 'shadow' | 'glow';
  layout_style: 'standard' | 'compact' | 'featured' | 'icon-only';
  content_alignment: 'left' | 'center' | 'right';
  title_alignment: 'left' | 'center' | 'right';
  image_position: 'top' | 'left' | 'right' | 'bottom' | 'background';
  display_priority: number;
  status: 'published' | 'draft';
}

const EditProgramPage: React.FC = () => {
  // Access global settings
  const { settings } = useSiteSettings();

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ProgramCategory[]>([]);
  const [icons, setIcons] = useState<Icon[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    excerpt: '',
    content: '',
    slug: '',
    level: 'All Levels',
    duration: 60,
    image_url: '',
    is_featured: false,
    order: 1,
    is_active: true,
    category_id: '',
    background_color: '#f9fafb',
    text_color: 'var(--color-text)',
    button_color: 'var(--color-text)',
    button_text_color: '#ffffff',
    button_text: 'Learn More',
    show_button: true,
    icon: '',
    use_icon: true,
    icon_color: 'var(--color-text)',
    border_color: '#e5e7eb',
    border_width: 1,
    border_radius: 8,
    shadow_size: 'md',
    padding: 'medium',
    card_width: 'medium',
    card_height: 'auto',
    button_border_radius: 4,
    button_hover_color: '#374151',
    animation_type: 'none',
    hover_effect: 'none',
    layout_style: 'standard',
    content_alignment: 'center',
    title_alignment: 'center',
    image_position: 'top',
    display_priority: 10,
    status: 'published'
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const { data: catData, error: catError } = await supabase
          .from('program_categories')
          .select('*')
          .order('name');
        
        if (catError) {
          console.error('Error fetching program categories:', catError);
          // Don't throw error to allow the form to load without categories
          setCategories([]);
        } else {
          setCategories(catData || []);
        }
        
        // Fetch icons
        const { data: iconData, error: iconError } = await supabase
          .from('icons_reference')
          .select('*')
          .order('display_name');
        
        if (iconError) {
          console.error('Error fetching icons:', iconError);
          // Don't throw error to allow the form to load without icons
          setIcons([]);
        } else {
          setIcons(iconData || []);
        }
        
        // Fetch the program by ID
        if (id) {
          const { data, error } = await supabase
            .from('programs')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          
          if (data) {
            // Determine if using icon or image
            const useIcon = !data.image_url || !!data.icon;
            
            // Set form data from the fetched program
            setFormData({
              title: data.title || '',
              excerpt: data.excerpt || '',
              content: data.content || '',
              slug: data.slug || '',
              level: data.level || 'All Levels',
              duration: data.duration || 60,
              image_url: data.image_url || '',
              is_featured: data.is_featured || false,
              order: data.order || 1,
              is_active: data.is_active !== undefined ? data.is_active : true,
              category_id: data.category_id || '',
              background_color: data.background_color || '#f9fafb',
              text_color: data.text_color || 'var(--color-text)',
              button_color: data.button_color || 'var(--color-text)',
              button_text_color: data.button_text_color || '#ffffff',
              button_text: data.button_text || 'Learn More',
              show_button: true,
              icon: data.icon || '',
              use_icon: useIcon,
              icon_color: data.icon_color || 'var(--color-text)',
              border_color: data.border_color || '#e5e7eb',
              border_width: data.border_width || 1,
              border_radius: data.border_radius || 8,
              shadow_size: data.shadow_size || 'md',
              padding: data.padding || 'medium',
              card_width: data.card_width || 'medium',
              card_height: data.card_height || 'auto',
              button_border_radius: data.button_border_radius || 4,
              button_hover_color: data.button_hover_color || '#374151',
              animation_type: data.animation_type || 'none',
              hover_effect: data.hover_effect || 'none',
              layout_style: data.layout_style || 'standard',
              content_alignment: data.content_alignment || 'center',
              title_alignment: data.title_alignment || 'center',
              image_position: data.image_position || 'top',
              display_priority: data.display_priority || 10,
              status: data.status || 'published'
            });
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedData = { ...prev, [name]: value };
      
      // Auto-generate slug from title if title field is changed
      if (name === 'title') {
        updatedData.slug = value
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
      }
      
      return updatedData;
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };

  const handleToggleType = (useIcon: boolean) => {
    // If toggling to use icon and currently using image, clear the image
    if (useIcon && !formData.use_icon) {
      setFormData(prev => ({
        ...prev,
        use_icon: true,
        image_url: ''
      }));
    } 
    // If toggling to use image and currently using icon, clear the icon
    else if (!useIcon && formData.use_icon) {
      setFormData(prev => ({
        ...prev,
        use_icon: false,
        icon: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSaving(true);
    setError(null);

    try {
      // Get all form data
      const baseData = formData;
      
      // Create a safe version of the data to submit, with all types properly converted
      const dataToSubmit = {
        title: baseData.title || '',
        excerpt: baseData.excerpt || '',
        content: baseData.content || '',
        slug: baseData.slug || '',
        level: baseData.level || 'All Levels',
        duration: Number(baseData.duration) || 60,
        image_url: baseData.image_url || '',
        is_featured: Boolean(baseData.is_featured),
        order: Number(baseData.order) || 1,
        is_active: Boolean(baseData.is_active),
        show_button: Boolean(baseData.show_button),
        button_text: baseData.button_text || 'Learn More',
        icon: baseData.icon || '',
        use_icon: Boolean(baseData.use_icon),
        icon_color: baseData.icon_color || 'var(--color-text)',
        background_color: baseData.background_color || '#f9fafb',
        text_color: baseData.text_color || 'var(--color-text)',
        button_color: baseData.button_color || 'var(--color-text)',
        button_text_color: baseData.button_text_color || '#ffffff',
        border_color: baseData.border_color || '#e5e7eb',
        border_width: Number(baseData.border_width) || 1,
        border_radius: Number(baseData.border_radius) || 8,
        shadow_size: baseData.shadow_size || 'md',
        padding: baseData.padding || 'medium',
        card_width: baseData.card_width || 'medium',
        card_height: baseData.card_height || 'auto',
        button_border_radius: Number(baseData.button_border_radius) || 4,
        button_hover_color: baseData.button_hover_color || '#374151',
        animation_type: baseData.animation_type || 'none',
        hover_effect: baseData.hover_effect || 'none',
        layout_style: baseData.layout_style || 'standard',
        content_alignment: baseData.content_alignment || 'center',
        title_alignment: baseData.title_alignment || 'center',
        image_position: baseData.image_position || 'top',
        display_priority: Number(baseData.display_priority) || 10,
        status: baseData.status || 'published',
        // Include category_id if it exists
        ...(baseData.category_id ? { category_id: baseData.category_id } : {})
      };
      
      console.log('Submitting data:', dataToSubmit);
      
      const { error, data } = await supabase
        .from('programs')
        .update(dataToSubmit)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      console.log('Update successful:', data);
      
      // Redirect to programs list on success
      navigate('/admin/programs');
    } catch (err) {
      console.error('Error updating program:', err);
      setError(err instanceof Error ? err.message : 'Failed to update program');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/programs')}
            className="text-text hover:text-neutral-900"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold">Edit Program</h2>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {error && (
          <div className="p-4 bg-background border-l-4 border-red-500 text-text">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-text">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-text mb-1">
                  Program Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                />
              </div>
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-text mb-1">
                  Category
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-text mb-1">
                  Level
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                >
                  <option value="All Levels">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-text mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleNumberChange}
                  min="0"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-text">Content</h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-text mb-1">
                  Short Description
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-text mb-1">
                  Full Description
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                />
              </div>
            </div>
          </div>

          {/* Visual Elements Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-text">Visual Elements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="use_icon"
                      checked={formData.use_icon}
                      onChange={() => handleToggleType(true)}
                      className="form-radio"
                    />
                    <span className="ml-2">Use Icon</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="use_icon"
                      checked={!formData.use_icon}
                      onChange={() => handleToggleType(false)}
                      className="form-radio"
                    />
                    <span className="ml-2">Use Image</span>
                  </label>
                </div>

                {formData.use_icon ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="icon" className="block text-sm font-medium text-text mb-1">
                        Icon
                      </label>
                      <select
                        id="icon"
                        name="icon"
                        value={formData.icon}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                      >
                        <option value="">Select an icon</option>
                        {icons.map((icon) => (
                          <option key={icon.id} value={icon.name}>
                            {icon.display_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="icon_color" className="block text-sm font-medium text-text mb-1">
                        Icon Color
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="color"
                          id="icon_color"
                          name="icon_color"
                          value={formData.icon_color}
                          onChange={handleInputChange}
                          className="h-9 w-9 p-1 border border-neutral-300 rounded-md"
                        />
                        <input
                          type="text"
                          name="icon_color"
                          value={formData.icon_color}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm"
                          placeholder="var(--color-text)"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">
                      Program Image
                    </label>
                    <ImageUploader
                      currentImageUrl={formData.image_url}
                      onImageUploaded={(url) => {
                        setFormData(prev => ({
                          ...prev,
                          image_url: url,
                          use_icon: false
                        }));
                      }}
                      onImageDeleted={() => {
                        setFormData(prev => ({
                          ...prev,
                          image_url: ''
                        }));
                      }}
                      folder="program-images"
                      placeholderText="Upload a program image (recommended size: 800x600)"
                      height="h-48"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="layout_style" className="block text-sm font-medium text-text mb-1">
                    Layout Style
                  </label>
                  <select
                    id="layout_style"
                    name="layout_style"
                    value={formData.layout_style}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  >
                    <option value="standard">Standard</option>
                    <option value="compact">Compact</option>
                    <option value="featured">Featured</option>
                    <option value="icon-only">Icon Only</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="content_alignment" className="block text-sm font-medium text-text mb-1">
                      Content Alignment
                    </label>
                    <select
                      id="content_alignment"
                      name="content_alignment"
                      value={formData.content_alignment}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="title_alignment" className="block text-sm font-medium text-text mb-1">
                      Title Alignment
                    </label>
                    <select
                      id="title_alignment"
                      name="title_alignment"
                      value={formData.title_alignment}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="image_position" className="block text-sm font-medium text-text mb-1">
                    Image Position
                  </label>
                  <select
                    id="image_position"
                    name="image_position"
                    value={formData.image_position}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  >
                    <option value="top">Top</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="bottom">Bottom</option>
                    <option value="background">Background</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="card_width" className="block text-sm font-medium text-text mb-1">
                      Card Width
                    </label>
                    <select
                      id="card_width"
                      name="card_width"
                      value={formData.card_width}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="card_height" className="block text-sm font-medium text-text mb-1">
                      Card Height
                    </label>
                    <select
                      id="card_height"
                      name="card_height"
                      value={formData.card_height}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                    >
                      <option value="auto">Auto</option>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Button Options */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-text">Button Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show_button"
                  name="show_button"
                  checked={formData.show_button}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-text focus:ring-neutral-500 border-neutral-300 rounded"
                />
                <label htmlFor="show_button" className="ml-2 block text-sm text-text">
                  Show Button
                </label>
              </div>
              
              {formData.show_button && (
                <>
                  <div>
                    <label htmlFor="button_text" className="block text-sm font-medium text-text mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      id="button_text"
                      name="button_text"
                      value={formData.button_text}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="button_color" className="block text-sm font-medium text-text mb-1">
                        Button Color
                      </label>
                      <input
                        type="color"
                        id="button_color"
                        name="button_color"
                        value={formData.button_color}
                        onChange={handleInputChange}
                        className="w-full h-10 px-1 py-1 border border-neutral-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="button_text_color" className="block text-sm font-medium text-text mb-1">
                        Button Text Color
                      </label>
                      <input
                        type="color"
                        id="button_text_color"
                        name="button_text_color"
                        value={formData.button_text_color}
                        onChange={handleInputChange}
                        className="w-full h-10 px-1 py-1 border border-neutral-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="button_hover_color" className="block text-sm font-medium text-text mb-1">
                        Button Hover Color
                      </label>
                      <input
                        type="color"
                        id="button_hover_color"
                        name="button_hover_color"
                        value={formData.button_hover_color}
                        onChange={handleInputChange}
                        className="w-full h-10 px-1 py-1 border border-neutral-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="button_border_radius" className="block text-sm font-medium text-text mb-1">
                        Button Radius
                      </label>
                      <input
                        type="number"
                        id="button_border_radius"
                        name="button_border_radius"
                        value={formData.button_border_radius}
                        onChange={handleNumberChange}
                        min="0"
                        max="20"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Styling Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-text">Card Styling</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="background_color" className="block text-sm font-medium text-text mb-1">
                  Background Color
                </label>
                <input
                  type="color"
                  id="background_color"
                  name="background_color"
                  value={formData.background_color}
                  onChange={handleInputChange}
                  className="w-full h-10 px-1 py-1 border border-neutral-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="text_color" className="block text-sm font-medium text-text mb-1">
                  Text Color
                </label>
                <input
                  type="color"
                  id="text_color"
                  name="text_color"
                  value={formData.text_color}
                  onChange={handleInputChange}
                  className="w-full h-10 px-1 py-1 border border-neutral-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="padding" className="block text-sm font-medium text-text mb-1">
                  Padding
                </label>
                <select
                  id="padding"
                  name="padding"
                  value={formData.padding}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="text-md font-medium text-text mb-3">Border Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="border_color" className="block text-sm font-medium text-text mb-1">
                    Border Color
                  </label>
                  <input
                    type="color"
                    id="border_color"
                    name="border_color"
                    value={formData.border_color}
                    onChange={handleInputChange}
                    className="w-full h-10 px-1 py-1 border border-neutral-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="border_width" className="block text-sm font-medium text-text mb-1">
                    Border Width
                  </label>
                  <input
                    type="number"
                    id="border_width"
                    name="border_width"
                    value={formData.border_width}
                    onChange={handleNumberChange}
                    min="0"
                    max="10"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  />
                </div>
                <div>
                  <label htmlFor="border_radius" className="block text-sm font-medium text-text mb-1">
                    Border Radius
                  </label>
                  <input
                    type="number"
                    id="border_radius"
                    name="border_radius"
                    value={formData.border_radius}
                    onChange={handleNumberChange}
                    min="0"
                    max="20"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="text-md font-medium text-text mb-3">Effects</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="shadow_size" className="block text-sm font-medium text-text mb-1">
                    Shadow Size
                  </label>
                  <select
                    id="shadow_size"
                    name="shadow_size"
                    value={formData.shadow_size}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  >
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="hover_effect" className="block text-sm font-medium text-text mb-1">
                    Hover Effect
                  </label>
                  <select
                    id="hover_effect"
                    name="hover_effect"
                    value={formData.hover_effect}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  >
                    <option value="none">None</option>
                    <option value="lift">Lift</option>
                    <option value="grow">Grow</option>
                    <option value="shadow">Shadow</option>
                    <option value="glow">Glow</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="animation_type" className="block text-sm font-medium text-text mb-1">
                    Animation Type
                  </label>
                  <select
                    id="animation_type"
                    name="animation_type"
                    value={formData.animation_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  >
                    <option value="none">None</option>
                    <option value="fade">Fade</option>
                    <option value="slide">Slide</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-text">Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-text focus:ring-neutral-500 border-neutral-300 rounded"
                />
                <label htmlFor="is_featured" className="ml-2 block text-sm text-text">
                  Featured Program
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-text focus:ring-neutral-500 border-neutral-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-text">
                  Active
                </label>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-lg font-semibold text-text">Preview</h3>
            <div className="bg-background p-6 rounded-lg">
              <div
                className="mx-auto transition-all duration-300 ease-in-out"
                style={{
                  backgroundColor: formData.background_color,
                  color: formData.text_color,
                  borderColor: formData.border_color,
                  borderWidth: formData.border_width,
                  borderRadius: formData.border_radius,
                  padding: formData.padding === 'small' ? '1rem' : formData.padding === 'large' ? '2rem' : '1.5rem',
                  boxShadow: formData.hover_effect === 'shadow' ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' :
                    formData.hover_effect === 'glow' ? '0 0 15px rgba(0, 0, 0, 0.2)' :
                    formData.shadow_size === 'sm' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' :
                    formData.shadow_size === 'lg' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  width: formData.card_width === 'small' ? '16rem' :
                    formData.card_width === 'large' ? '24rem' : '20rem',
                  height: formData.card_height === 'small' ? '12rem' :
                    formData.card_height === 'large' ? '20rem' : 'auto',
                  transform: formData.hover_effect === 'grow' ? 'scale(1.02)' :
                    formData.hover_effect === 'lift' ? 'translateY(-4px)' : 'none',
                  display: 'flex',
                  flexDirection: formData.layout_style === 'compact' ? 'row' : 'column',
                  alignItems: formData.content_alignment === 'center' ? 'center' : 
                              formData.content_alignment === 'right' ? 'flex-end' : 'flex-start',
                  justifyContent: formData.layout_style === 'compact' ? 'space-between' : 'flex-start',
                  overflow: 'hidden'
                }}
              >
                {/* Background image - if using image and image_position is background */}
                {!formData.use_icon && formData.image_url && formData.image_position === 'background' && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url(${formData.image_url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: 0.3,
                      zIndex: 0
                    }}
                  />
                )}
                
                <div 
                  style={{ 
                    position: 'relative', 
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    flexDirection: formData.layout_style === 'compact' ? 'row' : 'column',
                    alignItems: formData.content_alignment === 'center' ? 'center' : 
                               formData.content_alignment === 'right' ? 'flex-end' : 'flex-start',
                  }} 
                  className="h-full"
                >
                  {/* Top Image */}
                  {!formData.use_icon && formData.image_url && formData.image_position === 'top' && (
                    <div className="w-full mb-4 text-center">
                      <img 
                        src={formData.image_url} 
                        alt={formData.title} 
                        className="max-h-24 object-cover rounded inline-block"
                      />
                    </div>
                  )}
                  
                  {/* Icon */}
                  {formData.use_icon && formData.icon && (
                    <div className={`${formData.layout_style === 'icon-only' ? 'text-3xl' : 'text-xl'} mb-4 flex justify-center`}>
                      <div style={{ color: formData.icon_color }}>
                        {iconMap[formData.icon] || <span>icon</span>}
                      </div>
                    </div>
                  )}
                  
                  {/* Left Image */}
                  {!formData.use_icon && formData.image_url && formData.image_position === 'left' && (
                    <div className={`${formData.layout_style === 'compact' ? 'w-1/3 mr-4' : 'w-full mb-4'}`}>
                      <img 
                        src={formData.image_url} 
                        alt={formData.title} 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div 
                    className={`flex flex-col ${formData.image_position === 'left' || formData.image_position === 'right' ? 'flex-1' : 'w-full'}`}
                    style={{
                      textAlign: formData.content_alignment as 'left' | 'center' | 'right'
                    }}
                  >
                    {/* Don't show content if icon-only layout */}
                    {formData.layout_style !== 'icon-only' && (
                      <>
                        {/* Title */}
                        <h3 
                          className={`font-bold ${formData.layout_style === 'featured' ? 'text-xl' : 'text-lg'} mb-2`}
                          style={{ textAlign: formData.title_alignment as 'left' | 'center' | 'right' }}
                        >
                          {formData.title}
                        </h3>
                        
                        {/* Excerpt - compact layout might hide this */}
                        {formData.layout_style !== 'compact' && (
                          <p 
                            className="text-sm mb-4"
                            style={{ textAlign: formData.content_alignment as 'left' | 'center' | 'right' }}
                          >
                            {formData.excerpt}
                          </p>
                        )}
                      </>
                    )}
                    
                    {/* Button */}
                    {formData.show_button && (
                      <button
                        type="button"
                        className="mt-auto w-full py-2 px-4 rounded transition-colors duration-200"
                        style={{
                          backgroundColor: formData.button_color,
                          color: formData.button_text_color,
                          borderRadius: formData.button_border_radius,
                        }}
                      >
                        {formData.button_text}
                      </button>
                    )}
                  </div>
                  
                  {/* Right Image */}
                  {!formData.use_icon && formData.image_url && formData.image_position === 'right' && (
                    <div className={`${formData.layout_style === 'compact' ? 'w-1/3 ml-4' : 'w-full mt-4'}`}>
                      <img 
                        src={formData.image_url} 
                        alt={formData.title} 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  )}
                  
                  {/* Bottom Image */}
                  {!formData.use_icon && formData.image_url && formData.image_position === 'bottom' && (
                    <div className="w-full mt-4">
                      <img 
                        src={formData.image_url} 
                        alt={formData.title} 
                        className="w-full max-h-24 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/admin/programs')}
              className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-text bg-white hover:bg-background focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-background hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditProgramPage; 