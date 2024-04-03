/* eslint-disable react/prop-types */
import informe from '../assets/images/informe.png'
import logo from '../assets/images/logo.png'
import otv from '../assets/images/otv.png'
import procuration from '../assets/images/procuration.png'
import securite from '../assets/images/securite.png'
import thesee from '../assets/images/thesee.png'

const Card = ({ product }) => (
  <button>
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
      className="gradient-background flex min-h-screen w-full items-center justify-center bg-fixed bg-center py-10"
      // style={{
      //   backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url('/images/photo-14.png')`, // 1,4,5,7, 8, 12, 13, 14
      // }}
    >
      <div className="mx-auto px-10">
        <div className="grid grid-cols-3 gap-8">
          <div className="flex items-center justify-center rounded-lg">
            <img src={logo} alt="Logo" className="h-full w-full object-contain" />
          </div>
          {products.map((product) => (
            <Card key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Cards
