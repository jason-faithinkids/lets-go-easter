"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Home,
  X,
  HelpCircle,
  Gift,
  Lock,
  BookOpen,
  Lightbulb,
  Clapperboard,
  Blocks,
  Scissors,
  CookingPot,
  Ear,
  MessageCircle,
  Palette,
  Volume2,
} from "lucide-react"
import { GoodyBagModal } from "@/components/GoodyBagModal"
import type { SiteConfig } from "@/lib/config"

const DEFAULT_LISTEN_URL = "https://faithinkids.org"
const PLAIN_BACKGROUND_COLOR = "#E8DCC4"
const DEFAULT_DAY2_BACKGROUND = "/images/day%202.png"

// Default findable items (used when config has no overrides)
const DEFAULT_ITEMS = [
  // { id: 1, name: "Cross", image: "/images/item-201.png", position: { x: 25, y: 25 } },
  // { id: 2, name: "Nails", image: "/images/item-202.png", position: { x: 55, y: 45 } },
  // { id: 3, name: "Crown of Thorns", image: "/images/item-203.png", position: { x: 75, y: 20 } },
  // { id: 4, name: "Soldier", image: "/images/item-201.png", position: { x: 40, y: 65 } },
  // { id: 5, name: "Sign", image: "/images/item-202.png", position: { x: 60, y: 40 } },
]

// Story parts with Bible text (from Story text for Digital Family Easter.md - Matthew 27:35-43, 50-51, 54)
const STORY_PARTS = [
  {
    id: 1,
    title: "Part 1",
    verse: "Matthew 27:35-43",
    text: 'The soldiers nailed Jesus to a cross. They threw lots to decide who would get his clothes. The soldiers sat there and continued watching him. They put a sign above Jesus\' head with the charge against him written on it. The sign read: "THIS IS JESUS THE KING OF THE JEWS." Two robbers were nailed to crosses beside Jesus, one on the right and the other on the left.',
    audio: "/audio/Day 2 - p1.mp3",
  },
  {
    id: 2,
    title: "Part 2",
    verse: "Matthew 27:35-43",
    text: 'People walked by and insulted Jesus. They shook their heads, saying, "You said you could destroy the Temple and build it again in three days. So save yourself! Come down from that cross, if you are really the Son of God!"',
    audio: "/audio/Day 2 - p2.mp3",
  },
  {
    id: 3,
    title: "Part 3",
    verse: "Matthew 27:35-43",
    text: 'The leading priests, the teachers of the law, and the Jewish elders were also there. These men made fun of Jesus and said, "He saved other people, but he can\'t save himself! People say he is the King of Israel! If he is the King, then let him come down now from the cross. Then we will believe in him. He trusts in God. So let God save him now, if God really wants him. He himself said, \'I am the Son of God.\'"',
    audio: "/audio/Day 2 - p3.mp3",
  },
  {
    id: 4,
    title: "Part 4",
    verse: "Matthew 27:50-51",
    text: "Again Jesus cried out in a loud voice. Then he died. Then the curtain in the Temple split into two pieces. The tear started at the top and tore all the way down to the bottom. Also, the earth shook and rocks broke apart.",
    audio: "/audio/Day 2 - p4.mp3",
  },
  {
    id: 5,
    title: "Part 5",
    verse: "Matthew 27:54",
    text: 'The army officer and the soldiers guarding Jesus saw this earthquake and everything else that happened. They were very frightened and said, "He really was the Son of God!"',
    audio: "/audio/Day 2 - p5.mp3",
  },
]

// Goody bag activities for Day 2
const GOODY_BAG_ITEMS = [
  {
    id: "watch",
    icon: Clapperboard,
    label: "Watch",
    content: "Watch The Easter Story Lego video from 1 min 37 secs to 3 min 35 secs.",
    embedVideo: "https://www.youtube.com/embed/R2Fa52A-3kc?start=97&end=215&si=IkxmVHHvt4JnoAGg",
  },
  {
    id: "build",
    icon: Blocks,
    label: "Build",
    content: "Jesus was put to death on a cross. Can you make a cross out of Lego? How big can you make it?",
  },
  {
    id: "colour",
    icon: Palette,
    label: "Colour",
    content: "Colour in the picture of Jesus on the cross.",
    download: "Colouring Jesus' death.pdf",
    downloadUrl: "/images/colouring-jesus-resurrection.pdf",
    previewUrl: "/images/colouring-jesus-resurrection.jpg",
  },
  {
    id: "craft",
    icon: Scissors,
    label: "Craft",
    content:
      "Build a brick cross. You will need: a copy of the printout, scissors, glue and colouring pens. Colour in the bricks, then cut them out and stick them onto the cross.",
    download: "Build a brick cross.pdf",
    downloadUrl: "/images/build-a-brick-cross.pdf",
    previewUrl: "/images/build-a-brick-cross.jpg",
  },
  {
    id: "food",
    icon: CookingPot,
    label: "Food",
    content:
      "Make three crosses out of bread sticks. Stick each cross together with cream cheese. Stick the crosses into a tub of cream cheese so that they can stand up.",
    image: "/images/food-day2-placeholder.jpg",
  },
  {
    id: "listen",
    icon: Ear,
    label: "Listen",
    content: "Join Ed and Jam for this Faith in Kids for Kids family podcast to explore what happened the day Jesus died on the cross. The episode includes fun facts, an explanation of the Bible passage, questions to get everyone thinking, as well as music and a silly sketch.",
    link: DEFAULT_LISTEN_URL,
    image: "/images/podcast-cover-day2.jpg",
  },
  {
    id: "discuss",
    icon: MessageCircle,
    label: "Discuss",
    content: `Bible verse: "The army officer and the soldiers guarding Jesus saw this earthquake and everything else that happened. They were very frightened and said, 'He really was the Son of God!'" (Matthew 27:54)

Use the picture and the verse to answer the following questions:
• Who is in the picture?
• Jesus is God's promised king. Does he look like a king here? Why / why not?
• Why do you think the soldiers were frightened?

A prayer to pray: Dear God, thank you that the soldiers clearly saw that Jesus was the Son of God. Please help us to live trusting this. Amen.`,
    image: "/images/Jesus on the cross Image 1.jpeg",
  },
]

export default function Day2Page() {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [foundItems, setFoundItems] = useState<number[]>([])
  const [panPosition, setPanPosition] = useState({ x: 50, y: 50 })
  const [selectedStory, setSelectedStory] = useState<(typeof STORY_PARTS)[0] | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [showGoodyBag, setShowGoodyBag] = useState(false)
  const [hintItemId, setHintItemId] = useState<number | null>(null)
  const [activeGoodyItem, setActiveGoodyItem] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [newlyUnlockedPart, setNewlyUnlockedPart] = useState<number | null>(null)
  const [audioCountdown, setAudioCountdown] = useState<number>(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [audioDuration, setAudioDuration] = useState(30)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setConfig(null))
  }, [])

  const goodyBagItems = GOODY_BAG_ITEMS.map((item) =>
    item.id === "listen"
      ? { ...item, link: config?.listenUrlDay2 ?? DEFAULT_LISTEN_URL }
      : item
  )
  const backgroundImageUrl = config?.backgroundDay2
    ? config.backgroundDay2.startsWith("http")
      ? config.backgroundDay2
      : `/uploads/${config.backgroundDay2}`
    : DEFAULT_DAY2_BACKGROUND
  const items = (config?.itemsDay2 && config.itemsDay2.length > 0 ? config.itemsDay2 : DEFAULT_ITEMS) as typeof DEFAULT_ITEMS

  const unlockedParts = foundItems.length

  useEffect(() => {
    if (newlyUnlockedPart !== null && newlyUnlockedPart <= STORY_PARTS.length) {
      const timer = setTimeout(() => {
        setSelectedStory(STORY_PARTS[newlyUnlockedPart - 1])
        setNewlyUnlockedPart(null)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [newlyUnlockedPart])

  useEffect(() => {
    if (selectedStory && "audio" in selectedStory && selectedStory.audio) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      const audio = new Audio(selectedStory.audio)
      audioRef.current = audio
      const onLoaded = () => {
        const d = Math.ceil(audio.duration)
        setAudioDuration(d)
        setAudioCountdown(d)
      }
      const onPlay = () => setIsPlaying(true)
      const onPause = () => setIsPlaying(false)
      const onEnded = () => {
        setIsPlaying(false)
        setAudioCountdown(0)
      }
      const onTimeUpdate = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setAudioCountdown(Math.max(0, Math.ceil(audio.duration - audio.currentTime)))
        }
      }
      audio.addEventListener("loadedmetadata", onLoaded)
      audio.addEventListener("play", onPlay)
      audio.addEventListener("pause", onPause)
      audio.addEventListener("ended", onEnded)
      audio.addEventListener("timeupdate", onTimeUpdate)
      audio.load()
      audio.addEventListener("canplay", () => {
        audio.play().catch(() => {})
      })
      return () => {
        audio.removeEventListener("loadedmetadata", onLoaded)
        audio.removeEventListener("play", onPlay)
        audio.removeEventListener("pause", onPause)
        audio.removeEventListener("ended", onEnded)
        audio.removeEventListener("timeupdate", onTimeUpdate)
        audio.pause()
        audioRef.current = null
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setAudioCountdown(0)
      setIsPlaying(false)
      setAudioDuration(30)
    }
  }, [selectedStory])

  useEffect(() => {
    if (!selectedStory) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setAudioCountdown(0)
      setIsPlaying(false)
    }
  }, [selectedStory])

  const handleItemClick = useCallback(
    (itemId: number, e: React.MouseEvent) => {
      e.stopPropagation()
      if (!foundItems.includes(itemId)) {
        const newFoundItems = [...foundItems, itemId]
        setFoundItems(newFoundItems)
        setNewlyUnlockedPart(newFoundItems.length)
        if (hintItemId === itemId) {
          setHintItemId(null)
        }

        if (newFoundItems.length === items.length) {
          // Confetti and goody bag show after audio finishes (via "Take me to the goody bag!" in story modal)
        }
      }
    },
    [foundItems, hintItemId],
  )

  const handlePan = (direction: "left" | "right" | "up" | "down") => {
    setPanPosition((prev) => {
      switch (direction) {
        case "left":
          return { ...prev, x: Math.max(0, prev.x - 15) }
        case "right":
          return { ...prev, x: Math.min(100, prev.x + 15) }
        case "up":
          return { ...prev, y: Math.max(0, prev.y - 15) }
        case "down":
          return { ...prev, y: Math.min(100, prev.y + 15) }
        default:
          return prev
      }
    })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const dx = (dragStart.x - e.clientX) * 0.15
    const dy = (dragStart.y - e.clientY) * 0.15

    setPanPosition((prev) => ({
      x: Math.max(0, Math.min(100, prev.x + dx)),
      y: Math.max(0, Math.min(100, prev.y + dy)),
    }))

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    e.preventDefault()

    const touch = e.touches[0]
    const dx = (dragStart.x - touch.clientX) * 0.15
    const dy = (dragStart.y - touch.clientY) * 0.15

    setPanPosition((prev) => ({
      x: Math.max(0, Math.min(100, prev.x + dx)),
      y: Math.max(0, Math.min(100, prev.y + dy)),
    }))

    setDragStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleStoryClick = (partIndex: number) => {
    if (partIndex < unlockedParts) {
      setSelectedStory(STORY_PARTS[partIndex])
      setAudioCountdown(30)
    }
  }

  const handleHint = () => {
    const unfoundItems = items.filter((item) => !foundItems.includes(item.id))
    if (unfoundItems.length > 0) {
      const randomItem = unfoundItems[Math.floor(Math.random() * unfoundItems.length)]
      setHintItemId(randomItem.id)
      setTimeout(() => setHintItemId(null), 5000)
    }
  }

  const getHintDirection = () => {
    if (!hintItemId) return null
    const item = items.find((i) => i.id === hintItemId)
    if (!item) return null

    const dx = item.position.x - panPosition.x
    const dy = item.position.y - panPosition.y
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)
    return angle
  }

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isInventoryCollapsed, setIsInventoryCollapsed] = useState(false);

  const hintAngle = getHintDirection()

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-[#8B4513]">
      {/* Scene boundary: only the image area is visible; everything clipped to it */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <div
          ref={containerRef}
          className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="absolute w-[115%] h-[115%] transition-transform duration-100 ease-out"
            style={{
              transform: `translate(${-panPosition.x * 0.15}%, ${-panPosition.y * 0.15}%)`,
            }}
          >
            {backgroundImageUrl ? (
              <Image
                src={backgroundImageUrl}
                alt="Jesus on the Cross Scene"
                fill
                className="object-cover scale-110"
                priority
                draggable={false}
              />
            ) : (
              <div
                className="absolute inset-0 w-full h-full"
                style={{ backgroundColor: PLAIN_BACKGROUND_COLOR }}
              />
            )}

            {items.map((item) => (
            <button
              key={item.id}
              onClick={(e) => handleItemClick(item.id, e)}
              onTouchStart={(e) => {
                e.stopPropagation()
              }}
              className={`
                absolute transition-all duration-300 active:scale-125 sm:hover:scale-125 z-10 touch-manipulation
                ${foundItems.includes(item.id) ? "opacity-0 pointer-events-none scale-150" : "opacity-100 sm:hover:brightness-110"}
                ${hintItemId === item.id ? "animate-pulse scale-125" : ""}
              `}
              style={{
                left: `${item.position.x}%`,
                top: `${item.position.y}%`,
                transform: "translate(-50%, -50%)",
                filter:
                  hintItemId === item.id ? "drop-shadow(0 0 20px #FFD700) drop-shadow(0 0 40px #FFD700)" : undefined,
                minWidth: "48px",
                minHeight: "48px",
                padding: "8px",
              }}
              aria-label={`Find ${item.name}`}
            >
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={60}
                height={60}
                className="object-contain drop-shadow-lg pointer-events-none w-12 h-12 sm:w-14 sm:h-14 md:w-[60px] md:h-[60px]"
                draggable={false}
              />
            </button>
          ))}
          </div>
        </div>
        {/* Border overlay – inside scene boundary */}
        <div className="absolute inset-0 pointer-events-none">
          <Image src="/images/border.png" alt="LEGO border" fill className="object-cover" />
        </div>
      </div>

      {/* Day title */}
      <div className="absolute top-0 left-0 z-30 bg-white/90 px-2 sm:px-4 py-2 sm:py-3 rounded-br-xl shadow-lg z-90">
        <h1 className="text-xs sm:text-base font-bold text-[#5D4037]">Day 2: Jesus on the Cross</h1>
      </div>

      <Link
        href="/"
        className="absolute top-0 right-0 z-30 bg-white/90 px-2 sm:px-4 py-2 sm:py-3 rounded-bl-xl shadow-lg flex items-center gap-1 sm:gap-2 hover:bg-white transition-colors touch-manipulation"
      >
        <Home className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="font-medium text-xs sm:text-base hidden xs:inline">Home</span>
      </Link>

      <div className={`
        absolute top-8 sm:top-0 sm:left-1/2 sm:-translate-x-1/2 z-30 
        bg-white/95 rounded-b-2xl shadow-lg transition-all duration-500 ease-in-out
        ${isCollapsed ? '-translate-y-[90%] md:-translate-y-[80%]' : 'translate-y-0'}
        px-2 sm:px-4 md:px-8 pt-3 sm:pt-4 md:pt-5 pb-8 sm:pb-10 md:pb-12
        flex items-start gap-1 sm:gap-2 md:gap-4 overflow-x-auto max-w-[95vw] scrollbar-hide
      `}>
        {/* Wrap existing content in a div that fades out when collapsed */}
        <div className={`sm:flex items-start gap-1 sm:gap-2 md:gap-4 transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
          {STORY_PARTS.map((part, index) => (
            <div key={part.id} className="relative flex md:flex-col items-center flex-shrink-0 mb-6 md:mb-0">
              <button
                onClick={() => handleStoryClick(index)}
                disabled={index >= unlockedParts}
                className={`
                  px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 touch-manipulation
                  ${
                    index < unlockedParts
                      ? "bg-[#4CAF50] text-white active:bg-[#45a049] sm:hover:bg-[#45a049] cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                {index < unlockedParts ? (
                  <>
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                    <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </>
                ) : (
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <span className="whitespace-nowrap">{part.title}</span>
              </button>
              {index >= unlockedParts && (
                <div className="absolute -bottom-4 sm:-bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-red-500 text-white px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] whitespace-nowrap shadow-md">
                  <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="hidden sm:inline">LOCKED</span>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={() => foundItems.length === items.length && setShowGoodyBag(true)}
            className={`ml-1 sm:ml-2 p-2 sm:p-2.5 md:p-3 rounded-full transition-all touch-manipulation flex-shrink-0 ml-5 md:ml-0 ${
              foundItems.length === items.length
                ? "bg-red-500 active:bg-red-600 sm:hover:bg-red-600 cursor-pointer animate-bounce"
                : "bg-gray-200 cursor-not-allowed"
            }`}
          >
            <Gift className={`w-5 h-5 sm:w-6 sm:h-6 ${foundItems.length === items.length ? "text-white" : "text-gray-400"}`} />
          </button>
        </div>

        {/* The Toggle Tab - Always visible at the bottom of the container */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute w-full flex bottom-2 left-1/2 -translate-x-1/2 translate-y-[40%] bg-white/95 border-b border-x shadow-md rounded-b-xl px-4 py-1 items-center justify-center group transition-colors hover:bg-white"
        >
          <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 group-hover:text-[#4CAF50]">
            {isCollapsed ? "Menu" : "Hide"}
          </div>
          <ChevronUp className={`w-4 h-4 text-gray-500 transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/*<div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 bg-white/95 px-2 sm:px-4 md:px-8 pt-3 sm:pt-4 md:pt-5 pb-6 sm:pb-8 md:pb-10 rounded-b-2xl shadow-lg flex items-start gap-1 sm:gap-2 md:gap-4 overflow-x-auto max-w-[95vw] scrollbar-hide">
        {STORY_PARTS.map((part, index) => (
          <div key={part.id} className="relative flex flex-col items-center flex-shrink-0">
            <button
              onClick={() => handleStoryClick(index)}
              disabled={index >= unlockedParts}
              className={`
                px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 touch-manipulation
                ${
                  index < unlockedParts
                    ? "bg-[#4CAF50] text-white active:bg-[#45a049] sm:hover:bg-[#45a049] cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {index < unlockedParts ? (
                <>
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                  <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </>
              ) : (
                <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span className="whitespace-nowrap">{part.title}</span>
            </button>
            {index >= unlockedParts && (
              <div className="absolute -bottom-4 sm:-bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-red-500 text-white px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] whitespace-nowrap shadow-md">
                <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="hidden sm:inline">LOCKED</span>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={() => foundItems.length === items.length && setShowGoodyBag(true)}
          className={`ml-1 sm:ml-2 p-2 sm:p-2.5 md:p-3 rounded-full transition-all touch-manipulation flex-shrink-0 ${
            foundItems.length === items.length
              ? "bg-red-500 active:bg-red-600 sm:hover:bg-red-600 cursor-pointer animate-bounce"
              : "bg-gray-200 cursor-not-allowed"
          }`}
        >
          <Gift className={`w-5 h-5 sm:w-6 sm:h-6 ${foundItems.length === items.length ? "text-white" : "text-gray-400"}`} />
        </button>
      </div>*/}

      {/* Hint arrow */}
      {hintItemId && hintAngle !== null && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-25 pointer-events-none">
          <div
            className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center animate-pulse"
            style={{ transform: `rotate(${hintAngle + 90}deg)` }}
          >
            <Image
              src="/images/lego-arrow.png"
              alt="Hint arrow"
              width={96}
              height={96}
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      )}

      {/* Navigation controller */}
      <div className="absolute bottom-24 sm:bottom-28 right-4 sm:right-8 z-20 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-1.5 sm:p-2">
        <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
          <div />
          <button
            onClick={() => handlePan("up")}
            disabled={panPosition.y <= 0}
            className="bg-[#4CAF50] active:bg-[#45a049] sm:hover:bg-[#45a049] disabled:bg-gray-300 p-1.5 sm:p-2 rounded-lg transition-colors disabled:cursor-not-allowed touch-manipulation"
          >
            <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
          <div />
          <button
            onClick={() => handlePan("left")}
            disabled={panPosition.x <= 0}
            className="bg-[#4CAF50] active:bg-[#45a049] sm:hover:bg-[#45a049] disabled:bg-gray-300 p-1.5 sm:p-2 rounded-lg transition-colors disabled:cursor-not-allowed touch-manipulation"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
          <div className="bg-gray-200 p-1.5 sm:p-2 rounded-lg flex items-center justify-center">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full" />
          </div>
          <button
            onClick={() => handlePan("right")}
            disabled={panPosition.x >= 100}
            className="bg-[#4CAF50] active:bg-[#45a049] sm:hover:bg-[#45a049] disabled:bg-gray-300 p-1.5 sm:p-2 rounded-lg transition-colors disabled:cursor-not-allowed touch-manipulation"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
          <div />
          <button
            onClick={() => handlePan("down")}
            disabled={panPosition.y >= 100}
            className="bg-[#4CAF50] active:bg-[#45a049] sm:hover:bg-[#45a049] disabled:bg-gray-300 p-1.5 sm:p-2 rounded-lg transition-colors disabled:cursor-not-allowed touch-manipulation"
          >
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
          <div />
        </div>
      </div>

      {/* Bottom item bar */}

      <div className={`
        absolute bottom-2 left-1/2 -translate-x-1/2 z-30 
        transition-all duration-500 ease-in-out
        ${isInventoryCollapsed ? 'translate-y-[106%]' : 'translate-y-0'}
      `}>
        {/* The Toggle Tab - Now sits on TOP of the bar */}
        <button
          onClick={() => setIsInventoryCollapsed(!isInventoryCollapsed)}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[90%] bg-white/80 backdrop-blur-md border-t border-x rounded-t-xl px-4 py-1 flex items-center group transition-colors hover:bg-white z-40"
        >
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-500 ${isInventoryCollapsed ? 'rotate-180' : ''}`} />
          <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 group-hover:text-yellow-600">
            {isInventoryCollapsed ? "Items" : "Hide"}
          </div>
        </button>

        {/* Main Item Bar */}
        <div className={`
          bg-white/80 backdrop-blur-md px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 
          rounded-full shadow-xl flex items-center gap-2 sm:gap-4 md:gap-6 
          max-w-[95vw] overflow-x-auto scrollbar-hide transition-opacity duration-300
          ${isInventoryCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}>
          {items.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-0.5 sm:gap-1 flex-shrink-0">
              <div
                className={`
                  w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center transition-all duration-300
                  ${foundItems.includes(item.id) ? "opacity-100" : "opacity-30"}
                `}
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={60}
                  height={60}
                  className={`object-contain w-full h-full ${!foundItems.includes(item.id) ? "grayscale brightness-50" : ""}`}
                />
              </div>
              <span className="text-[10px] md:text-xs font-medium text-gray-700 whitespace-nowrap">
                {foundItems.includes(item.id) ? "Found!" : `Item ${item.id}`}
              </span>
            </div>
          ))}

          <div className="w-px h-12 sm:h-14 md:h-16 bg-gray-300 mx-1 sm:mx-2 flex-shrink-0" />

          <button
            onClick={handleHint}
            disabled={foundItems.length === items.length}
            className="bg-yellow-400 text-yellow-900 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-bold text-sm sm:text-base md:text-lg active:bg-yellow-300 sm:hover:bg-yellow-300 transition-colors shadow-md flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation flex-shrink-0"
          >
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Hint</span>
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="bg-[#4CAF50] text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-bold text-sm sm:text-base md:text-lg active:bg-[#45a049] sm:hover:bg-[#45a049] transition-colors shadow-md flex items-center gap-1 sm:gap-2 touch-manipulation flex-shrink-0"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Help</span>
          </button>
        </div>
      </div>

{/*      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 bg-white/80 backdrop-blur-md px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 rounded-full sm:rounded-full shadow-xl flex items-center gap-2 sm:gap-4 md:gap-6 max-w-[95vw] overflow-x-auto scrollbar-hide">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col items-center gap-0.5 sm:gap-1 flex-shrink-0">
            <div
              className={`
                w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center transition-all duration-300
                ${foundItems.includes(item.id) ? "opacity-100" : "opacity-30"}
              `}
            >
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={60}
                height={60}
                className={`object-contain w-full h-full ${!foundItems.includes(item.id) ? "grayscale brightness-50" : ""}`}
              />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-gray-700 whitespace-nowrap">
              {foundItems.includes(item.id) ? "Found!" : `Item ${item.id}`}
            </span>
          </div>
        ))}

        <div className="w-px h-12 sm:h-14 md:h-16 bg-gray-300 mx-1 sm:mx-2 flex-shrink-0" />

        <button
          onClick={handleHint}
          disabled={foundItems.length === items.length}
          className="bg-yellow-400 text-yellow-900 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-bold text-sm sm:text-base md:text-lg active:bg-yellow-300 sm:hover:bg-yellow-300 transition-colors shadow-md flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation flex-shrink-0"
        >
          <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Hint</span>
        </button>

        <button
          onClick={() => setShowHelp(true)}
          className="bg-[#4CAF50] text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-bold text-sm sm:text-base md:text-lg active:bg-[#45a049] sm:hover:bg-[#45a049] transition-colors shadow-md flex items-center gap-1 sm:gap-2 touch-manipulation flex-shrink-0"
        >
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Help</span>
        </button>
      </div>*/}

      {/* Image copyright credit – links to admin */}
      {(config?.imageCreditDay2 ?? "").trim() && (
        <Link
          href="/admin"
          className="absolute bottom-2 left-2 z-20 rounded bg-black/50 px-2 py-1 text-[10px] text-white/90 no-underline hover:bg-black/60 hover:text-white sm:text-xs"
        >
          {config.imageCreditDay2!.trim()}
        </Link>
      )}

      {/* Story Modal - same as Day 1 */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full active:bg-gray-100 sm:hover:bg-gray-100 transition-colors touch-manipulation"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="text-center mb-3 sm:mb-4">
              <span className="bg-[#4CAF50] text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
                {selectedStory.title}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#4CAF50]" />
              <h3 className="text-lg sm:text-xl font-bold text-[#5D4037] text-center">{selectedStory.verse}</h3>
            </div>

            <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg mb-4">{selectedStory.text}</p>

            {"audio" in selectedStory && selectedStory.audio && (
              <div className="mb-4 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Volume2 className={`w-4 h-4 text-yellow-600 ${isPlaying ? "animate-pulse" : ""}`} />
                  <p className="text-sm font-medium text-yellow-800">
                    {isPlaying
                      ? `Playing audio... (${audioCountdown}s remaining)`
                      : audioCountdown > 0
                        ? `Please listen to the audio (${audioCountdown}s remaining)`
                        : "Audio ready"}
                  </p>
                </div>
                {audioDuration > 0 && (
                  <div className="w-full bg-yellow-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${((audioDuration - audioCountdown) / audioDuration) * 100}%` }}
                    />
                  </div>
                )}
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      if (audioRef.current) {
                        if (isPlaying) audioRef.current.pause()
                        else audioRef.current.play()
                      }
                    }}
                    className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg text-sm font-medium active:bg-[#45a049] sm:hover:bg-[#45a049] transition-colors touch-manipulation flex items-center gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <X className="w-4 h-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        Play Audio
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setSelectedStory(null)}
                disabled={audioCountdown > 0 && "audio" in selectedStory && !!selectedStory.audio}
                className={`flex-1 py-2.5 sm:py-3 rounded-xl font-bold transition-colors touch-manipulation ${
                  audioCountdown > 0 && "audio" in selectedStory && selectedStory.audio
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#4CAF50] text-white active:bg-[#45a049] sm:hover:bg-[#45a049]"
                }`}
              >
                {audioCountdown > 0 && "audio" in selectedStory && selectedStory.audio
                  ? `Continue in ${audioCountdown}s...`
                  : "Keep Exploring"}
              </button>
              {foundItems.length === items.length &&
                selectedStory?.id === STORY_PARTS[STORY_PARTS.length - 1]?.id &&
                (!("audio" in selectedStory) || !selectedStory.audio || audioCountdown === 0) && (
                  <button
                    onClick={() => {
                      setSelectedStory(null)
                      setShowConfetti(true)
                      setShowGoodyBag(true)
                      setTimeout(() => setShowConfetti(false), 3000)
                    }}
                    className="flex-1 py-2.5 sm:py-3 rounded-xl font-bold bg-amber-500 text-white active:bg-amber-600 sm:hover:bg-amber-600 transition-colors touch-manipulation"
                  >
                    Take me to the goody bag!
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Help Modal - same as Day 1 */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full active:bg-gray-100 sm:hover:bg-gray-100 transition-colors touch-manipulation"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-[#4CAF50]" />
              <h3 className="text-lg sm:text-xl font-bold text-[#5D4037]">How to Play</h3>
            </div>

            <ul className="space-y-2 sm:space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="bg-[#4CAF50] text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </span>
                <span className="text-sm sm:text-base">Use the arrows or drag to navigate around the scene</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-[#4CAF50] text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </span>
                <span className="text-sm sm:text-base">Tap on hidden objects when you find them</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-[#4CAF50] text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </span>
                <span className="text-sm sm:text-base">Each object unlocks a new part of the Easter story</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-[#4CAF50] text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 mt-0.5">
                  4
                </span>
                <span className="text-sm sm:text-base">Tap on the story parts at the top to read the Bible verses</span>
              </li>
            </ul>

            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 text-center">
              Found: {foundItems.length} / {items.length} items
            </p>

            <button
              onClick={() => setShowHelp(false)}
              className="mt-3 sm:mt-4 w-full bg-[#4CAF50] text-white py-2.5 sm:py-3 rounded-xl font-bold active:bg-[#45a049] sm:hover:bg-[#45a049] transition-colors touch-manipulation"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Confetti overlay */}
      {showConfetti && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10px",
                backgroundColor: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"][
                  Math.floor(Math.random() * 6)
                ],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <GoodyBagModal
        open={showGoodyBag}
        onClose={() => setShowGoodyBag(false)}
        items={goodyBagItems}
        footerQuote="He really was the Son of God!"
        activeItem={activeGoodyItem}
        onActiveItemChange={setActiveGoodyItem}
      />
    </div>
  )
}
