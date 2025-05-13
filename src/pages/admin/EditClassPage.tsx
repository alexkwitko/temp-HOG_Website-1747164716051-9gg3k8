import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase/supabaseClient';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

interface ClassCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
}

const EditClassPage: React.FC = () => {
  // Access global settings
  const { settings } = useSiteSettings();

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ClassCategory[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 'All Levels',
    duration: 60,
    image_url: '',
    is_featured: false,
    order: 1,
    instructor: '',
    is_active: true,
    category_id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const { data: catData, error: catError } = await supabase
          .from('class_categories')
          .select('*')
          .order('name');
        
        if (catError) throw catError;
        setCategories(catData || []);
        
        // Fetch the class by ID
        if (id) {
          const { data, error } = await supabase
            .from('classes')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          
          if (data) {
            // Set form data from the fetched class
            setFormData({
              name: data.name || '',
              description: data.description || '',
              level: data.level || 'All Levels',
              duration: data.duration || 60,
              image_url: data.image_url || '',
              is_featured: data.is_featured || false,
              order: data.order || 1,
              instructor: data.instructor || '',
              is_active: data.is_active !== undefined ? data.is_active : true,
              category_id: data.category_id || ''
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSaving(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('classes')
        .update(formData)
        .eq('id', id);
      
      if (error) throw error;
      
      // Redirect to classes list on success
      navigate('/admin/classes');
    } catch (err) {
      console.error('Error updating class:', err);
      setError(err instanceof Error ? err.message : 'Failed to update class');
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
            onClick={() => navigate('/admin/classes')}
            className="text-text hover:text-neutral-900"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold">Edit Class</h2>
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
              <label htmlFor="name" className="block text-sm font-medium text-text mb-1">
                Class Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
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

            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-text mb-1">
                Image URL
              </label>
              <input
                type="text"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
              />
            </div>

            <div>
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
              <label htmlFor="description" className="block text-sm font-medium text-text mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
              />
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
                  Featured Class
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

          <div className="pt-5 border-t border-neutral-200 mt-8">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/admin/classes')}
                className="bg-white py-2 px-4 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-text hover:bg-background focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-background hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditClassPage; 