import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './assets/main.css'
import Carrousel from './components/Carrousel'
import Home from './pages/Home'

const App = () => {
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    // Fonctions pour gérer l'activité et l'inactivité
    const handleInactivity = () => setIsActive(false)

    // Définir un délai pour l'inactivité
    let timeout = setTimeout(handleInactivity, 300000) // 5 minutes

    // Ajouter des écouteurs pour divers événements d'activité
    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('mousedown', resetTimer)
    window.addEventListener('keypress', resetTimer)
    window.addEventListener('scroll', resetTimer)

    function resetTimer() {
      clearTimeout(timeout)
      setIsActive(true)
      timeout = setTimeout(handleInactivity, 300000) // Réinitialiser le timer à 5 minutes
    }

    // Nettoyer les écouteurs d'événements
    return () => {
      window.removeEventListener('mousemove', resetTimer)
      window.removeEventListener('mousedown', resetTimer)
      window.removeEventListener('keypress', resetTimer)
      window.removeEventListener('scroll', resetTimer)
    }
  }, [])

  return (
    <div>
      {isActive ? (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <Carrousel />
      )}
    </div>
  )
}
export default App
