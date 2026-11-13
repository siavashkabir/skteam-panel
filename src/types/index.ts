export interface Shop {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  shop_image_url: string | null;
  is_active: number;
  created_at: string;
}

export interface Product {
  id: number;
  shop_id: number;
  title: string;
  description: string | null;
  weight: number;
  price: number | null;
  image_url: string | null;
  is_active: number;
  karat: number;
  created_at: string;
}

export interface ShopSettings {
  id: number;
  shop_id: number;
  about_us: string | null;
  address: string | null;
  phone: string | null;
  location_lat: number | null;
  location_lng: number | null;
  instagram_url: string | null;
  telegram_url: string | null;
  payment_gateway: string;
  payment_merchant_id: string | null;
  payment_api_key: string | null;
  payment_is_active: number;
  gold_profit_percent: number;
}

export interface User {
  id: number;
  shop_id: number | null;
  email: string;
  role: "super_admin" | "shop_admin";
  full_name: string | null;
  is_active: number;
}

export interface GoldPrice {
  ounce_usd: number;
  dollar_toman: number;
  gold_18_toman: number;
  gold_24_toman: number;
  updated_at: string;
}
