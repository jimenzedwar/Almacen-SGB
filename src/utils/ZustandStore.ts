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
  subscribeToChanges: () => void;
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
      },

      subscribeToChanges: () => {
        const productChannel = supabase
          .channel('products')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, payload => {
            set(state => {
              const updatedProducts = [...state.products];
              switch (payload.eventType) {
                case 'INSERT':
                  updatedProducts.push(payload.new as Product);
                  break;
                case 'UPDATE':
                  const index = updatedProducts.findIndex(p => p.id === payload.new.id);
                  if (index !== -1) {
                    updatedProducts[index] = payload.new as Product;
                  }
                  break;
                case 'DELETE':
                  return {
                    ...state,
                    products: updatedProducts.filter(p => p.id !== payload.old.id),
                  };
              }
              return { ...state, products: updatedProducts };
            });
          })
          .subscribe();

        const orderChannel = supabase
          .channel('orders')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
            set(state => {
              const updatedOrders = [...state.orders];
              switch (payload.eventType) {
                case 'INSERT':
                  updatedOrders.push(payload.new as Order);
                  break;
                case 'UPDATE':
                  const index = updatedOrders.findIndex(o => o.id === payload.new.id);
                  if (index !== -1) {
                    updatedOrders[index] = payload.new as Order;
                  }
                  break;
                case 'DELETE':
                  return {
                    ...state,
                    orders: updatedOrders.filter(o => o.id !== payload.old.id),
                  };
              }
              return { ...state, orders: updatedOrders };
            });
          })
          .subscribe();

        const userChannel = supabase
          .channel('users')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, payload => {
            set(state => {
              const updatedUsers = [...state.users];
              switch (payload.eventType) {
                case 'INSERT':
                  updatedUsers.push(payload.new as User);
                  break;
                case 'UPDATE':
                  const index = updatedUsers.findIndex(u => u.id === payload.new.id);
                  if (index !== -1) {
                    updatedUsers[index] = payload.new as User;
                  }
                  break;
                case 'DELETE':
                  return {
                    ...state,
                    users: updatedUsers.filter(u => u.id !== payload.old.id),
                  };
              }
              return { ...state, users: updatedUsers };
            });
          })
          .subscribe();

        return () => {
          supabase.removeChannel(productChannel);
          supabase.removeChannel(orderChannel);
          supabase.removeChannel(userChannel);
        };
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default userStore;