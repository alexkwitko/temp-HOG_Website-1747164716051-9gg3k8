import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import ProductCard from '../../components/shop/ProductCard';

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  product_type: string;
  vendor: string;
  status: string;
  image_url?: string;
  lowest_price?: number;
}

interface ProductImage {
  product_id: string;
  src: string;
}

interface ProductVariant {
  product_id: string;
  price: number;
}

const ProductsPage: React.FC = () => {
  const { collectionHandle } = useParams<{ collectionHandle?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collectionTitle, setCollectionTitle] = useState('All Products');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch collection info if a collection handle is provided
        if (collectionHandle) {
          const { data: collectionData, error: collectionError } = await supabase
            .from('shop.collections')
            .select('id, title')
            .eq('handle', collectionHandle)
            .single();

          if (collectionError) {
            throw new Error(`Error fetching collection: ${collectionError.message}`);
          }

          if (collectionData) {
            setCollectionTitle(collectionData.title);

            // Fetch products in the collection
            const { data: collectionProducts, error: productsError } = await supabase
              .from('shop.collection_products')
              .select(`
                product_id,
                shop.products!inner (
                  id, title, description, handle, product_type, vendor, status
                )
              `)
              .eq('collection_id', collectionData.id)
              .order('position');

            if (productsError) {
              throw new Error(`Error fetching collection products: ${productsError.message}`);
            }

            // Format the results - safely extract products from the joined query
            const formattedProducts: Product[] = [];
            
            // Use type assertion with safety check
            if (collectionProducts && Array.isArray(collectionProducts)) {
              collectionProducts.forEach(item => {
                if (item && item.products && typeof item.products === 'object') {
                  formattedProducts.push(item.products as Product);
                }
              });
            }

            // Fetch images and prices
            await Promise.all([
              fetchProductImages(formattedProducts),
              fetchProductPrices(formattedProducts)
            ]);

            setProducts(formattedProducts);
          }
        } else {
          // Fetch all products
          const { data: productsData, error: productsError } = await supabase
            .from('shop.products')
            .select('id, title, description, handle, product_type, vendor, status')
            .eq('status', 'active')
            .order('title');

          if (productsError) {
            throw new Error(`Error fetching products: ${productsError.message}`);
          }

          if (productsData) {
            // Fetch images and prices
            await Promise.all([
              fetchProductImages(productsData as Product[]),
              fetchProductPrices(productsData as Product[])
            ]);

            setProducts(productsData as Product[]);
          }
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [collectionHandle]);

  // Helper to fetch product images
  const fetchProductImages = async (products: Product[]) => {
    if (!products.length) return;

    try {
      const productIds = products.map(p => p.id);
      const { data: imagesData, error: imagesError } = await supabase
        .from('shop.product_images')
        .select('product_id, src')
        .in('product_id', productIds)
        .eq('position', 1);

      if (imagesError) {
        console.error('Error fetching images:', imagesError);
        return;
      }

      // Map images to products
      products.forEach(product => {
        const productImage = (imagesData as ProductImage[])?.find((img: ProductImage) => img.product_id === product.id);
        product.image_url = productImage?.src;
      });
    } catch (err) {
      console.error('Error in fetchProductImages:', err);
    }
  };

  // Helper to fetch lowest prices for products
  const fetchProductPrices = async (products: Product[]) => {
    if (!products.length) return;

    try {
      const productIds = products.map(p => p.id);
      const { data: variantsData, error: variantsError } = await supabase
        .from('shop.product_variants')
        .select('product_id, price')
        .in('product_id', productIds);

      if (variantsError) {
        console.error('Error fetching prices:', variantsError);
        return;
      }

      // Find lowest price for each product
      products.forEach(product => {
        const productVariants = (variantsData as ProductVariant[])?.filter((v: ProductVariant) => v.product_id === product.id) || [];
        if (productVariants.length) {
          const prices = productVariants.map((v: ProductVariant) => v.price);
          product.lowest_price = Math.min(...prices);
        }
      });
    } catch (err) {
      console.error('Error in fetchProductPrices:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">{collectionTitle}</h1>
        <div className="flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">{collectionTitle}</h1>
        <div className="rounded-lg bg-background p-4 text-text">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">{collectionTitle}</h1>
        <p className="text-lg text-text">No products found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{collectionTitle}</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            description={product.description || ''}
            price={product.lowest_price || 0}
            imageUrl={product.image_url || ''}
            handle={product.handle}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage; 