import { Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import { useEffect } from 'react'
import supabase from './utils/supabase'
import Navbar from './utils/Navbar'
import Login from './components/login/Login'
import Orders from './components/orders/Orders'
import Stock from './components/stock/Stock'
import Users from './components/users/Users'
import Dispatches from './components/dispatches/Dispatches'

function App() {
  const navigate = useNavigate()

useEffect(() => {
supabase.auth.onAuthStateChange((session) => {
  if(!session) {
    navigate('/')
  }
}) 
}, [])

  return (
    <div className='h-full w-full'>
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/orders" element={<Orders/>} />
      <Route path="/stock" element={<Stock/>} />
      <Route path="/users" element={<Users/>} />
      <Route path="/dispatches" element={<Dispatches/>} />
    </Routes>
    <div className='h-full'>
      <Navbar/>
      </div>
    </div>
  )
}

export default App
