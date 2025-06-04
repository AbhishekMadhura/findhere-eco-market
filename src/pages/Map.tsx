
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation2, Filter, Search, Heart, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Product {
  id: string;
  title: string;
  price: number;
  is_free: boolean;
  listing_type: string;
  location: string;
  latitude: number;
  longitude: number;
  images: string[];
  condition: string;
  user_id: string;
  distance?: number;
}

const Map = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'sell' | 'rent' | 'exchange'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    getUserLocation();
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, filterType, products]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Delhi if geolocation fails
          setUserLocation({ lat: 28.6139, lng: 77.2090 });
        }
      );
    } else {
      // Default location if geolocation is not supported
      setUserLocation({ lat: 28.6139, lng: 77.2090 });
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          title,
          price,
          is_free,
          listing_type,
          location,
          latitude,
          longitude,
          images,
          condition,
          user_id
        `)
        .eq('status', 'active')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) throw error;

      const productsWithDistance = data?.map(product => ({
        ...product,
        distance: userLocation ? calculateDistance(
          userLocation.lat,
          userLocation.lng,
          product.latitude,
          product.longitude
        ) : 0
      })) || [];

      setProducts(productsWithDistance);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setIsLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(product => product.listing_type === filterType);
    }

    // Sort by distance
    filtered = filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    
    setFilteredProducts(filtered);
  };

  const handleContactSeller = async (productId: string, sellerId: string) => {
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
            message: `Hi! I'm interested in your product: ${selectedProduct?.title}`
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
      toast.error('Failed to add to favorites');
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 h-screen">
          {/* Map Area - Simple location display */}
          <div className="lg:col-span-2 relative bg-green-50 flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="w-24 h-24 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Local Products Map</h2>
              <p className="text-gray-600 mb-4">
                {userLocation 
                  ? `Showing products near ${userLocation.lat.toFixed(2)}, ${userLocation.lng.toFixed(2)}`
                  : 'Getting your location...'
                }
              </p>
              <Badge className="eco-badge">
                {filteredProducts.length} products nearby
              </Badge>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white shadow-lg"
                onClick={getUserLocation}
              >
                <Navigation2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white shadow-lg"
                onClick={fetchProducts}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* Selected Product Info */}
            {selectedProduct && (
              <div className="absolute bottom-4 left-4 right-4 lg:right-auto lg:w-80">
                <Card className="shadow-xl">
                  <CardContent className="p-4">
                    <div className="flex space-x-3">
                      <img
                        src={selectedProduct.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop'}
                        alt={selectedProduct.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{selectedProduct.title}</h3>
                        <p className="text-lg font-bold text-green-600">
                          {selectedProduct.is_free ? 'Free' : `₹${selectedProduct.price}`}
                        </p>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{selectedProduct.distance?.toFixed(1)} km away</span>
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleContactSeller(selectedProduct.id, selectedProduct.user_id)}
                          >
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Contact
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAddToFavorites(selectedProduct.id)}
                          >
                            <Heart className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Products Sidebar */}
          <div className="bg-white border-l overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Nearby Products</h2>
                <Badge className="eco-badge">
                  {filteredProducts.length} items
                </Badge>
              </div>

              {/* Search and Filters */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex space-x-2">
                  {['all', 'sell', 'rent', 'exchange'].map(type => (
                    <Button
                      key={type}
                      variant={filterType === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType(type as any)}
                      className="capitalize"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Products List */}
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedProduct?.id === product.id ? 'ring-2 ring-green-500' : ''
                    }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <CardContent className="p-4">
                      <div className="flex space-x-3">
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop'}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold line-clamp-1">{product.title}</h3>
                            <Badge className={
                              product.listing_type === 'rent' ? 'bg-blue-100 text-blue-800' :
                              product.is_free ? 'bg-green-100 text-green-800' :
                              'bg-amber-100 text-amber-800'
                            }>
                              {product.is_free ? 'Free' : product.listing_type}
                            </Badge>
                          </div>
                          <p className="text-lg font-bold text-green-600 mt-1">
                            {product.is_free ? 'Free' : `₹${product.price}`}
                          </p>
                          <div className="flex items-center text-gray-500 text-sm mt-2">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{product.distance?.toFixed(1)} km away</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No products found in this area</p>
                </div>
              )}

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">🌍 Eco Impact</h3>
                <p className="text-sm text-green-600">
                  By shopping locally, you're reducing transportation emissions and supporting your community!
                </p>
                <div className="mt-2 text-xs text-green-500">
                  Products within 5km radius shown for minimal carbon footprint
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
