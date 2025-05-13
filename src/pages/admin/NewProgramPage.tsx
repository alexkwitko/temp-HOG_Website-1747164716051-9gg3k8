import React, { useState, useEffect } from 'react';
import { ArrowLeft, Award, Users, Calendar, Shield, Target, Dumbbell, Brain, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

const NewProgramPage: React.FC = () => {
  // Access global settings
  const { settings } = useSiteSettings();

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ProgramCategory[]>([]);
  const [icons, setIcons] = useState<Icon[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    slug: '',
    level: 'All Levels',
    duration: 60,
    image_url: '',
    is_featured: false,
    order: 1,
    instructor: '',
    is_active: true,
    category_id: '',
    background_color: '#f9fafb',
    text_color: 'var(--color-text)',
    button_color: 'var(--color-text)',
    button_text_color: '#ffffff',
    button_text: 'Learn More',
    icon: '',
    use_icon: true,
    // Card styling options
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
    image_position: 'top',
    display_priority: 10,
    status: 'published'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data, error } = await supabase
          .from('program_categories')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error fetching program categories:', error);
          // Don't throw error to allow form to load without categories
          setCategories([]);
        } else {
          setCategories(data || []);
          
          // Set default category if available
          if (data && data.length > 0) {
            setFormData(prev => ({ ...prev, category_id: data[0].id }));
          }
        }
        
        // Fetch icons
        const { data: iconData, error: iconError } = await supabase
          .from('icons_reference')
          .select('*')
          .order('display_name');
        
        if (iconError) {
          console.error('Error fetching icons:', iconError);
          // Don't throw error to allow form to load without icons
          setIcons([]);
        } else {
          setIcons(iconData || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedData = { ...prev, [name]: value };
      
      // Auto-generate slug from title
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
    setIsSubmitting(true);
    setError(null);

    try {
      // Include category_id in the data to submit - changed from previous version that omitted it
      const dataToSubmit = { ...formData };
      
      const { error: saveError } = await supabase
        .from('programs')
        .insert([dataToSubmit])
        .select()
        .single();
      
      if (saveError) throw saveError;
      
      // Redirect to programs list on success
      navigate('/admin/programs');
    } catch (err) {
      console.error('Error saving program:', err);
      setError(err instanceof Error ? err.message : 'Failed to save program');
      setIsSubmitting(false);
    }
  };

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
          <h2 className="text-2xl font-bold">Add New Program</h2>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {error && (
          <div className="p-4 bg-background border-l-4 border-red-500 text-text">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              <label htmlFor="slug" className="block text-sm font-medium text-text mb-1">
                Slug (URL-friendly name) *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
              />
              <p className="mt-1 text-sm text-text">Auto-generated from title</p>
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
                <option value="">-- Select Category --</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
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
                min="1"
                value={formData.duration}
                onChange={handleNumberChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
              />
            </div>

            <div>
              <label htmlFor="instructor" className="block text-sm font-medium text-text mb-1">
                Instructor
              </label>
              <input
                type="text"
                id="instructor"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
              />
            </div>

            <div className="col-span-2">
              <div className="mb-2">
                <label className="block text-sm font-medium text-text mb-1">Display Type</label>
                <div className="flex space-x-6">
                  <div className="flex items-center">
                    <input
                      id="use-icon"
                      type="radio"
                      checked={formData.use_icon}
                      onChange={() => handleToggleType(true)}
                      className="h-4 w-4 border-gray-300 text-text focus:ring-neutral-500"
                    />
                    <label htmlFor="use-icon" className="ml-2 block text-sm text-text">
                      Use Icon
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="use-image"
                      type="radio"
                      checked={!formData.use_icon}
                      onChange={() => handleToggleType(false)}
                      className="h-4 w-4 border-gray-300 text-text focus:ring-neutral-500"
                    />
                    <label htmlFor="use-image" className="ml-2 block text-sm text-text">
                      Use Image
                    </label>
                  </div>
                </div>
              </div>

              {formData.use_icon ? (
                <div className="w-full md:w-1/2">
                  <label htmlFor="icon" className="block text-sm font-medium text-text mb-1">
                    Icon
                  </label>
                  <select
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                    style={{ maxHeight: '38px' }}
                  >
                    <option value="">Select an icon</option>
                    {icons.slice(0, 20).map((icon) => (
                      <option key={icon.id} value={icon.name}>
                        {icon.display_name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-text">Select an icon to represent this program</p>
                </div>
              ) : (
                <div>
                  <label htmlFor="image_url" className="block text-sm font-medium text-text mb-1">
                    Image
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
                    height="h-40"
                  />
                </div>
              )}
            </div>

            <div className="w-full md:w-1/3">
              <label htmlFor="order" className="block text-sm font-medium text-text mb-1">
                Display Order
              </label>
              <input
                type="number"
                id="order"
                name="order"
                min="1"
                value={formData.order}
                onChange={handleNumberChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <h3 className="font-medium text-lg border-b pb-2 mb-4">Preview</h3>
              <div className="flex justify-center p-6 bg-background rounded-lg">
                <div 
                  style={{
                    backgroundColor: formData.background_color,
                    color: formData.text_color,
                    borderRadius: `${formData.border_radius}px`,
                    borderWidth: `${formData.border_width}px`,
                    borderColor: formData.border_color,
                    boxShadow: formData.shadow_size === 'sm' ? '0 1px 2px rgba(0,0,0,0.05)' : 
                               formData.shadow_size === 'md' ? '0 4px 6px rgba(0,0,0,0.1)' : 
                               formData.shadow_size === 'lg' ? '0 10px 15px rgba(0,0,0,0.1)' : 
                               formData.shadow_size === 'xl' ? '0 20px 25px rgba(0,0,0,0.15)' : 'none',
                    width: formData.card_width === 'small' ? '240px' : 
                           formData.card_width === 'medium' ? '320px' : 
                           formData.card_width === 'large' ? '400px' : '100%',
                    height: formData.card_height === 'small' ? '240px' : 
                            formData.card_height === 'medium' ? '320px' : 
                            formData.card_height === 'large' ? '400px' : 'auto',
                    padding: formData.padding === 'small' ? '12px' : 
                             formData.padding === 'medium' ? '24px' : 
                             formData.padding === 'large' ? '32px' : '16px',
                    textAlign: formData.content_alignment === 'center' ? 'center' : 
                              formData.content_alignment === 'right' ? 'right' : 'left',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                  className="border"
                >
                  {/* Image - if using image and image_position is top or background */}
                  {!formData.use_icon && formData.image_url && (formData.image_position === 'top' || formData.image_position === 'background') && (
                    <div 
                      style={{
                        position: formData.image_position === 'background' ? 'absolute' : 'relative',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: formData.image_position === 'background' ? 0 : 'auto',
                        zIndex: formData.image_position === 'background' ? 0 : 1,
                        height: formData.image_position === 'background' ? '100%' : '160px',
                        opacity: formData.image_position === 'background' ? 0.2 : 1
                      }}
                    >
                      <img 
                        src={formData.image_url} 
                        alt={formData.title || "Program"} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div style={{ position: 'relative', zIndex: 1 }} className="flex flex-col h-full">
                    {/* Icon */}
                    {formData.use_icon && formData.icon && (
                      <div className="mb-4 flex justify-center">
                        <div style={{ color: formData.icon_color }}>
                          {iconMap[formData.icon] || <span className="text-lg">icon</span>}
                        </div>
                      </div>
                    )}
                    
                    {/* Image - if using image and image_position is left */}
                    {!formData.use_icon && formData.image_url && formData.image_position === 'left' && (
                      <div className="flex mb-4">
                        <div className="w-1/3 mr-4">
                          <img 
                            src={formData.image_url} 
                            alt={formData.title || "Program"} 
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="w-2/3">
                          <h3 className="text-lg font-bold mb-2">{formData.title || "Program Title"}</h3>
                          <p className="text-sm">{formData.excerpt || "Program description..."}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Title and excerpt - when image is not left */}
                    {(formData.use_icon || !formData.image_url || formData.image_position !== 'left') && (
                      <>
                        <h3 className="text-lg font-bold mb-2">{formData.title || "Program Title"}</h3>
                        <p className="text-sm mb-4">{formData.excerpt || "Program description..."}</p>
                      </>
                    )}
                    
                    {/* Button */}
                    <div className={`mt-auto ${formData.content_alignment === 'center' ? 'text-center' : ''}`}>
                      <button
                        style={{
                          backgroundColor: formData.button_color,
                          color: formData.button_text_color,
                          borderRadius: `${formData.button_border_radius}px`,
                        }}
                        className="px-4 py-2 text-sm font-medium transition-colors"
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = formData.button_hover_color;
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = formData.button_color;
                        }}
                      >
                        {formData.button_text}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="excerpt" className="block text-sm font-medium text-text mb-1">
                Short Description (Excerpt) *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                value={formData.excerpt}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="content" className="block text-sm font-medium text-text mb-1">
                Full Description (Content) *
              </label>
              <textarea
                id="content"
                name="content"
                rows={4}
                value={formData.content}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <h3 className="font-medium text-lg border-b pb-2 mb-4">Style Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="background_color" className="block text-sm font-medium text-text mb-1">
                    Background Color
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      id="background_color"
                      name="background_color"
                      value={formData.background_color}
                      onChange={handleInputChange}
                      className="h-10 w-10 rounded border border-neutral-300"
                    />
                    <input
                      type="text"
                      value={formData.background_color}
                      onChange={handleInputChange}
                      name="background_color"
                      className="ml-2 flex-1 px-3 py-2 border border-neutral-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="text_color" className="block text-sm font-medium text-text mb-1">
                    Text Color
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      id="text_color"
                      name="text_color"
                      value={formData.text_color}
                      onChange={handleInputChange}
                      className="h-10 w-10 rounded border border-neutral-300"
                    />
                    <input
                      type="text"
                      value={formData.text_color}
                      onChange={handleInputChange}
                      name="text_color"
                      className="ml-2 flex-1 px-3 py-2 border border-neutral-300 rounded-md"
                    />
                  </div>
                </div>

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
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="button_color" className="block text-sm font-medium text-text mb-1">
                    Button Color
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      id="button_color"
                      name="button_color"
                      value={formData.button_color}
                      onChange={handleInputChange}
                      className="h-10 w-10 rounded border border-neutral-300"
                    />
                    <input
                      type="text"
                      value={formData.button_color}
                      onChange={handleInputChange}
                      name="button_color"
                      className="ml-2 flex-1 px-3 py-2 border border-neutral-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="button_text_color" className="block text-sm font-medium text-text mb-1">
                    Button Text Color
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      id="button_text_color"
                      name="button_text_color"
                      value={formData.button_text_color}
                      onChange={handleInputChange}
                      className="h-10 w-10 rounded border border-neutral-300"
                    />
                    <input
                      type="text"
                      value={formData.button_text_color}
                      onChange={handleInputChange}
                      name="button_text_color"
                      className="ml-2 flex-1 px-3 py-2 border border-neutral-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <h3 className="font-medium text-lg border-b pb-2 mb-4">Card Styling Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="icon_color" className="block text-sm font-medium text-text mb-1">
                    Icon Color
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      id="icon_color"
                      name="icon_color"
                      value={formData.icon_color}
                      onChange={handleInputChange}
                      className="h-10 w-10 rounded border border-neutral-300"
                    />
                    <input
                      type="text"
                      value={formData.icon_color}
                      onChange={handleInputChange}
                      name="icon_color"
                      className="ml-2 flex-1 px-3 py-2 border border-neutral-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="border_color" className="block text-sm font-medium text-text mb-1">
                    Border Color
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      id="border_color"
                      name="border_color"
                      value={formData.border_color}
                      onChange={handleInputChange}
                      className="h-10 w-10 rounded border border-neutral-300"
                    />
                    <input
                      type="text"
                      value={formData.border_color}
                      onChange={handleInputChange}
                      name="border_color"
                      className="ml-2 flex-1 px-3 py-2 border border-neutral-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="border_width" className="block text-sm font-medium text-text mb-1">
                    Border Width
                  </label>
                  <input
                    type="number"
                    id="border_width"
                    name="border_width"
                    min="0"
                    value={formData.border_width}
                    onChange={handleNumberChange}
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
                    min="0"
                    value={formData.border_radius}
                    onChange={handleNumberChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  />
                </div>

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
                    <option value="none">None</option>
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                  </select>
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
                    <option value="none">None</option>
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                  </select>
                </div>

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
                    <option value="none">None</option>
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
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
                    <option value="none">None</option>
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="button_border_radius" className="block text-sm font-medium text-text mb-1">
                    Button Border Radius
                  </label>
                  <input
                    type="number"
                    id="button_border_radius"
                    name="button_border_radius"
                    min="0"
                    value={formData.button_border_radius}
                    onChange={handleNumberChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  />
                </div>

                <div>
                  <label htmlFor="button_hover_color" className="block text-sm font-medium text-text mb-1">
                    Button Hover Color
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      id="button_hover_color"
                      name="button_hover_color"
                      value={formData.button_hover_color}
                      onChange={handleInputChange}
                      className="h-10 w-10 rounded border border-neutral-300"
                    />
                    <input
                      type="text"
                      value={formData.button_hover_color}
                      onChange={handleInputChange}
                      name="button_hover_color"
                      className="ml-2 flex-1 px-3 py-2 border border-neutral-300 rounded-md"
                    />
                  </div>
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
                    <option value="shadow">Shadow</option>
                    <option value="glow">Glow</option>
                  </select>
                </div>

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
                    <option value="expanded">Expanded</option>
                  </select>
                </div>

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
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="display_priority" className="block text-sm font-medium text-text mb-1">
                    Display Priority
                  </label>
                  <input
                    type="number"
                    id="display_priority"
                    name="display_priority"
                    min="1"
                    value={formData.display_priority}
                    onChange={handleNumberChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
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
              
              <div>
                <label htmlFor="status" className="block text-sm text-text">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm rounded-md"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-neutral-200 mt-8">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/admin/programs')}
                className="bg-white py-2 px-4 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-text hover:bg-background focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-background hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Program'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default NewProgramPage; 