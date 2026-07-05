export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: 'Hoodies' | 'Tees' | 'Outerwear' | 'Accessories';
  stock_quantity: number;
  sizes: ('S' | 'M' | 'L' | 'XL')[];
  details: string[];
}

export interface CartItem {
  product: Product;
  selectedSize: 'S' | 'M' | 'L' | 'XL';
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: {
    productName: string;
    price: number;
    size: string;
    quantity: number;
  }[];
  total: number;
  email: string;
  phone: string;
  shippingAddress: {
    fullName: string;
    addressLine: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface Analytics {
  totalRevenue: number;
  totalSales: number;
  categorySales: Record<string, number>;
}
