
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, MessageCircle, MapPin, User, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Browse', href: '/browse', icon: Search },
    { name: 'Sell/Rent', href: '/add-product', icon: Plus },
    { name: 'My Products', href: '/my-products', icon: User },
    { name: 'Nearby', href: '/map', icon: MapPin },
    { name: 'AI Chat', href: '/chat', icon: MessageCircle },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              🧭
            </div>
            <span className="text-xl font-bold gradient-text">FindHere</span>
            <Badge className="eco-badge text-xs">Beta</Badge>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="flex items-center space-x-2 hover:bg-green-50 hover:text-green-700"
                onClick={() => console.log(`Navigate to ${item.href}`)}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white animate-pulse-green">
              Join the Revolution
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    🧭
                  </div>
                  <span className="text-xl font-bold gradient-text">FindHere</span>
                </div>
                
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className="justify-start space-x-3 h-12"
                    onClick={() => {
                      console.log(`Navigate to ${item.href}`);
                      setIsOpen(false);
                    }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-base">{item.name}</span>
                  </Button>
                ))}
                
                <div className="pt-4">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                    Join the Revolution
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
