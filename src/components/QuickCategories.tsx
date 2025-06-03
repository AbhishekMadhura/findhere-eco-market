
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sofa, Book, Laptop, Car, ShirtIcon, Camera, Music, Gamepad2 } from 'lucide-react';

const QuickCategories = () => {
  const categories = [
    { 
      name: 'Furniture', 
      icon: Sofa, 
      count: '1,247', 
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-amber-50'
    },
    { 
      name: 'Books', 
      icon: Book, 
      count: '892', 
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      name: 'Electronics', 
      icon: Laptop, 
      count: '2,156', 
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      name: 'Vehicles', 
      icon: Car, 
      count: '324', 
      color: 'from-red-400 to-red-600',
      bgColor: 'bg-red-50'
    },
    { 
      name: 'Fashion', 
      icon: ShirtIcon, 
      count: '758', 
      color: 'from-pink-400 to-pink-600',
      bgColor: 'bg-pink-50'
    },
    { 
      name: 'Photography', 
      icon: Camera, 
      count: '445', 
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      name: 'Music', 
      icon: Music, 
      count: '367', 
      color: 'from-indigo-400 to-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    { 
      name: 'Gaming', 
      icon: Gamepad2, 
      count: '612', 
      color: 'from-teal-400 to-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            🛒 Shop by Category
          </h2>
          <p className="text-gray-600 text-lg">
            Find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <Card 
              key={category.name}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-green-200 ${category.bgColor}`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fade-in 0.6s ease-out forwards'
              }}
              onClick={() => console.log(`Browse ${category.name}`)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mx-auto mb-3 animate-float`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="font-semibold text-sm mb-2 text-gray-800">
                  {category.name}
                </h3>
                
                <Badge variant="secondary" className="text-xs">
                  {category.count} items
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-3 rounded-full border border-green-200">
            <span className="text-green-700 font-medium">
              🎯 Can't find your category?
            </span>
            <span className="text-green-600 text-sm">
              Try our AI-powered search assistant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickCategories;
