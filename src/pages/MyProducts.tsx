
import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Edit, Trash2, MapPin, Leaf } from 'lucide-react';

const MyProducts = () => {
  const myListings = [
    {
      id: 1,
      title: "MacBook Pro 13-inch",
      price: "₹1,200/day",
      type: "Rent",
      status: "Active",
      views: 45,
      inquiries: 8,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
      co2Saved: "30kg"
    },
    {
      id: 2,
      title: "Vintage Leather Sofa",
      price: "₹15,000",
      type: "Sell",
      status: "Sold",
      views: 89,
      inquiries: 12,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
      co2Saved: "45kg"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              My Products
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your listings and track performance
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">8</div>
                <div className="text-sm text-gray-600">Active Listings</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">156</div>
                <div className="text-sm text-gray-600">Total Views</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">23</div>
                <div className="text-sm text-gray-600">Inquiries</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-emerald-600 mb-1">120kg</div>
                <div className="text-sm text-gray-600">CO₂ Saved</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="sold">Sold</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={product.type === 'Rent' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}>
                          {product.type}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className={product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {product.status}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <div className="eco-badge flex items-center space-x-1">
                          <Leaf className="w-3 h-3" />
                          <span className="text-xs">{product.co2Saved} CO₂</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                      <div className="text-2xl font-bold text-green-600 mb-3">{product.price}</div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{product.views} views</span>
                        </div>
                        <div>💬 {product.inquiries} inquiries</div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="active">
              <div className="text-center py-12">
                <p className="text-gray-500">Active listings will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="sold">
              <div className="text-center py-12">
                <p className="text-gray-500">Sold items will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="draft">
              <div className="text-center py-12">
                <p className="text-gray-500">Draft listings will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MyProducts;
