import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/types/product';

export const useProductFilters = (products: Product[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filterType, setFilterType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    if (filterType !== 'all') {
      if (filterType === 'free') {
        filtered = filtered.filter(product => product.is_free);
      } else {
        filtered = filtered.filter(product => product.listing_type === filterType);
      }
    }

    if (priceRange !== 'all' && !filtered.some(p => p.is_free)) {
      switch (priceRange) {
        case 'under-1000':
          filtered = filtered.filter(product => product.price < 1000);
          break;
        case '1000-5000':
          filtered = filtered.filter(product => product.price >= 1000 && product.price <= 5000);
          break;
        case '5000-25000':
          filtered = filtered.filter(product => product.price >= 5000 && product.price <= 25000);
          break;
        case 'above-25000':
          filtered = filtered.filter(product => product.price > 25000);
          break;
      }
    }

    switch (sortBy) {
      case 'price-low':
        filtered = filtered.sort((a, b) => (a.is_free ? 0 : a.price) - (b.is_free ? 0 : b.price));
        break;
      case 'price-high':
        filtered = filtered.sort((a, b) => (b.is_free ? 0 : b.price) - (a.is_free ? 0 : a.price));
        break;
      case 'newest':
        filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered = filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy, filterType, priceRange]);

  return {
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
  };
};
