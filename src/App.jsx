import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Nav from './layouts/nav'
import Footer from './layouts/Footer'
import MainView from './views/MainView.jsx'
import CategoryView from './views/CategoryView.jsx'
import LoginView from './views/LoginView.jsx'
import RegisterView from './views/RegisterView.jsx'
import { AuthProvider } from './context/AuthContext'

function App() {
  

  return (
    <AuthProvider>
      <Nav />
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/category/:name" element={<CategoryView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}

export default App
