"use client"

import Image from "next/image"
import Link from "next/link"
import { X, Gift } from "lucide-react"
import type { GoodyBagItem } from "@/lib/types"

const DEFAULT_INTRO =
  "Well done. You've heard the truth about what happened that first Easter. Here you will find a selection of different elements you could do together as a family at home to continue exploring The Easter Story. As a family you could choose one element or enjoy different elements throughout the week."

type GoodyBagModalProps = {
  open: boolean
  onClose: () => void
  items: GoodyBagItem[]
  introText?: string
  footerQuote?: string
  activeItem: string | null
  onActiveItemChange: (id: string | null) => void
}

export function GoodyBagModal({
  open,
  onClose,
  items,
  introText = DEFAULT_INTRO,
  footerQuote,
  activeItem,
  onActiveItemChange,
}: GoodyBagModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full active:bg-gray-100 sm:hover:bg-gray-100 transition-colors touch-manipulation"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="text-center mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
            <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#5D4037]">Well Done!</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base max-w-md mx-auto px-2">{introText}</p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {items.map((item) => {
            const IconComponent = item.icon
            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => onActiveItemChange(activeItem === item.id ? null : item.id)}
                  className={`
                    w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all touch-manipulation
                    ${
                      activeItem === item.id
                        ? "bg-[#4CAF50] text-white scale-105 shadow-lg"
                        : "bg-gray-100 text-gray-700 active:bg-gray-200 sm:hover:bg-gray-200"
                    }
                  `}
                >
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  <span className="text-[9px] sm:text-[10px] font-medium text-center px-0.5">{item.label}</span>
                </button>
              </div>
            )
          })}
        </div>

        {activeItem && (
          <div className="bg-[#FFF8E7] rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border-2 border-[#4CAF50]/20">
            {(() => {
              const item = items.find((i) => i.id === activeItem)
              if (!item) return null
              const IconComponent = item.icon
              return (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-[#4CAF50]" />
                    <h4 className="font-bold text-sm sm:text-base text-[#5D4037]">{item.label}</h4>
                  </div>
                  {item.embedVideo && (
                    <div className="mb-3 aspect-video w-full rounded-lg overflow-hidden">
                      <iframe
                        src={item.embedVideo}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  )}
                  {item.image && (
                    <div className="mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.label}
                        width={600}
                        height={400}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  )}
                  {!item.image && item.downloadUrl?.toLowerCase().endsWith(".pdf") && (
                    <div className="mb-3 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={`/api/preview-pdf?url=${encodeURIComponent(item.downloadUrl)}`}
                        alt={`Preview: ${item.label}`}
                        className="w-full h-auto object-contain max-h-64"
                      />
                    </div>
                  )}
                  <div className="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {item.content}
                  </div>
                  {item.download && item.downloadUrl && (
                    <a
                      href={item.downloadUrl}
                      download
                      className="mt-2 sm:mt-3 inline-block bg-[#4CAF50] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium active:bg-[#45a049] sm:hover:bg-[#45a049] transition-colors touch-manipulation"
                    >
                      {item.download}
                    </a>
                  )}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 sm:mt-3 inline-block bg-blue-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium active:bg-blue-600 sm:hover:bg-blue-600 transition-colors touch-manipulation"
                    >
                      {item.id === "listen" ? "Listen" : "Open Link"}
                    </a>
                  )}
                </>
              )
            })()}
          </div>
        )}

        {footerQuote && (
          <p className="text-center text-[#4CAF50] font-medium text-base sm:text-lg mb-3 sm:mb-4">{footerQuote}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-2.5 sm:py-3 rounded-xl font-bold active:bg-gray-300 sm:hover:bg-gray-300 transition-colors touch-manipulation text-sm sm:text-base"
          >
            Keep Exploring
          </button>
          <Link
            href="/"
            className="flex-1 bg-[#4CAF50] text-white py-2.5 sm:py-3 rounded-xl font-bold active:bg-[#45a049] sm:hover:bg-[#45a049] transition-colors text-center touch-manipulation text-sm sm:text-base"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
