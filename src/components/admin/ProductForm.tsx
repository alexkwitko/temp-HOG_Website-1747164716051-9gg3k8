import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Trash2 } from 'lucide-react';
import { ProductType } from '../../types/product';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

interface ProductFormProps {
  product?: ProductType;
  onSubmit: (productData: ProductType) => Promise<void>;
  isLoading: boolean;
}

const defaultProduct: ProductType = {
  id: '',
  name: '',
  description: '',
  price: 0,
  images: [],
  category: '',
  featured: false,
  inStock: true,
  variants: []
};

const ProductForm: React.FC<ProductFormProps> = ({ 
  product = defaultProduct, 
  onSubmit,
  isLoading
}) => {
  // Access global settings
  const { settings } = useSiteSettings();

  const [formData, setFormData] = useState<ProductType>(product);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newVariant, setNewVariant] = useState({ size: '', color: '' });
  const [imageUrls, setImageUrls] = useState<string[]>(product.images || []);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  // Categories (would typically be fetched from the API)
  const categories = ['Gi', 'No-Gi', 'Accessories', 'Memberships'];

  useEffect(() => {
    setFormData(product);
    setImageUrls(product.images || []);
  }, [product]);

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleVariantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVariant({
      ...newVariant,
      [name]: value
    });
  };

  const addVariant = () => {
    if (newVariant.size || newVariant.color) {
      setFormData({
        ...formData,
        variants: [
          ...formData.variants || [],
          { ...newVariant }
        ]
      });
      setNewVariant({ size: '', color: '' });
    }
  };

  const removeVariant = (index: number) => {
    const updatedVariants = [...(formData.variants || [])];
    updatedVariants.splice(index, 1);
    setFormData({
      ...formData,
      variants: updatedVariants
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const addImageUrl = () => {
    if (previewUrl) {
      // In a real implementation, this would upload the image to Supabase Storage
      // and get the URL back, but for now, we'll just use the preview URL
      setImageUrls([...imageUrls, previewUrl]);
      setPreviewUrl(null);
      setImageFile(null);
    }
  };

  const removeImage = (index: number) => {
    const updatedUrls = [...imageUrls];
    updatedUrls.splice(index, 1);
    setImageUrls(updatedUrls);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (imageUrls.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const productData = {
        ...formData,
        images: imageUrls
      };
      
      await onSubmit(productData);
      navigate('/admin/products');
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text mb-1">
              Product Name <span className="text-text">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`block w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-neutral-300'} focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm p-2`}
            />
            {errors.name && <p className="mt-1 text-sm text-text">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text mb-1">
              Description <span className="text-text">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`block w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-neutral-300'} focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm p-2`}
            />
            {errors.description && <p className="mt-1 text-sm text-text">{errors.description}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-text mb-1">
                Price ($) <span className="text-text">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`block w-full rounded-md border ${errors.price ? 'border-red-500' : 'border-neutral-300'} focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm p-2`}
              />
              {errors.price && <p className="mt-1 text-sm text-text">{errors.price}</p>}
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-text mb-1">
                Category <span className="text-text">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`block w-full rounded-md border ${errors.category ? 'border-red-500' : 'border-neutral-300'} focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm p-2`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-text">{errors.category}</p>}
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-text focus:ring-neutral-500 border-neutral-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-text">
                Featured Product
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                checked={formData.inStock}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-text focus:ring-neutral-500 border-neutral-300 rounded"
              />
              <label htmlFor="inStock" className="ml-2 block text-sm text-text">
                In Stock
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Images</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img 
                  src={url} 
                  alt={`Product ${index + 1}`} 
                  className="h-32 w-full object-cover rounded-md border border-neutral-300"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm text-text hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          
          {errors.images && <p className="mt-1 text-sm text-text">{errors.images}</p>}
          
          <div className="mt-4">
            <div className="flex items-center space-x-4">
              <label className="block">
                <span className="sr-only">Choose image</span>
                <input 
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="block w-full text-sm text-neutral-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-neutral-50 file:text-neutral-700
                    hover:file:bg-neutral-100
                  "
                />
              </label>
              
              {previewUrl && (
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-background hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                >
                  <Plus size={16} className="mr-1" />
                  Add Image
                </button>
              )}
            </div>
            
            {previewUrl && (
              <div className="mt-4 flex items-center space-x-4">
                <div className="h-32 w-32 overflow-hidden rounded-md border border-neutral-300">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null);
                    setImageFile(null);
                  }}
                  className="text-text hover:text-red-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Variants</h3>
        
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-background">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                    Size
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                    Color
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-text uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {formData.variants && formData.variants.map((variant, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                      {variant.size || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                      {variant.color || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-text hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <input
                      type="text"
                      name="size"
                      value={newVariant.size}
                      onChange={handleVariantChange}
                      placeholder="Size (e.g. S, M, L)"
                      className="block w-full rounded-md border border-neutral-300 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm p-2"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <input
                      type="text"
                      name="color"
                      value={newVariant.color}
                      onChange={handleVariantChange}
                      placeholder="Color (e.g. Red, Blue)"
                      className="block w-full rounded-md border border-neutral-300 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm p-2"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <button
                      type="button"
                      onClick={addVariant}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-background hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                    >
                      <Plus size={16} className="mr-1" />
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md shadow-sm text-text bg-white hover:bg-background focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-background hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm; 