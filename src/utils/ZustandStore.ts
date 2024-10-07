import { create } from 'zustand';
import supabase from './supabase';

// Define interfaces para el estado y las funciones del store
interface User {
id: string;
createdAt: string;
full_name: string;
identification: string;
role: string;
}

interface Product {
  id: string;
  createdAt: string;
  product_name: string;
  product_measurement: string;
  quantity: number;
  photo: string;
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  contractor: string;
  dispatcher: string;
  responsible: string;
  products: Product[];
}

interface UserStoreState {
  isAdmin: boolean;
  products: Product[];
  orders: Order[];
  users: User[];
  fetchProducts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchAdmin: () => void;
}

const userStore = create<UserStoreState>((set) => ({
  isAdmin: false,
  products: [],
  orders: [],
  users: [],


  fetchProducts: async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error("Error fetching productos:", error);
    } else {
      set({ products: data });
    }
  },

  fetchOrders: async () => {
    const { data, error } = await supabase.from('orders').select('*');
    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      set({ orders: data });
    }
  },

  fetchUsers: async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error("Error fetching users:", error);
    } else {
      set({ users: data });
    }
  },

  fetchAdmin: () => {
    set({ isAdmin: true });
  }
}));

export default userStore;