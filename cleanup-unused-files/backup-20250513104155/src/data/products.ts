import { ProductType } from '../types/product';

export const products: ProductType[] = [
  {
    id: 'gi-elite-black',
    name: 'Elite MBJJ Gi - Black',
    description: 'Our premium competition gi features a lightweight pearl weave fabric, reinforced seams, and an ergonomic cut for maximum mobility. Perfect for training and competition.',
    price: 149.99,
    images: [
      'https://images.pexels.com/photos/7045396/pexels-photo-7045396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/7045395/pexels-photo-7045395.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'Gi',
    featured: true,
    inStock: true,
    variants: [
      { size: 'A1' },
      { size: 'A2' },
      { size: 'A3' },
      { size: 'A4' }
    ]
  },
  {
    id: 'gi-elite-blue',
    name: 'Elite MBJJ Gi - Blue',
    description: 'Our premium competition gi features a lightweight pearl weave fabric, reinforced seams, and an ergonomic cut for maximum mobility. Perfect for training and competition.',
    price: 149.99,
    images: [
      'https://images.pexels.com/photos/8224760/pexels-photo-8224760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/8224761/pexels-photo-8224761.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'Gi',
    featured: false,
    inStock: true,
    variants: [
      { size: 'A1' },
      { size: 'A2' },
      { size: 'A3' },
      { size: 'A4' }
    ]
  },
  {
    id: 'rash-guard-compression',
    name: 'Elite MBJJ Compression Rash Guard',
    description: 'High-performance compression rash guard with moisture-wicking fabric. Features anti-bacterial treatment and flat-lock seams for comfort during intense training.',
    price: 49.99,
    images: [
      'https://images.pexels.com/photos/6295741/pexels-photo-6295741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/6295773/pexels-photo-6295773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'No-Gi',
    featured: true,
    inStock: true,
    variants: [
      { size: 'S' },
      { size: 'M' },
      { size: 'L' },
      { size: 'XL' }
    ]
  },
  {
    id: 'shorts-fight',
    name: 'Elite MBJJ Fight Shorts',
    description: 'Durable fight shorts with four-way stretch fabric and reinforced stitching. Designed for maximum mobility with a non-slip waistband and quick-dry technology.',
    price: 39.99,
    images: [
      'https://images.pexels.com/photos/6456207/pexels-photo-6456207.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'No-Gi',
    featured: false,
    inStock: true,
    variants: [
      { size: 'S' },
      { size: 'M' },
      { size: 'L' },
      { size: 'XL' }
    ]
  },
  {
    id: 'belt-black',
    name: 'Elite MBJJ Black Belt',
    description: 'Premium cotton blend black belt with embroidered Elite MBJJ logo. Features extra stiffening for a professional look that stays tied during training.',
    price: 29.99,
    images: [
      'https://images.pexels.com/photos/6765836/pexels-photo-6765836.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'Accessories',
    featured: false,
    inStock: true,
    variants: [
      { size: 'A1' },
      { size: 'A2' },
      { size: 'A3' },
      { size: 'A4' }
    ]
  },
  {
    id: 'mouth-guard',
    name: 'Elite MBJJ Mouth Guard',
    description: 'Professional-grade mouth guard with custom-fit technology. Includes antimicrobial case and breathing channels for maximum comfort and protection.',
    price: 19.99,
    images: [
      'https://images.pexels.com/photos/6395415/pexels-photo-6395415.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'Accessories',
    featured: false,
    inStock: true
  },
  {
    id: 'membership-monthly',
    name: 'Monthly Membership',
    description: 'Unlimited access to all classes including BJJ, No-Gi, and open mat sessions. Includes free gi rental for your first month.',
    price: 129.99,
    images: [
      'https://images.pexels.com/photos/8111981/pexels-photo-8111981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'Memberships',
    featured: true,
    inStock: true
  },
  {
    id: 'private-training',
    name: 'Private Training (5 Sessions)',
    description: 'Five one-hour private training sessions with an Elite MBJJ instructor. Personalized curriculum focused on your specific goals and areas for improvement.',
    price: 349.99,
    images: [
      'https://images.pexels.com/photos/7991131/pexels-photo-7991131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'Memberships',
    featured: false,
    inStock: true
  }
];