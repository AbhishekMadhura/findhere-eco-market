
export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  is_free: boolean;
  listing_type: string;
  location: string;
  images: string[];
  condition: string;
  user_id: string;
  category_id: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
  } | null;
}

export interface Category {
  id: string;
  name: string;
}
