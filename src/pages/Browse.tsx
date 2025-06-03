
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, MapPin, Heart, Leaf } from 'lucide-react';

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const products = [
    {
      id: 1,
      title: "Vintage Wooden Bookshelf",
      price: "₹2,500",
      type: "Sell",
      location: "2.1 km away",
      co2Saved: "15kg",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      condition: "Good",
      category: "furniture"
    },
    {
      id: 2,
      title: "Gaming Laptop - RTX 3060",
      price: "₹800/day",
      type: "Rent",
      location: "1.5 km away",
      co2Saved: "25kg",
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop",
      condition: "Excellent",
      category: "electronics"
    },
    {
      id: 3,
      title: "Designer Office Chair",
      price: "₹4,200",
      type: "Sell",
      location: "800m away",
      co2Saved: "12kg",
      image: "https://images.unsplash.com/photo-1586540040850-49d8bf13b2a4?w=400&h=300&fit=crop",
      condition: "Like New",
      category: "furniture"
    }
  ];

  const categories = ['all', 'furniture', 'electronics', 'books', 'fashion'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              Browse Products
            </h1>
            <p className="text-gray-600 text-lg">
              Discover amazing pre-loved items in your community
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12"
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </Button>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
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
                    <Button size="icon" variant="ghost" className="bg-white/80 backdrop-blur-sm h-8 w-8">
                      <Heart className="h-4 w-4" />
                    </Button>
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
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-green-600">{product.price}</span>
                    <Badge variant="outline">{product.condition}</Badge>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{product.location}</span>
                  </div>
                  <Button className="w-full">View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
