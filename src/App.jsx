import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Nav from './layouts/nav'
import Footer from './layouts/Footer'
import MainView from './views/MainView.jsx'
import CategoryView from './views/CategoryView.jsx'

function App() {
  

  return (
    <>
      
      <Nav />
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/category/:name" element={<CategoryView />} />
      </Routes>
      <Footer />
      
    </>
  )
}

export default App
