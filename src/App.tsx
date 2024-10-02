import { Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import { useEffect } from 'react'
import supabase from './utils/supabase'
import Navbar from './utils/Navbar'

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
    <>
    <Routes>
      {/* <Route path="/" element={<Login />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/stock" element={<Stock />} />
      <Route path="/users" element={<Users />} />
      <Route path="/dispatches" element={<Dispatches />} /> */}
    </Routes>
      <Navbar/>
    </>
  )
}

export default App
