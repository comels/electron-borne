/* eslint-disable react/prop-types */
import { ArrowRight } from 'lucide-react'

const Card1 = ({ site, onClick, language }) => {
  return (
    <button
      onClick={() => onClick(language === 'francais' ? site.href : site.hrefEnglish)}
      className="h-full mx-auto"
    >
      <div className="bg-white bg-opacity-80 hover:bg-opacity-60 rounded-md w-full max-w-sm h-full flex flex-col p-2">
        <div className="bg-[#000091] flex-grow flex">
          <img src={site.imageSrc} alt={site.name} className="h-40 w-40 m-auto rounded-3xl p-2" />
        </div>
        <div className="p-3 flex flex-col justify-between flex-grow">
          <div>
            <h1 className="text-xl text-left font-semibold text-[#000091]">
              {language === 'francais' ? site.name : site.englishName}
            </h1>
            <p className="text-base text-left text-gray-600">
              {language === 'francais' ? site.text : site.englishText}
            </p>
          </div>
          <div className="flex justify-end">
            <ArrowRight className="text-[#000091] mx-2" />
          </div>
        </div>
      </div>
    </button>
  )
}

export default Card1
