// Type definitions for the application

export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string;
  category_id: string;
  price: number;
  cost?: number;
  stock_quantity: number;
  low_stock_threshold?: number;
  weight_kg?: number;
  dimensions_cm?: string;
  image_url?: string;
  gallery_urls?: string[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total: number;
  shipping_address_id: string;
  billing_address_id: string;
  payment_method?: string;
  stripe_payment_intent_id?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Tutorial {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  category: string;
  difficulty_level: string;
  author_id?: string;
  created_at: Date;
  updated_at: Date;
}
