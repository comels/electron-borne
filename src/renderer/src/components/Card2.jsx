/* eslint-disable react/prop-types */
const Card2 = ({ site, onClick }) => {
  return (
    <button
      onClick={() => onClick(site.href)}
      className="flex flex-col justify-between items-center p-5 max-w-xs rounded-lg bg-white bg-opacity-60 shadow-lg"
    >
      <img src={site.imageSrc} alt={site.name} className="rounded-lg h-1/2" />
      <div className="flex flex-grow items-center justify-center">
        <h1 className="bg-[#000091] px-5 py-2 text-center text-base text-white hover:bg-[#1212FF] lg:text-lg">
          {site.name}
        </h1>
      </div>
    </button>
  )
}

export default Card2
