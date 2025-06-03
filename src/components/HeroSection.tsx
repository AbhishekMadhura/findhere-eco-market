
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-16 px-4 bg-gradient-to-br from-white via-green-50 to-emerald-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <Badge className="eco-badge mb-6 text-base px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            🌍 Join the Reuse Revolution
          </Badge>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Find amazing
            <span className="gradient-text block">pre-loved items</span>
            near you
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover, buy, sell, and rent sustainable products in your community. 
            Make sustainability <span className="font-semibold text-green-600">effortless</span>, 
            <span className="font-semibold text-emerald-600"> impactful</span>, and 
            <span className="font-semibold text-teal-600"> fun</span>! 🎯
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-3 p-2 bg-white rounded-2xl shadow-lg border border-green-100">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input 
                  placeholder="What are you looking for? (e.g., laptop, furniture, books)"
                  className="pl-12 h-12 border-none text-lg focus:ring-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="lg" className="flex items-center space-x-2 h-12">
                  <MapPin className="w-4 h-4" />
                  <span>Near me</span>
                </Button>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 px-8"
                  onClick={() => navigate('/browse')}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg px-8 py-6 h-auto animate-pulse-green"
              onClick={() => navigate('/browse')}
            >
              🛍️ Start Shopping
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-green-300 text-green-700 hover:bg-green-50 text-lg px-8 py-6 h-auto"
              onClick={() => navigate('/add-product')}
            >
              💰 Sell Your Items
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>45,000+ happy users</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>120kg CO₂ saved today</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
              <span>1000+ items listed daily</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
