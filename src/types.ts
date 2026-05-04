export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'Writing' | 'Paper' | 'Desktop' | 'Art' | 'Organization';
  stockStatus: 'available' | 'out-of-stock';
  createdAt: any;
  updatedAt?: any;
}

export interface UserProfile {
  displayName: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: any;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: any;
}
