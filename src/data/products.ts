export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  inStock: boolean;
  featured?: boolean;
  size?: string[];
  color?: string[];
  attributes?: Record<string, string>;
  relatedProducts?: string[];
}

export const products: Product[] = [
  {
    id: 'hog-gi-white',
    name: 'HOG Competition Gi - White',
    price: 159.99,
    description: 'Official House of Grappling Competition Gi. Made with premium pearl weave cotton for durability and comfort. Features reinforced stitching at stress points and minimalist design.',
    category: 'Gi',
    images: [
      'https://images.unsplash.com/photo-1634733571357-847cb4759190?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    featured: true,
    size: ['A0', 'A1', 'A2', 'A3', 'A4'],
    color: ['White'],
    attributes: {
      material: 'Pearl Weave Cotton',
      weight: '450g/m²',
      collar: 'EVA Foam Core'
    }
  },
  {
    id: 'hog-gi-blue',
    name: 'HOG Competition Gi - Blue',
    price: 159.99,
    description: 'Official House of Grappling Competition Gi in IBJJF-legal blue. Made with premium pearl weave cotton for durability and comfort.',
    category: 'Gi',
    images: [
      'https://images.unsplash.com/photo-1577998474517-7eeeed4e448a?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    size: ['A0', 'A1', 'A2', 'A3', 'A4'],
    color: ['Blue'],
    attributes: {
      material: 'Pearl Weave Cotton',
      weight: '450g/m²',
      collar: 'EVA Foam Core'
    },
    relatedProducts: ['hog-gi-white', 'hog-belt']
  },
  {
    id: 'hog-rashguard-long',
    name: 'HOG Rashguard - Long Sleeve',
    price: 49.99,
    description: 'Performance rashguard featuring four-way stretch fabric, flatlock stitching to prevent chafing, and sublimated graphics that won\'t fade or peel.',
    category: 'Rashguards',
    images: [
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    featured: true,
    size: ['S', 'M', 'L', 'XL', '2XL'],
    color: ['Black/White', 'Blue/White'],
    attributes: {
      material: '85% Polyester, 15% Spandex',
      sleeveLength: 'Long Sleeve',
      compression: 'Medium'
    }
  },
  {
    id: 'hog-rashguard-short',
    name: 'HOG Rashguard - Short Sleeve',
    price: 44.99,
    description: 'Short sleeve performance rashguard with moisture-wicking fabric and anti-microbial treatment to prevent odors.',
    category: 'Rashguards',
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    size: ['S', 'M', 'L', 'XL', '2XL'],
    color: ['Black/White', 'Blue/White'],
    attributes: {
      material: '85% Polyester, 15% Spandex',
      sleeveLength: 'Short Sleeve',
      compression: 'Medium'
    },
    relatedProducts: ['hog-rashguard-long', 'hog-shorts']
  },
  {
    id: 'hog-shorts',
    name: 'HOG Training Shorts',
    price: 39.99,
    description: 'Durable training shorts with 4-way stretch fabric, reinforced stitching, and no-slip waistband with drawstring.',
    category: 'Shorts',
    images: [
      'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    featured: true,
    size: ['28', '30', '32', '34', '36', '38'],
    color: ['Black', 'Navy'],
    attributes: {
      material: 'Polyester/Spandex Blend',
      inseam: '7 inches',
      pockets: 'None'
    }
  },
  {
    id: 'hog-belt',
    name: 'HOG Premium BJJ Belt',
    price: 29.99,
    description: 'Premium cotton BJJ belt with extra stitching to prevent fraying and maintain shape through years of training.',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1565367268579-d7c4328110ba?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    size: ['A1', 'A2', 'A3', 'A4'],
    color: ['White', 'Blue', 'Purple', 'Brown', 'Black'],
    attributes: {
      material: 'Cotton',
      width: '1.75 inches',
      construction: '8 rows of stitching'
    }
  },
  {
    id: 'hog-mouthguard',
    name: 'HOG Mouthguard with Case',
    price: 19.99,
    description: 'Boil and bite mouthguard for perfect fit and maximum protection. Includes ventilated carrying case.',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1589057362471-b41033ec1c15?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    color: ['Black', 'Clear'],
    attributes: {
      material: 'Medical Grade Silicone',
      style: 'Boil and Bite',
      includes: 'Ventilated Case'
    }
  },
  {
    id: 'hog-bag',
    name: 'HOG Gear Bag',
    price: 79.99,
    description: 'Spacious gear bag with separate compartments for gi, rashguard, and wet items. Features antimicrobial lining and reinforced handles.',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1623625434462-e5e42318ae49?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    featured: true,
    color: ['Black'],
    attributes: {
      material: 'Cordura Nylon',
      capacity: '45L',
      dimensions: '24" x 12" x 12"'
    }
  }
]; 