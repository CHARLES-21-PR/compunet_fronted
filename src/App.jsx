import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Nav from './layouts/nav'
import Footer from './layouts/Footer'
import MainView from './views/MainView.jsx'
import CategoryView from './views/CategoryView.jsx'
import LoginView from './views/LoginView.jsx'
import RegisterView from './views/RegisterView.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import AdminCategories from './admin/AdminCategories.jsx'
import AdminProducts from './admin/AdminProducts.jsx'
import { AuthProvider } from './context/AuthContext'

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      {!isAdminRoute && <Nav />}
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/category/:name" element={<CategoryView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/products" element={<AdminProducts />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </AuthProvider>
  )
}

export default App
