import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Eye, MessageCircle, Heart, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Product {
  id: string;
  title: string;
  price: number;
  is_free: boolean;
  listing_type: string;
  location: string;
  images: string[];
  condition: string;
  status: string;
  views: number;
  created_at: string;
}

interface Inquiry {
  id: string;
  message: string;
  created_at: string;
  products: {
    title: string;
  } | null;
  profiles: {
    first_name: string;
    last_name: string;
  } | null;
}

interface Favorite {
  id: string;
  created_at: string;
  products: {
    title: string;
    price: number;
    is_free: boolean;
    images: string[];
    listing_type: string;
  } | null;
}

const MyProducts = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (user) {
      fetchMyData();
    }
  }, [user, loading, navigate]);

  const fetchMyData = async () => {
    try {
      // Fetch user's products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Fetch inquiries received - separate queries to avoid foreign key issues
      const { data: inquiriesData, error: inquiriesError } = await supabase
        .from('inquiries')
        .select('id, message, created_at, product_id, buyer_id')
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });

      if (inquiriesError) throw inquiriesError;

      // Fetch additional data for inquiries
      const inquiriesWithDetails = await Promise.all(
        (inquiriesData || []).map(async (inquiry) => {
          // Fetch product details
          const { data: productData } = await supabase
            .from('products')
            .select('title')
            .eq('id', inquiry.product_id)
            .single();

          // Fetch buyer profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', inquiry.buyer_id)
            .single();

          return {
            ...inquiry,
            products: productData,
            profiles: profileData
          };
        })
      );

      // Fetch user's favorites
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('id, created_at, product_id')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (favoritesError) throw favoritesError;

      // Fetch product details for favorites
      const favoritesWithDetails = await Promise.all(
        (favoritesData || []).map(async (favorite) => {
          const { data: productData } = await supabase
            .from('products')
            .select('title, price, is_free, images, listing_type')
            .eq('id', favorite.product_id)
            .single();

          return {
            ...favorite,
            products: productData
          };
        })
      );

      setProducts(productsData || []);
      setInquiries(inquiriesWithDetails || []);
      setFavorites(favoritesWithDetails || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load your data');
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleUpdateStatus = async (productId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.map(p => 
        p.id === productId ? { ...p, status: newStatus } : p
      ));
      toast.success(`Product marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setFavorites(favorites.filter(f => f.id !== favoriteId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
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
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                My Dashboard
              </h1>
              <p className="text-gray-600">Manage your listings and activity</p>
            </div>
            <Button onClick={() => navigate('/add-product')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products">My Products ({products.length})</TabsTrigger>
              <TabsTrigger value="inquiries">Inquiries ({inquiries.length})</TabsTrigger>
              <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <div className="space-y-6">
                {products.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No products yet</h3>
                      <p className="text-gray-500 mb-4">Start selling by adding your first product</p>
                      <Button onClick={() => navigate('/add-product')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Product
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <Card key={product.id}>
                        <div className="relative">
                          <img
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'}
                            alt={product.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge className={
                              product.status === 'active' ? 'bg-green-500' :
                              product.status === 'sold' ? 'bg-gray-500' :
                              'bg-blue-500'
                            }>
                              {product.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                          <p className="text-2xl font-bold text-green-600 mb-2">
                            {product.is_free ? 'Free' : `₹${product.price}`}
                          </p>
                          
                          <div className="flex items-center text-gray-500 text-sm mb-3">
                            <Eye className="w-4 h-4 mr-1" />
                            <span>{product.views} views</span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline">{product.listing_type}</Badge>
                            <Badge variant="outline">{product.condition}</Badge>
                          </div>

                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            {product.status === 'active' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleUpdateStatus(product.id, 'sold')}
                              >
                                Mark Sold
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="inquiries">
              <div className="space-y-4">
                {inquiries.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No inquiries yet</h3>
                      <p className="text-gray-500">Inquiries from interested buyers will appear here</p>
                    </CardContent>
                  </Card>
                ) : (
                  inquiries.map((inquiry) => (
                    <Card key={inquiry.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="text-lg">
                            {inquiry.profiles?.first_name} {inquiry.profiles?.last_name}
                          </span>
                          <Badge variant="outline">
                            {new Date(inquiry.created_at).toLocaleDateString()}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-2">
                          <strong>Product:</strong> {inquiry.products?.title}
                        </p>
                        <p className="text-gray-800">{inquiry.message}</p>
                        <div className="mt-4">
                          <Button size="sm">Reply</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="favorites">
              <div className="space-y-4">
                {favorites.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h3>
                      <p className="text-gray-500">Products you like will appear here</p>
                      <Button 
                        className="mt-4" 
                        onClick={() => navigate('/browse')}
                      >
                        Browse Products
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((favorite) => (
                      <Card key={favorite.id}>
                        <div className="relative">
                          <img
                            src={favorite.products?.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'}
                            alt={favorite.products?.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="absolute top-2 right-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemoveFavorite(favorite.id)}
                            >
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                            {favorite.products?.title}
                          </h3>
                          <p className="text-2xl font-bold text-green-600 mb-2">
                            {favorite.products?.is_free ? 'Free' : `₹${favorite.products?.price}`}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">
                              {favorite.products?.listing_type}
                            </Badge>
                            <Button size="sm">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Contact
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MyProducts;
