
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface BrowseFiltersProps {
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
  filterType: string;
  priceRange: string;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onFilterTypeChange: (value: string) => void;
  onPriceRangeChange: (value: string) => void;
}

const BrowseFilters = ({
  searchQuery,
  selectedCategory,
  sortBy,
  filterType,
  priceRange,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onFilterTypeChange,
  onPriceRangeChange
}: BrowseFiltersProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search for products, brands, or sellers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 h-12 border-gray-200 focus:border-orange-400 rounded-xl"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="h-12 border-gray-200 rounded-xl">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={onFilterTypeChange}>
          <SelectTrigger className="h-12 border-gray-200 rounded-xl">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sell">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
            <SelectItem value="exchange">Exchange</SelectItem>
            <SelectItem value="free">Free Items</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priceRange} onValueChange={onPriceRangeChange}>
          <SelectTrigger className="h-12 border-gray-200 rounded-xl">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="under-1000">Under ₹1,000</SelectItem>
            <SelectItem value="1000-5000">₹1,000 - ₹5,000</SelectItem>
            <SelectItem value="5000-25000">₹5,000 - ₹25,000</SelectItem>
            <SelectItem value="above-25000">Above ₹25,000</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="h-12 border-gray-200 rounded-xl">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BrowseFilters;
