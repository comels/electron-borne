import { useEffect, useState } from 'react'
import photo1 from '../assets/images/photo-1.png'
import photo10 from '../assets/images/photo-10.png'
import photo11 from '../assets/images/photo-11.png'
import photo12 from '../assets/images/photo-12.png'
import photo13 from '../assets/images/photo-13.png'
import photo14 from '../assets/images/photo-14.png'
import photo15 from '../assets/images/photo-15.png'
import photo16 from '../assets/images/photo-16.png'
import photo17 from '../assets/images/photo-17.png'
import photo18 from '../assets/images/photo-18.png'
import photo2 from '../assets/images/photo-2.png'
import photo4 from '../assets/images/photo-4.png'
import photo5 from '../assets/images/photo-5.png'
import photo7 from '../assets/images/photo-7.png'
import photo8 from '../assets/images/photo-8.png'
import photo9 from '../assets/images/photo-9.png'

// Componant qui affiche un carrousel d'images en plein écran, sans boutons de navigation, avec un défilement automatique des images.
const Carrousel = () => {
  const images = [
    photo1,
    photo2,
    photo4,
    photo5,
    photo7,
    photo8,
    photo9,
    photo10,
    photo11,
    photo12,
    photo13,
    photo14,
    photo15,
    photo16,
    photo17,
    photo18
  ]
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    // Fonction pour passer à l'image suivante
    const nextSlide = () => {
      setCurrentSlide((prevSlide) => (prevSlide === images.length - 1 ? 0 : prevSlide + 1))
    }

    // Définir un intervalle pour changer l'image toutes les 5 secondes
    const slideInterval = setInterval(nextSlide, 5000)

    return () => clearInterval(slideInterval)
  }, [currentSlide, images.length])

  return (
    <div className="relative w-screen h-screen gradient-background ">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute w-full h-full flex justify-center items-center ${index === currentSlide ? 'block' : 'hidden'}`}
        >
          <img src={image} className="object-cover w-full h-full" alt={`Slide ${index + 1}`} />
        </div>
      ))}
    </div>
  )
}

export default Carrousel
