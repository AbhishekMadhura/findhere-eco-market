
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, MapPin, Calendar, Eye, Leaf } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onContactSeller: (productId: string, sellerId: string, productTitle: string) => void;
  onAddToFavorites: (productId: string) => void;
}

const ProductDetailModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onContactSeller, 
  onAddToFavorites 
}: ProductDetailModalProps) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop'}
                alt={product.title}
                className="w-full h-80 object-cover rounded-lg"
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
            </div>
            
            {/* Additional Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {product.images.slice(1, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} ${index + 2}`}
                    className="w-full h-20 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <p className="text-3xl font-bold text-orange-600 mb-2">
                {product.is_free ? 'Free' : `₹${product.price.toLocaleString()}`}
              </p>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{product.location || 'Location not specified'}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="text-sm">
                  {product.condition}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{new Date(product.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Seller Information</h3>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">
                    {product.profiles?.first_name?.[0] || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    {product.profiles?.first_name} {product.profiles?.last_name}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="w-3 h-3 mr-1" />
                    <span>Member since {new Date(product.created_at).getFullYear()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Leaf className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-green-800">Environmental Impact</h3>
              </div>
              <p className="text-sm text-green-700">
                By choosing this pre-loved item, you're helping reduce waste and carbon footprint!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                onClick={() => onContactSeller(product.id, product.user_id, product.title)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Seller
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onAddToFavorites(product.id)}
              >
                <Heart className="w-4 h-4 mr-2" />
                Add to Favorites
              </Button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-700 leading-relaxed">
            {product.description || 'No description provided for this item.'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
