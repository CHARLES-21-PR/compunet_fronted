import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Nav from './layouts/nav'
import Footer from './layouts/Footer'
import MainView from './views/MainView.jsx'
import CategoryView from './views/CategoryView.jsx'
import ProductDetailView from './views/ProductDetailView.jsx'
import CartView from './client/CartView.jsx'
import ClientOrders from './client/ClientOrders.jsx'
import LoginView from './views/LoginView.jsx'
import RegisterView from './views/RegisterView.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import AdminCategories from './admin/AdminCategories.jsx'
import AdminProducts from './admin/AdminProducts.jsx'
import AdminOrders from './admin/AdminOrders.jsx'
import AdminUsers from './admin/AdminUsers.jsx'
import CheckoutView from './views/CheckoutView.jsx'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <CartProvider>
        {!isAdminRoute && <Nav />}
        <Routes>
          <Route path="/" element={<MainView />} />
          <Route path="/category/:name" element={<CategoryView />} />
          <Route path="/product/:id" element={<ProductDetailView />} />
          <Route path="/cart" element={<CartView />} />
          <Route path="/client/orders" element={<ClientOrders />} />
          <Route path="/checkout" element={<CheckoutView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Routes>
        {!isAdminRoute && <Footer />}
      </CartProvider>
    </AuthProvider>
  )
}

export default App
