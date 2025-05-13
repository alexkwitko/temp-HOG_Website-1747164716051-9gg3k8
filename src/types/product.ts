export interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  featured: boolean;
  inStock: boolean;
  variants?: {
    color?: string;
    size?: string;
  }[];
}