
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  title: string;
  price: number;
  is_free: boolean;
  listing_type: string;
  location: string;
  images: string[];
  condition: string;
  user_id: string;
  category_id: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
}

export const useBrowseData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      
      // First fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Then fetch profiles for each product
      const productsWithProfiles = await Promise.all(
        (productsData || []).map(async (product) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', product.user_id)
            .single();

          return {
            ...product,
            profiles: profileData
          };
        })
      );

      setProducts(productsWithProfiles);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  return {
    products,
    categories,
    isLoading,
    refetchProducts: fetchProducts
  };
};
