import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#3B9FD8]">
      {/* Border overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <Image src="/images/border.png" alt="LEGO border" fill className="object-cover" />
      </div>

      {/* Main content */}
      <div className="relative z-0 min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 py-8 sm:py-16">
        {/* Logo */}
        <div className="mb-6 sm:mb-12 w-full max-w-2xl px-4">
          <Image
            src="/images/title-home.png"
            alt="Let's Go! A Family Easter Adventure"
            width={1200}
            height={600}
            className="w-full"
            priority
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 w-full max-w-md px-4">
          {[1, 2, 3].map((day) => (
            <Link
              key={day}
              href={day === 3 ? "/day-3" : "#"}
              className={`
                relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all transform active:scale-95 sm:hover:scale-105 touch-manipulation
                ${
                  day === 3
                    ? "bg-[#4CAF50] text-white shadow-lg hover:bg-[#45a049] cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                }
              `}
            >
              <span className="drop-shadow-md">Day {day}</span>
              {day === 3 && (
                <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-yellow-400 text-yellow-900 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold animate-pulse">
                  NEW!
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Subtitle */}
        <p className="text-white text-center text-sm sm:text-lg font-medium max-w-md px-4 drop-shadow-md">
          Join us on a journey through the Easter story! Find hidden objects to unlock each part of the adventure.
        </p>
      </div>
    </div>
  )
}
