
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { MapPin, Upload, Image, Leaf, Navigation as NavIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  isFree: boolean;
  categoryId: string;
  condition: string;
  listingType: string;
  location: string;
  availableFrom?: string;
  availableTo?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

const AddProduct = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<string>('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ProductFormData>({
    defaultValues: {
      isFree: false,
      listingType: 'sell'
    }
  });

  const isFree = watch('isFree');
  const listingType = watch('listingType');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const detectLocation = async () => {
    setIsDetectingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Using a free reverse geocoding service
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (response.ok) {
            const data = await response.json();
            const location = `${data.locality}, ${data.principalSubdivision}, ${data.countryName}`;
            setDetectedLocation(location);
            setValue('location', location);
            toast.success('Location detected successfully!');
          } else {
            throw new Error('Failed to get location details');
          }
        } catch (error) {
          console.error('Error getting location details:', error);
          toast.error('Failed to get location details');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error('Error detecting location:', error);
        toast.error('Failed to detect location. Please enter manually.');
        setIsDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!user) {
      toast.error('Please sign in to add a product');
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        user_id: user.id,
        title: data.title,
        description: data.description,
        price: data.isFree ? null : data.price,
        is_free: data.isFree,
        category_id: data.categoryId || null,
        condition: data.condition,
        listing_type: data.listingType,
        location: data.location,
        available_from: data.availableFrom || null,
        available_to: data.availableTo || null,
        co2_saved: Math.floor(Math.random() * 50) + 10, // Random CO2 savings calculation
        status: 'active'
      };

      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) throw error;

      toast.success('Product added successfully!');
      navigate('/my-products');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              Add New Product
            </h1>
            <p className="text-gray-600 text-lg">
              Share your items with the community and help build a sustainable marketplace
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Leaf className="w-6 h-6 text-green-600" />
                <span>Product Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Product Title *</Label>
                      <Input
                        id="title"
                        {...register('title', { required: 'Title is required' })}
                        placeholder="Enter product title"
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        {...register('description')}
                        placeholder="Describe your product..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select onValueChange={(value) => setValue('categoryId', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="condition">Condition *</Label>
                      <Select onValueChange={(value) => setValue('condition', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.condition && (
                        <p className="text-red-500 text-sm mt-1">Condition is required</p>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Availability */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="listingType">Listing Type *</Label>
                      <Select onValueChange={(value) => setValue('listingType', value)} defaultValue="sell">
                        <SelectTrigger>
                          <SelectValue placeholder="Select listing type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sell">Sell</SelectItem>
                          <SelectItem value="rent">Rent</SelectItem>
                          <SelectItem value="exchange">Exchange</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isFree"
                          checked={isFree}
                          onCheckedChange={(checked) => setValue('isFree', checked)}
                        />
                        <Label htmlFor="isFree">This item is free</Label>
                        {isFree && <Badge className="eco-badge">Free Item! 🎉</Badge>}
                      </div>

                      {!isFree && (
                        <div>
                          <Label htmlFor="price">
                            Price (₹) {listingType === 'rent' && '/ day'} *
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            {...register('price', { 
                              required: !isFree ? 'Price is required' : false,
                              min: { value: 0, message: 'Price must be positive' }
                            })}
                            placeholder="Enter price"
                          />
                          {errors.price && (
                            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {listingType === 'rent' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="availableFrom">Available From</Label>
                          <Input
                            id="availableFrom"
                            type="date"
                            {...register('availableFrom')}
                          />
                        </div>
                        <div>
                          <Label htmlFor="availableTo">Available To</Label>
                          <Input
                            id="availableTo"
                            type="date"
                            {...register('availableTo')}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="location"
                          {...register('location', { required: 'Location is required' })}
                          placeholder="Enter your location"
                          value={detectedLocation}
                          onChange={(e) => setDetectedLocation(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={detectLocation}
                          disabled={isDetectingLocation}
                          className="flex items-center space-x-1"
                        >
                          <NavIcon className={`w-4 h-4 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                          <span className="hidden sm:inline">
                            {isDetectingLocation ? 'Detecting...' : 'Auto Detect'}
                          </span>
                        </Button>
                      </div>
                      {errors.location && (
                        <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Image className="w-6 h-6 text-gray-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Add Photos</h3>
                      <p className="text-gray-500">Upload photos of your product (coming soon)</p>
                    </div>
                    <Button type="button" variant="outline" disabled>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                </div>

                {/* Environmental Impact */}
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">Environmental Impact</h3>
                  </div>
                  <p className="text-green-700 text-sm">
                    By sharing this item, you're helping reduce waste and promote sustainable consumption. 
                    Every reused item contributes to a healthier planet! 🌍
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/my-products')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? 'Adding Product...' : 'Add Product'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
