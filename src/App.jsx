import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Nav from './layouts/nav'
import Footer from './layouts/Footer'
import MainView from './views/MainView.jsx'

function App() {
  

  return (
    <>
      
      <Nav />
      <MainView />
      <Footer />
      
    </>
  )
}

export default App
