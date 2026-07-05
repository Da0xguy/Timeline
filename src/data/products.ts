import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'TIMELINE OVERSIZED HOODIE',
    price: 35000,
    description: 'Cut from ultra-heavyweight 460gsm custom-knit French Terry cotton. Features an uncorded double-lined hood, seamless kangaroo pocket, and structural drop-shoulder profile designed for an architectural drape.',
    image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
    category: 'Hoodies',
    stock_quantity: 12,
    sizes: ['S', 'M', 'L', 'XL'],
    details: [
      '100% Organic French Terry Cotton',
      'Pre-shrunk and garment-dyed for a vintage matte finish',
      'Ribbed side panels for ease of motion',
      'Dry clean recommended or machine wash cold, lay flat to dry',
      'Made in Portugal'
    ]
  },
  {
    id: 'prod-2',
    name: 'ONYX ZIP-UP HOODIE',
    price: 40000,
    description: 'An elegant revision of the technical zip hoodie. Features a sleek, concealed steel dual-direction RiRi zipper, reinforced collar structure, and subtle brushed fleece lining for elevated cold-weather insulation.',
    image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    category: 'Hoodies',
    stock_quantity: 8,
    sizes: ['S', 'M', 'L'],
    details: [
      '80% Cotton, 20% Technical Poly Blend',
      'Custom gunmetal hardware with engraved branding',
      'Double-needle stitched seams',
      'Heavyweight 420gsm loopback knit',
      'Ethically produced in Japan'
    ]
  },
  {
    id: 'prod-3',
    name: 'ESSENTIAL GRAPHITE TEE',
    price: 15000,
    description: 'Our signature heavy tee. Engineered with a dense, tight-knit high collar that resists stretching, relaxed mid-length sleeves, and a clean straight hem. Sourced from high-grade extra-long staple combed cotton.',
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    category: 'Tees',
    stock_quantity: 25,
    sizes: ['S', 'M', 'L', 'XL'],
    details: [
      '100% Extra-Long Staple Combed Cotton',
      'Super-heavyweight 280gsm jersey fabric',
      'Shape-retaining 1.2-inch ribbed collar',
      'Garment washed with silicone softeners',
      'Crafted in the USA'
    ]
  },
  {
    id: 'prod-4',
    name: 'OBSIDIAN RAW-HEM TEE',
    price: 18000,
    description: 'A relaxed, elongated silhouette featuring a raw, subtly rolled edge on the sleeves and bottom hem. Hand-distressed along the collar with a washed graphite finish that gains unique character over time.',
    image_url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
    category: 'Tees',
    stock_quantity: 4,
    sizes: ['M', 'L', 'XL'],
    details: [
      '100% Supima Cotton',
      'Light-to-medium weight 180gsm jersey knit',
      'Distressed details and raw structural edges',
      'Preshrunk for a reliable fit',
      'Handcrafted in Los Angeles'
    ]
  },
  {
    id: 'prod-5',
    name: 'NOCTURNAL TECHNICAL JACKET',
    price: 65000,
    description: 'A modular, weatherproof companion. Tailored with a triple-layered seam-sealed ripstop fabric that blocks wind and water while allowing thermal regulation. Features custom adjustable cuffs and a packable hood.',
    image_url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80',
    category: 'Outerwear',
    stock_quantity: 6,
    sizes: ['S', 'M', 'L', 'XL'],
    details: [
      '3-Layer Technical Ripstop Nylon',
      'DWR (Durable Water Repellent) coating',
      'Waterproof AquaGuard zippers',
      'Laser-cut interior zipper pocket with headphone port',
      'Engineered in Germany'
    ]
  },
  {
    id: 'prod-6',
    name: 'ECLIPSE TAILORED WOOL COAT',
    price: 95000,
    description: 'A luxurious structured overcoat crafted from high-density virgin wool blend. Styled with clean minimalist notch lapels, a hidden button placket, and deep hand pockets. Tailored for a modern, architectural form.',
    image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    category: 'Outerwear',
    stock_quantity: 3,
    sizes: ['S', 'M', 'L'],
    details: [
      '80% Virgin Wool, 20% Cashmere blend',
      '100% Bemberg cupro silky lining',
      'Hidden genuine horn button closure',
      'Dual internal chest security pockets',
      'Dry clean only'
    ]
  },
  {
    id: 'prod-7',
    name: 'CARBON RIBBED MERINO BEANIE',
    price: 10000,
    description: 'A clean, four-seam crown beanie made with soft, moisture-wicking Australian Merino wool. Designed to provide natural warmth and temperature regulation with an adjustable folded cuff.',
    image_url: 'https://images.unsplash.com/photo-1576871337622-98d48d4353c0?auto=format&fit=crop&w=800&q=80',
    category: 'Accessories',
    stock_quantity: 15,
    sizes: ['S', 'M', 'L'],
    details: [
      '100% Superfine Merino Wool',
      'Ribbed stitch construction for shape retention',
      'Subtle tonal silicone badge inside fold',
      'Breathable, odor-resistant, and itch-free',
      'One size fits most'
    ]
  },
  {
    id: 'prod-8',
    name: 'MATTE LEATHER DUFFEL TOTE',
    price: 75000,
    description: 'Handcrafted from matte oil-tanned top grain cowhide leather that develops a magnificent rich patina. Features solid brass rivets, heavy-duty structural straps, and raw suede interior lining.',
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    category: 'Accessories',
    stock_quantity: 5,
    sizes: ['M', 'L'],
    details: [
      '100% Top Grain Oil-Tanned Leather',
      'Solid antiqued brass hardware',
      'Double-layered reinforced base',
      'Detachable adjustable heavy webbed shoulder strap',
      'Dimensions: 18" L x 10" W x 11" H'
    ]
  }
];
