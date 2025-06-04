
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, MapPin, Star } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onContactSeller: (productId: string, sellerId: string, productTitle: string) => void;
  onAddToFavorites: (productId: string) => void;
  onProductClick: (product: Product) => void;
}

const ProductCard = ({ product, viewMode, onContactSeller, onAddToFavorites, onProductClick }: ProductCardProps) => {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 border-0 rounded-2xl overflow-hidden bg-white cursor-pointer"
          onClick={() => onProductClick(product)}>
      <div className="relative overflow-hidden">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'}
          alt={product.title}
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            viewMode === 'grid' ? 'h-48' : 'h-32'
          }`}
        />
        <div className="absolute top-3 left-3">
          <Badge className={
            product.listing_type === 'rent' ? 'bg-blue-500 hover:bg-blue-600' :
            product.is_free ? 'bg-green-500 hover:bg-green-600' :
            'bg-orange-500 hover:bg-orange-600'
          }>
            {product.is_free ? 'Free' : product.listing_type}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Button
            size="sm"
            variant="outline"
            className="bg-white/90 hover:bg-white border-0 shadow-md h-9 w-9 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onAddToFavorites(product.id);
            }}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-2xl font-bold text-orange-600 mb-3">
          {product.is_free ? 'Free' : `₹${product.price.toLocaleString()}`}
        </p>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{product.location || 'Location not specified'}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-xs border-gray-200">
            {product.condition}
          </Badge>
          <div className="flex items-center text-xs text-gray-500">
            <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
            <span>
              {product.profiles?.first_name} {product.profiles?.last_name}
            </span>
          </div>
        </div>

        <Button 
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl"
          onClick={(e) => {
            e.stopPropagation();
            onContactSeller(product.id, product.user_id, product.title);
          }}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Contact Seller
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
