/* eslint-disable react/prop-types */
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import informe from '../assets/images/informe.png'
import logo from '../assets/images/logo.png'
import otv from '../assets/images/otv.png'
import procuration from '../assets/images/procuration.png'
import securite from '../assets/images/securite.png'
import thesee from '../assets/images/thesee.png'

// Composant d'une carte individuelle
const Card = ({ site, onClick }) => (
  <button
    onClick={() => onClick(site.href)}
    className="flex flex-col justify-between items-center rounded-lg bg-white bg-opacity-60 shadow-lg"
  >
    <img src={site.imageSrc} alt={site.name} className="rounded-lg" />
    <div className="flex flex-grow items-center justify-center p-5">
      <h1 className="rounded-md bg-[#000091] px-5 py-2 text-center text-base text-white hover:bg-[#1212FF] lg:text-lg">
        {site.name}
      </h1>
    </div>
  </button>
)

// Composant pour afficher les cartes
const CardsImage = () => {
  const [isViewOpen, setIsViewOpen] = useState(false)

  useEffect(() => {
    const updateViewStatus = (status) => {
      setIsViewOpen(status)
    }

    window.electronAPI.on('update-view-status', updateViewStatus)

    return () => {
      window.electronAPI.removeListener('update-view-status', updateViewStatus)
    }
  }, [])

  const handleButtonClick = (url) => {
    window.electronAPI.openNewWindow(url)
  }

  const handleCloseViewClick = () => {
    window.electronAPI.closeCurrentView()
  }

  const handleBackClick = () => {
    window.electronAPI.navigateBack()
  }

  const handleForwardClick = () => {
    window.electronAPI.navigateForward()
  }

  // Sites à afficher
  const sites = [
    {
      id: 1,
      href: 'https://www.maprocuration.gouv.fr/',
      imageSrc: procuration,
      name: 'Ma procuration'
    },
    {
      id: 2,
      href: 'https://www.service-public.fr/particuliers/vosdroits/R43241',
      imageSrc: otv,
      name: 'Opération tranquillité vacances'
    },
    {
      id: 3,
      href: 'https://www.masecurite.interieur.gouv.fr/fr/m-orienter',
      imageSrc: informe,
      name: "Je m'informe"
    },
    {
      id: 4,
      href: 'https://www.masecurite.interieur.gouv.fr/fr',
      imageSrc: securite,
      name: 'Ma sécurité'
    },
    {
      id: 5,
      href: 'https://www.service-public.fr/particuliers/vosdroits/N31138',
      imageSrc: thesee,
      name: 'Plainte pour escroqueries'
    }
  ]

  return (
    <div className="bg-gradient-to-r from-[#8acff0] to-[#000091] min-h-screen flex flex-col justify-center">
      {isViewOpen && (
        <div className="flex justify-between absolute top-0 left-0 right-0 mx-10 py-5">
          <div className="flex gap-5">
            <button onClick={handleBackClick} className="bg-white rounded-full p-2">
              <ChevronLeft size={20} />
            </button>
            <button onClick={handleForwardClick} className="bg-white rounded-full p-2">
              <ChevronRight size={20} />
            </button>
          </div>
          <button onClick={handleCloseViewClick} className="bg-white rounded-full p-2">
            <X size={20} />
          </button>
        </div>
      )}
      <div className="flex w-full justify-center bg-fixed bg-center">
        <div className="px-10">
          <div className="grid grid-cols-3 gap-y-10 gap-x-10">
            <div className="flex items-center justify-center rounded-lg">
              <img src={logo} alt="Logo" className="h-full w-full object-contain" />
            </div>
            {sites.map((site) => (
              <Card key={site.id} site={site} onClick={handleButtonClick} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardsImage
