/* eslint-disable react/prop-types */
import { ChevronLeft, ChevronRight, Power } from 'lucide-react'
import { createContext, useContext, useEffect, useState } from 'react'
import logo from '../assets/images/logo.png'
import qrcode from '../assets/qrcodes/qrcode-blanc.png'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import Card1 from './Card1'

const LanguageContext = createContext()

// Créez un fournisseur de contexte pour la langue sélectionnée
export const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('francais')

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Composant pour afficher les cartes
const CardsQr = () => {
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handlePasswordSubmit = (event) => {
    event.preventDefault()

    if (password === window.electronAPI.getPassword()) {
      window.electronAPI.quitApp()
    } else {
      setErrorMessage('Mot de passe incorrect.')
      setPassword('')

      // Efface le message d'erreur après 3 secondes
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

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
      hrefEnglish: 'https://www.maprocuration.gouv.fr/',
      imageSrc: qrcode,
      name: 'Ma procuration',
      englishName: 'My proxy',
      text: 'Je souhaite déposer une demande de procuration.',
      englishText: 'I want to submit a proxy request.'
    },
    {
      id: 2,
      href: 'https://www.service-public.fr/particuliers/vosdroits/R43241',
      hrefEnglish: 'https://www.service-public.fr/particuliers/vosdroits/R43241?lang=en',
      imageSrc: qrcode,
      name: 'Opération tranquillité vacances',
      englishName: 'Operation tranquility holidays',
      text: 'Je souhaite signaler mon absence pour des patrouilles de surveillance.',
      englishText: 'I want to report my absence for surveillance patrols.'
    },
    {
      id: 3,
      href: 'https://www.masecurite.interieur.gouv.fr/fr/m-orienter',
      hrefEnglish: 'https://www.masecurite.interieur.gouv.fr/en/guide-yourself',
      imageSrc: qrcode,
      name: "Je m'informe",
      englishName: 'I inform myself',
      text: 'Je souhaite obtenir des informations sur la sécurité.',
      englishText: 'I want to get information about security.'
    },
    {
      id: 4,
      href: 'https://www.masecurite.interieur.gouv.fr/fr',
      hrefEnglish: 'https://www.masecurite.interieur.gouv.fr/en',
      imageSrc: qrcode,
      name: 'Ma sécurité',
      englishName: 'My security',
      text: 'Je suis victime / Je signale / Je m’informe.',
      englishText: 'I am a victim / I report / I am informed.'
    },
    {
      id: 5,
      href: 'https://www.service-public.fr/particuliers/vosdroits/N31138',
      hrefEnglish: 'https://www.service-public.fr/particuliers/vosdroits/N31138?lang=en',
      imageSrc: qrcode,
      name: 'Plainte pour escroqueries',
      englishName: 'Complaint for fraud',
      text: "Je souhaite porter plainte pour escroqueries ou fraudes à l'adresse.",
      englishText: 'I want to report fraud or scams to the address.'
    }
  ]

  return (
    <div className="relative select-none bg-gradient-to-r from-[#8acff0] to-[#000091] min-h-screen flex flex-col justify-center px-20">
      {!isViewOpen && (
        <div className="flex absolute top-0 left-0 right-0 mx-10 py-4">
          <Select
            onValueChange={(value) => {
              setSelectedLanguage(value)
            }}
            defaultValue={selectedLanguage}
          >
            <SelectTrigger className="w-[80px] text-2xl">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem className="text-2xl" value="francais">
                  🇫🇷
                </SelectItem>
                <SelectItem className="text-2xl" value="english">
                  🇺🇸
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
      {isViewOpen && (
        <div className="flex justify-between absolute top-0 left-0 right-0 mx-10 py-4">
          <div className="flex gap-7">
            <Button onClick={handleBackClick} variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button onClick={handleForwardClick} variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleCloseViewClick} variant="outline">
            {selectedLanguage === 'francais' ? "Retourner à l'accueil" : 'Back to home'}
          </Button>
        </div>
      )}
      <div className="flex w-full justify-center bg-fixed bg-center">
        <div className="px-10">
          <div className="grid grid-cols-3 gap-y-10 gap-x-5">
            <div className="flex items-center justify-center rounded-lg">
              <img src={logo} alt="Logo" className="h-full w-full object-contain scale-100" />
            </div>
            {sites.map((site) => (
              <Card1
                key={site.id}
                site={site}
                onClick={handleButtonClick}
                language={selectedLanguage}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute right-10 bottom-10">
        <Dialog>
          <DialogTrigger asChild>
            <Power className="text-white cursor-pointer" size={20} />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-[#000091]">Action réservée aux agents</DialogTitle>
              <DialogDescription className=" text-xs">
                Passible de lourdes sanctions.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePasswordSubmit} className="grid gap-4 py-4">
              <div className="flex flex-col gap-4">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                {errorMessage && <div className="text-red-500 text-xs">{errorMessage}</div>}
              </div>
              <DialogFooter>
                <Button type="submit">Valider</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default CardsQr
