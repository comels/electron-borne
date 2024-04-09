/* eslint-disable react/prop-types */
const Card3 = ({ site, onClick }) => {
  return (
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
}

export default Card3
