
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBrowseData } from '@/hooks/useBrowseData';
import { useProductFilters } from '@/hooks/useProductFilters';
import Navigation from '@/components/Navigation';
import BrowseFilters from '@/components/BrowseFilters';
import ProductsGrid from '@/components/ProductsGrid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Browse = () => {
  const { user } = useAuth();
  const { products, categories, isLoading, refetchProducts } = useBrowseData();
  const {
    searchQuery,
    selectedCategory,
    sortBy,
    filterType,
    priceRange,
    filteredProducts,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    setFilterType,
    setPriceRange
  } = useProductFilters(products);
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleContactSeller = async (productId: string, sellerId: string, productTitle: string) => {
    if (!user) {
      toast.error('Please sign in to contact sellers');
      return;
    }

    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([
          {
            product_id: productId,
            buyer_id: user.id,
            seller_id: sellerId,
            message: `Hi! I'm interested in your product: ${productTitle}`
          }
        ]);

      if (error) throw error;
      toast.success('Message sent to seller!');
    } catch (error) {
      console.error('Error contacting seller:', error);
      toast.error('Failed to send message');
    }
  };

  const handleAddToFavorites = async (productId: string) => {
    if (!user) {
      toast.error('Please sign in to add favorites');
      return;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert([
          {
            user_id: user.id,
            product_id: productId
          }
        ]);

      if (error) throw error;
      toast.success('Added to favorites!');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      if (error.code === '23505') {
        toast.error('Already in favorites');
      } else {
        toast.error('Failed to add to favorites');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Discover Amazing Products
            </h1>
            <p className="text-gray-600 text-lg">
              Find, rent, and buy pre-loved items in your area
            </p>
          </div>

          <BrowseFilters
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            filterType={filterType}
            priceRange={priceRange}
            categories={categories}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            onSortChange={setSortBy}
            onFilterTypeChange={setFilterType}
            onPriceRangeChange={setPriceRange}
          />

          <ProductsGrid
            products={filteredProducts}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onContactSeller={handleContactSeller}
            onAddToFavorites={handleAddToFavorites}
            onRefresh={refetchProducts}
          />
        </div>
      </div>
    </div>
  );
};

export default Browse;
