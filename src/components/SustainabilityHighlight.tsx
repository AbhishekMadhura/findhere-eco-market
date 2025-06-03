
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, Recycle, Globe, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SustainabilityHighlight = () => {
  const [co2Counter, setCo2Counter] = useState(0);
  const [itemsReused, setItemsReused] = useState(0);
  const navigate = useNavigate();

  // Animate counters on component mount
  useEffect(() => {
    const co2Target = 120;
    const itemsTarget = 1247;
    
    const co2Interval = setInterval(() => {
      setCo2Counter(prev => {
        if (prev >= co2Target) {
          clearInterval(co2Interval);
          return co2Target;
        }
        return prev + 2;
      });
    }, 50);

    const itemsInterval = setInterval(() => {
      setItemsReused(prev => {
        if (prev >= itemsTarget) {
          clearInterval(itemsInterval);
          return itemsTarget;
        }
        return prev + 25;
      });
    }, 30);

    return () => {
      clearInterval(co2Interval);
      clearInterval(itemsInterval);
    };
  }, []);

  const impactStats = [
    {
      icon: Leaf,
      value: `${co2Counter}kg`,
      label: 'CO₂ Saved Today',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Recycle,
      value: `${itemsReused}`,
      label: 'Items Reused',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Globe,
      value: '45k+',
      label: 'Eco Warriors',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: TrendingUp,
      value: '89%',
      label: 'Less Waste',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    }
  ];

  return (
    <div className="py-16 px-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto">
        {/* Main Highlight Card */}
        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-none shadow-2xl mb-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <CardContent className="p-8 md:p-12 relative z-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-4">
                  🌍 Sustainability Impact
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Together, we've saved
                </h2>
                <div className="text-6xl md:text-7xl font-black mb-2 animate-pulse">
                  {co2Counter}kg
                </div>
                <p className="text-xl text-green-100 mb-6">
                  of CO₂ emissions just today!
                </p>
                <Button 
                  size="lg" 
                  className="bg-white text-green-600 hover:bg-green-50 font-semibold"
                  onClick={() => navigate('/auth')}
                >
                  Join the Movement 🚀
                </Button>
              </div>
              
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center animate-pulse-green">
                    <div className="w-32 h-32 bg-white/30 rounded-full flex items-center justify-center">
                      <Globe className="w-16 h-16 text-white animate-float" />
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                    +2.5kg today!
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {impactStats.map((stat, index) => (
            <Card 
              key={stat.label}
              className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quote Section */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <div className="max-w-3xl mx-auto">
            <div className="text-4xl mb-4">🌱</div>
            <blockquote className="text-xl md:text-2xl font-medium text-gray-700 mb-4 italic">
              "FindHere isn't just a marketplace — it's a movement. Let's make reuse effortless, impactful, and even fun."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <Badge className="eco-badge">
                Every purchase makes a difference
              </Badge>
              <Badge className="eco-badge">
                Join 45,000+ eco warriors
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityHighlight;
