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

function App() {
  const navigate = useNavigate()
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
      <Route path="/users" element={<Users/>} />
      <Route path="/dispatches" element={<Dispatches/>} />
    </Routes>
    </div>
  )
}

export default App
