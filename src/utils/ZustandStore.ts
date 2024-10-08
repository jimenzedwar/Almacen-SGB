import { create } from 'zustand';
import supabase from './supabase';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define interfaces para el estado y las funciones del store
export interface User {
  id: string;
  createdAt: string;
  full_name: string;
  identification: string;
  role: string;
}

export interface Product {
  id: string;
  createdAt: string;
  product_name: string;
  product_measurement: string;
  quantity: number;
  photo: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: string;
  contractor: string;
  dispatcher: string;
  responsible: string;
  products: Product[];
}

interface ActiveUser {
    sub: string;
    role: string;
    email: string | undefined;
    full_name: string;
    identification: string;
}

interface UserStoreState {
  isAdmin: boolean;
  products: Product[];
  orders: Order[];
  users: User[];
  activeUser: ActiveUser | null;
  fetchProducts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchAdmin: () => void;
  setActiveUser: (user: ActiveUser) => void;
}

const userStore = create<UserStoreState>()(
  persist(
    (set) => ({
      isAdmin: false,
      products: [],
      orders: [],
      users: [],
      activeUser: null,

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
      },

      setActiveUser: (user: ActiveUser) => {
        set({ activeUser: user });
      }
    }),
    {
      name: 'user-store', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);

export default userStore;