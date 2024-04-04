/* eslint-disable react/prop-types */
import informe from '../assets/images/informe.png'
import logo from '../assets/images/logo.png'
import otv from '../assets/images/otv.png'
import procuration from '../assets/images/procuration.png'
import securite from '../assets/images/securite.png'
import thesee from '../assets/images/thesee.png'

const Card = ({ product, click }) => (
  <button onClick={() => click(product.href)}>
    <div className="flex flex-col justify-between rounded-lg  bg-white p-2 shadow-lg">
      <img className="rounded-t-lg" src={product.imageSrc} alt="" />

      <div className="flex flex-grow items-center justify-center p-5">
        <h5 className="rounded-md bg-[#000091] px-4 py-2 text-center text-base text-white hover:bg-[#1212FF] lg:text-xl">
          {product.name}
        </h5>
      </div>
    </div>
  </button>
)

const Cards = () => {
  const handleButtonClick = (url) => {
    window.electronAPI.openNewWindow(url)
  }
  const handleCloseViewClick = () => {
    console.log('Tentative de fermeture de la vue')
    window.electronAPI.closeCurrentView() // Appelle la méthode pour fermer la vue
  }
  const handleBackClick = () => {
    window.electronAPI.navigateBack()
  }

  const handleForwardClick = () => {
    window.electronAPI.navigateForward()
  }
  const products = [
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
    <div
      className="gradient-background min-h-screen "
      // style={{
      //   backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url('/images/photo-14.png')`, // 1,4,5,7, 8, 12, 13, 14
      // }}
    >
      <div className="flex justify-between mx-10 py-5">
        <div className="flex gap-5">
          <button onClick={handleBackClick} className="bg-white rounded-full p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button onClick={handleForwardClick} className="bg-white rounded-full p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <button onClick={handleCloseViewClick} className=" bg-white rounded-full p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="flex w-full items-center mt-20 justify-center bg-fixed bg-center">
        <div className="mx-auto px-10">
          <div className="grid grid-cols-3 gap-y-10 gap-x-10">
            <div className="flex items-center justify-center rounded-lg">
              <img src={logo} alt="Logo" className="h-full w-full object-contain" />
            </div>
            {products.map((product) => (
              <Card
                key={product.id}
                product={product}
                click={() => handleButtonClick(product.href)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cards
