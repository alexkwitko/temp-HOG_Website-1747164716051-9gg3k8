import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { ProductType } from '../../types/product';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductForm from '../../components/admin/ProductForm';
import { supabase } from '../../lib/supabase/supabaseClient';

interface FetchError {
  message: string;
}

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FetchError | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw new Error(`Error fetching product: ${error.message}`);
        }

        if (data) {
          setProduct(data);
        } else {
          setError({ message: 'Product not found' });
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError({ message: err instanceof Error ? err.message : 'Failed to fetch product' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (productData: ProductType) => {
    try {
      setIsSaving(true);
      
      // Update the product in Supabase
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id);

      if (error) {
        throw new Error(`Error updating product: ${error.message}`);
      }

      navigate('/admin/products');
    } catch (err) {
      console.error('Failed to update product:', err);
      setError({ message: err instanceof Error ? err.message : 'Failed to update product' });
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

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-background border-l-4 border-red-400 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-text mr-2" />
            <span className="text-text">{error.message}</span>
          </div>
          <button 
            onClick={() => navigate('/admin/products')}
            className="mt-4 text-sm text-text hover:underline"
          >
            Back to Products
          </button>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="bg-background border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-text mr-2" />
            <span className="text-text">Product not found</span>
          </div>
          <button 
            onClick={() => navigate('/admin/products')}
            className="mt-4 text-sm text-text hover:underline"
          >
            Back to Products
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Edit Product</h2>
        <p className="text-text">Update product information</p>
      </div>

      <ProductForm 
        product={product}
        onSubmit={handleSubmit}
        isLoading={isSaving}
      />
    </AdminLayout>
  );
};

export default EditProductPage; 