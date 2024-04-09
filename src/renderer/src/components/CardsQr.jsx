/* eslint-disable react/prop-types */
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import logo from '../assets/images/logo.png'
import qrcode from '../assets/qrcodes/qrcode-blanc.png'
import Card1 from './Card1'

// Composant pour afficher les cartes
const CardsQr = () => {
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
      imageSrc: qrcode,
      name: 'Ma procuration',
      text: 'Je souhaite déposer une demande de procuration.'
    },
    {
      id: 2,
      href: 'https://www.service-public.fr/particuliers/vosdroits/R43241',
      imageSrc: qrcode,
      name: 'Opération tranquillité vacances',
      text: 'Je souhaite signaler mon absence pour des patrouilles de surveillance.'
    },
    {
      id: 3,
      href: 'https://www.masecurite.interieur.gouv.fr/fr/m-orienter',
      imageSrc: qrcode,
      name: "Je m'informe",
      text: 'Je souhaite obtenir des informations sur la sécurité.'
    },
    {
      id: 4,
      href: 'https://www.masecurite.interieur.gouv.fr/fr',
      imageSrc: qrcode,
      name: 'Ma sécurité',
      text: 'Je souhaite signaler un problème de sécurité.'
    },
    {
      id: 5,
      href: 'https://www.service-public.fr/particuliers/vosdroits/N31138',
      imageSrc: qrcode,
      name: 'Plainte pour escroqueries',
      text: "Je souhaite porter plainte pour escroqueries ou fraudes à l'adresse."
    }
  ]

  return (
    <div className="bg-gradient-to-r from-[#8acff0] to-[#000091] min-h-screen flex flex-col justify-center px-20">
      {isViewOpen && (
        <div className="flex justify-between absolute top-0 left-0 right-0 mx-10 py-4">
          <div className="flex gap-7">
            <button onClick={handleBackClick} className="bg-white rounded-full px-2 py-3">
              <ChevronLeft size={20} />
            </button>
            <button onClick={handleForwardClick} className="bg-white rounded-full px-2 py-3">
              <ChevronRight size={20} />
            </button>
          </div>
          <button onClick={handleCloseViewClick} className="bg-white p-3">
            Retourner à l&apos;accueil
          </button>
        </div>
      )}
      <div className="flex w-full justify-center bg-fixed bg-center">
        <div className="px-10">
          <div className="grid grid-cols-3 gap-y-5 gap-x-5">
            <div className="flex items-center justify-center rounded-lg">
              <img src={logo} alt="Logo" className="h-full w-full object-contain" />
            </div>
            {sites.map((site) => (
              <Card1 key={site.id} site={site} onClick={handleButtonClick} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardsQr
