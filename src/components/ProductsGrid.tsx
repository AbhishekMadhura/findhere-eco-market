
import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

interface ProductsGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onContactSeller: (productId: string, sellerId: string, productTitle: string) => void;
  onAddToFavorites: (productId: string) => void;
  onRefresh: () => void;
  onProductClick: (product: Product) => void;
}

const ProductsGrid = ({ 
  products, 
  viewMode, 
  onViewModeChange, 
  onContactSeller, 
  onAddToFavorites, 
  onRefresh,
  onProductClick
}: ProductsGridProps) => {
  return (
    <>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <p className="text-gray-600 font-medium">
            <span className="text-orange-600 font-bold">{products.length}</span> products found
          </p>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="h-9"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="h-9"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Button variant="outline" onClick={onRefresh} className="h-9">
          Refresh
        </Button>
      </div>

      {/* Products Grid */}
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
      }>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode={viewMode}
            onContactSeller={onContactSeller}
            onAddToFavorites={onAddToFavorites}
            onProductClick={onProductClick}
          />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16">
          <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Grid className="w-12 h-12 text-orange-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      )}
    </>
  );
};

export default ProductsGrid;
