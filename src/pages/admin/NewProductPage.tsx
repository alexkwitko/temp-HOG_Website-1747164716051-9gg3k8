import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductType } from '../../types/product';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductForm from '../../components/admin/ProductForm';

interface FetchError {
  message: string;
}

// Simple ID generator function instead of using uuid package
const generateId = (): string => {
  return 'id-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
};

const NewProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (productData: ProductType) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // In a real implementation, we would insert into Supabase
      // Example:
      // const newProduct = {
      //   ...productData,
      //   id: generateId() // Generate ID if needed
      // };
      // const { error } = await supabase
      //   .from('products')
      //   .insert(newProduct);
      //
      // if (error) throw error;

      // For now, just simulate a successful insert
      const newProduct = {
        ...productData,
        id: generateId() // Generate a unique ID
      };
      
      console.log('Product created:', newProduct);
      // Navigate back to products list after successful submission
      navigate('/admin/products');
    } catch (error: unknown) {
      const submitError = error as FetchError;
      setError(submitError.message || 'Failed to create product');
      console.error('Error creating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Add New Product</h2>
      </div>

      {error && (
        <div className="bg-background border-l-4 border-red-500 p-4 mb-6">
          <p className="text-text">{error}</p>
        </div>
      )}

      <ProductForm 
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </AdminLayout>
  );
};

export default NewProductPage; 