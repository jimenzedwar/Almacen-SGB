import { Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import { useEffect } from 'react'
import supabase from './utils/supabase'
import Navbar from './utils/Navbar'
import Login from './utils/Login'
import Orders from './components/orders/Orders'
import Stock from './components/stock/Stock'
import Users from './components/users/Users'
import Dispatches from './components/dispatches/Dispatches'
import userStore from './utils/ZustandStore'
import OrderDetail from './components/orders/OrderDetail'
import NewOrderForm from './components/orders/NewOrderForm'
import ProductDetail from './components/stock/ProductDetail'

function App() {
  const navigate = useNavigate()

  const subscribeToChanges = userStore(state => state.subscribeToChanges);

  useEffect(() => {
    const unsubscribe = subscribeToChanges;
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [subscribeToChanges]);
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/');
      }
    });
  }, [navigate]);

  const isActiveLogin = location.pathname === "/"
  return (
    <div className='h-full w-full flex'>
    <div className={`h-full ${isActiveLogin ? "hidden" :'block'}`}>
      <Navbar/>
      </div>
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/orders" element={<Orders/>} />
      <Route path="/stock" element={<Stock/>} />
      <Route path="/product/:id" element={<ProductDetail/>} />
      <Route path="/users" element={<Users/>} />
      <Route path="/dispatches" element={<Dispatches/>} />
      <Route path="/order/:id" element={<OrderDetail/>} />
      <Route path="/newOrder" element={<NewOrderForm/>} />
    </Routes>
    </div>
  )
}

export default App
