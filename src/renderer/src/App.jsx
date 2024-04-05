import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'

import { useEffect } from 'react'
import './assets/main.css'
import Home from './pages/Home'

const App = () => {
  useEffect(() => {
    let inactivityTimer
    // Fonction pour réinitialiser le minuteur d'inactivité
    const resetInactivityTimer = () => {
      console.log("Activité détectée, réinitialisation du minuteur d'inactivité")
      clearTimeout(inactivityTimer)
      inactivityTimer = setTimeout(() => {
        window.electronAPI.closeViewDueToInactivity()
      }, 60000) // Réglez sur 60000 pour 1 minute
    }

    // Enregistrer les écouteurs
    window.addEventListener('mousemove', resetInactivityTimer)
    window.addEventListener('mousedown', resetInactivityTimer)
    window.addEventListener('keypress', resetInactivityTimer)
    window.addEventListener('touchmove', resetInactivityTimer)

    // Nettoyage (suppression des écouteurs) quand le composant se démonte
    return () => {
      window.removeEventListener('mousemove', resetInactivityTimer)
      window.removeEventListener('mousedown', resetInactivityTimer)
      window.removeEventListener('keypress', resetInactivityTimer)
      window.removeEventListener('touchmove', resetInactivityTimer)
    }
  }, [])
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
