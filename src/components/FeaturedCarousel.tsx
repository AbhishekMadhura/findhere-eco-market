
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedCarousel = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const navigate = useNavigate();

  const featuredProducts = [
    {
      id: 1,
      title: "Vintage Wooden Bookshelf",
      price: "₹2,500",
      type: "Sell",
      location: "2.1 km away",
      co2Saved: "15kg",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      condition: "Good",
      seller: "Priya Kumar"
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
      seller: "Tech Rentals Co."
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
      seller: "Office Solutions"
    },
    {
      id: 4,
      title: "Acoustic Guitar",
      price: "₹150/day",
      type: "Rent",
      location: "3.2 km away",
      co2Saved: "8kg",
      image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop",
      condition: "Good",
      seller: "Music Hub"
    }
  ];

  const handleProductClick = (productId: number) => {
    console.log(`View product ${productId}`);
    navigate('/browse');
  };

  const handleViewAllClick = () => {
    navigate('/browse');
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold gradient-text mb-4">
            🔥 Featured Near You
          </h2>
          <p className="text-gray-600 text-lg">
            Discover amazing pre-loved items in your neighborhood
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <Card
              key={product.id}
              className={`overflow-hidden transition-all duration-500 cursor-pointer ${
                hoveredCard === index
                  ? 'transform scale-105 shadow-2xl -translate-y-2 rotate-1'
                  : 'shadow-md hover:shadow-lg'
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge 
                    className={`${
                      product.type === 'Rent' 
                        ? 'bg-blue-100 text-blue-800 border-blue-200' 
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    {product.type}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-white/80 backdrop-blur-sm hover:bg-white/90 h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Add to favorites');
                    }}
                  >
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
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {product.title}
                </h3>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-green-600">
                    {product.price}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {product.condition}
                  </Badge>
                </div>

                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{product.location}</span>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  by {product.seller}
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick(product.id);
                  }}
                >
                  {product.type === 'Rent' ? 'Rent Now' : 'Buy Now'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            size="lg"
            className="border-green-200 text-green-700 hover:bg-green-50"
            onClick={handleViewAllClick}
          >
            View All Featured Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarousel;
