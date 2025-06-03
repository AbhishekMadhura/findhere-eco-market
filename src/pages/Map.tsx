
import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation as NavIcon, Filter } from 'lucide-react';

const Map = () => {
  const nearbyProducts = [
    {
      id: 1,
      title: "Vintage Bookshelf",
      price: "₹2,500",
      distance: "0.8 km",
      type: "Sell",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop"
    },
    {
      id: 2,
      title: "Gaming Setup",
      price: "₹800/day",
      distance: "1.2 km",
      type: "Rent",
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=100&h=100&fit=crop"
    },
    {
      id: 3,
      title: "Office Chair",
      price: "₹3,200",
      distance: "1.8 km",
      type: "Sell",
      image: "https://images.unsplash.com/photo-1586540040850-49d8bf13b2a4?w=100&h=100&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 h-screen">
          {/* Map Area */}
          <div className="lg:col-span-2 relative bg-gradient-to-br from-green-100 to-emerald-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-800 mb-2">Interactive Map View</h3>
                <p className="text-green-600 mb-4">Map integration coming soon!</p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <NavIcon className="w-4 h-4 mr-2" />
                  Enable Location
                </Button>
              </div>
            </div>
            
            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button variant="outline" size="icon" className="bg-white shadow-lg">
                <Filter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-white shadow-lg">
                <NavIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="bg-white border-l overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Nearby Products</h2>
                <Badge className="eco-badge">
                  {nearbyProducts.length} items
                </Badge>
              </div>

              <div className="space-y-4">
                {nearbyProducts.map((product) => (
                  <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex space-x-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold">{product.title}</h3>
                            <Badge className={product.type === 'Rent' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}>
                              {product.type}
                            </Badge>
                          </div>
                          <p className="text-lg font-bold text-green-600 mt-1">{product.price}</p>
                          <div className="flex items-center text-gray-500 text-sm mt-2">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{product.distance} away</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">🌍 Eco Impact</h3>
                <p className="text-sm text-green-600">
                  By shopping locally, you're reducing transportation emissions and supporting your community!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
