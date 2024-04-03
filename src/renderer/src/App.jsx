import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'

import { useEffect } from 'react'
import './assets/main.css'
import Home from './pages/Home'

const App = () => {
  // Fonction pour remonter en haut de la page quand on change de route
  const ScrollToTop = () => {
    const { pathname } = useLocation()

    useEffect(() => {
      window.scrollTo(0, 0)
    }, [pathname])

    return null
  }

  return (
    <div>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App
