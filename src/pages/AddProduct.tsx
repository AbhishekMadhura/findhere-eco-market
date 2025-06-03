
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Camera, MapPin, Upload } from 'lucide-react';

const AddProduct = () => {
  const [listingType, setListingType] = useState('sell');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Product listing submitted:', { ...formData, listingType });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              List Your Item
            </h1>
            <p className="text-gray-600 text-lg">
              Give it a second life. Share it, rent it, love it again.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Listing Type */}
                <div>
                  <Label className="text-base font-semibold">Listing Type</Label>
                  <div className="flex gap-4 mt-2">
                    <Button
                      type="button"
                      variant={listingType === 'sell' ? 'default' : 'outline'}
                      onClick={() => setListingType('sell')}
                      className="flex-1"
                    >
                      💰 Sell
                    </Button>
                    <Button
                      type="button"
                      variant={listingType === 'rent' ? 'default' : 'outline'}
                      onClick={() => setListingType('rent')}
                      className="flex-1"
                    >
                      📅 Rent
                    </Button>
                  </div>
                </div>

                {/* Product Title */}
                <div>
                  <Label htmlFor="title">Product Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Vintage Wooden Bookshelf"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your item in detail..."
                    rows={4}
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <Label htmlFor="price">
                    Price {listingType === 'rent' ? '(per day)' : ''}
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder={listingType === 'rent' ? '₹500' : '₹2500'}
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="sports">Sports & Fitness</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Condition */}
                <div>
                  <Label>Condition</Label>
                  <RadioGroup
                    value={formData.condition}
                    onValueChange={(value) => setFormData({...formData, condition: value})}
                    className="flex flex-wrap gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="new" id="new" />
                      <Label htmlFor="new">Like New</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excellent" id="excellent" />
                      <Label htmlFor="excellent">Excellent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="good" id="good" />
                      <Label htmlFor="good">Good</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fair" id="fair" />
                      <Label htmlFor="fair">Fair</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Image Upload */}
                <div>
                  <Label>Images</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="Enter your location"
                      className="flex-1"
                      required
                    />
                    <Button type="button" variant="outline" size="icon">
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Sustainability Score */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-green-800">Sustainability Impact</h3>
                      <p className="text-sm text-green-600">This listing will save approximately 15kg of CO₂</p>
                    </div>
                    <Badge className="eco-badge">Eco-Friendly</Badge>
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 text-lg">
                  🚀 List My {listingType === 'sell' ? 'Product' : 'Rental'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
