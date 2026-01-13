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
} from "lucide-react"

// Define the findable items with their actual positions on the background
const ITEMS = [
  {
    id: 1,
    name: "Cross",
    image: "/images/item-201.png",
    position: { x: 20, y: 15 }, // On the crosses at top
  },
  {
    id: 2,
    name: "Green Brick",
    image: "/images/item-202.png",
    position: { x: 70, y: 75 }, // In the grass area
  },
  {
    id: 3,
    name: "Burial Cloths",
    image: "/images/item-203.png",
    position: { x: 45, y: 50 }, // Near the tomb entrance
  },
  {
    id: 4,
    name: "Golden Cross",
    image: "/images/item-201.png",
    position: { x: 85, y: 30 },
  },
]

// Story parts with Bible text
const STORY_PARTS = [
  {
    id: 1,
    title: "Part 1",
    verse: "Matthew 28:1-10",
    text: "The day after the Sabbath day was the first day of the week. At dawn on the first day, Mary Magdalene and another woman named Mary went to look at the tomb.",
  },
  {
    id: 2,
    title: "Part 2",
    verse: "Matthew 28:1-10",
    text: "At that time there was a strong earthquake. An angel of the Lord came down from heaven. The angel went to the tomb and rolled the stone away from the entrance. Then he sat on the stone. He was shining as bright as lightning. His clothes were white as snow. The soldiers guarding the tomb were very frightened of the angel. They shook with fear and then became like dead men.",
  },
  {
    id: 3,
    title: "Part 3",
    verse: "Matthew 28:1-10",
    text: 'The angel said to the women, "Don\'t be afraid. I know that you are looking for Jesus, the one who was killed on the cross. But he is not here. He has risen from death as he said he would. Come and see the place where his body was. And go quickly and tell his followers. Say to them: \'Jesus has risen from death. He is going into Galilee. He will be there before you. You will see him there.\'" Then the angel said, "Now I have told you."',
  },
  {
    id: 4,
    title: "Part 4",
    verse: "Matthew 28:1-10",
    text: 'The women left the tomb quickly. They were afraid, but they were also very happy. They ran to tell Jesus\' followers what had happened. Suddenly, Jesus met them and said, "Greetings." The women came up to Jesus, took hold of his feet, and worshiped him. Then Jesus said to them, "Don\'t be afraid. Go and tell my brothers to go on to Galilee. They will see me there."',
  },
]

// Goody bag activities for Day 3
const GOODY_BAG_ITEMS = [
  {
    id: "watch",
    icon: Clapperboard,
    label: "Watch",
    content: "Watch The Easter Story Lego video from 3 min 36 secs to the end.",
    link: "https://www.youtube.com/watch?v=example",
  },
  {
    id: "build",
    icon: Blocks,
    label: "Build",
    content:
      "A stone was rolled in front of the tomb to seal it. Can you make a Lego stone and test how well it rolls?",
  },
  {
    id: "colour",
    icon: Palette,
    label: "Colour",
    content: "Colour in the picture of the angel and women in front of the empty tomb.",
    download: "Download colouring sheet",
  },
  {
    id: "craft",
    icon: Scissors,
    label: "Craft",
    content:
      "Angel craft. You will need: a copy of the printout, scissors, glue and colouring pens. Instructions: Cut out the angel and colour it in. Cut some brick wings and stick them to the back of the angel.",
    download: "Download angel template",
  },
  {
    id: "food",
    icon: CookingPot,
    label: "Food",
    content:
      "Make a tomb out of toast, using jam to stick the pieces together. Cut one piece of toast into a circle to be the stone and have it rolled to one side to see that the tomb is empty.",
  },
  {
    id: "listen",
    icon: Ear,
    label: "Listen",
    content: "Listen to Ed's explanation of part of the passage from the Faith in Kids podcast.",
    link: "https://faithinkids.org",
  },
  {
    id: "discuss",
    icon: MessageCircle,
    label: "Discuss",
    content: "Bible verse followed by questions below. Use the left hand column from the parent take home sheet.",
    download: "Download discussion guide",
  },
]

export default function Day3Page() {
  const [foundItems, setFoundItems] = useState<number[]>([])
  const [panPosition, setPanPosition] = useState({ x: 50, y: 50 })
  const [selectedStory, setSelectedStory] = useState<(typeof STORY_PARTS)[0] | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [showGoodyBag, setShowGoodyBag] = useState(false) // renamed from showComplete
  const [hintItemId, setHintItemId] = useState<number | null>(null)
  const [activeGoodyItem, setActiveGoodyItem] = useState<string | null>(null) // track which goody bag item is expanded
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [newlyUnlockedPart, setNewlyUnlockedPart] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate unlocked story parts based on found items
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

        if (newFoundItems.length === ITEMS.length) {
          setTimeout(() => setShowGoodyBag(true), 1500)
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

  const handleStoryClick = (partIndex: number) => {
    if (partIndex < unlockedParts) {
      setSelectedStory(STORY_PARTS[partIndex])
    }
  }

  const handleHint = () => {
    const unfoundItems = ITEMS.filter((item) => !foundItems.includes(item.id))
    if (unfoundItems.length > 0) {
      const randomItem = unfoundItems[Math.floor(Math.random() * unfoundItems.length)]
      setHintItemId(randomItem.id)
      setTimeout(() => setHintItemId(null), 5000)
    }
  }

  const getHintDirection = () => {
    if (!hintItemId) return null
    const item = ITEMS.find((i) => i.id === hintItemId)
    if (!item) return null

    const dx = item.position.x - panPosition.x
    const dy = item.position.y - panPosition.y
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)
    return angle
  }

  const hintAngle = getHintDirection()

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-[#4CAF50]">
      {/* Border overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <Image src="/images/border.png" alt="LEGO border" fill className="object-cover" />
      </div>

      {/* Day title */}
      <div className="absolute top-0 left-0 z-30 bg-white/90 px-4 py-3 rounded-br-xl shadow-lg">
        <h1 className="text-base font-bold text-[#5D4037]">Day 3: The Empty Tomb</h1>
      </div>

      <Link
        href="/"
        className="absolute top-0 right-0 z-30 bg-white/90 px-4 py-3 rounded-bl-xl shadow-lg flex items-center gap-2 hover:bg-white transition-colors"
      >
        <Home className="w-5 h-5" />
        <span className="font-medium">Home page</span>
      </Link>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 bg-white/95 px-8 pt-5 pb-10 rounded-b-2xl shadow-lg flex items-start gap-4">
        {STORY_PARTS.map((part, index) => (
          <div key={part.id} className="relative flex flex-col items-center">
            <button
              onClick={() => handleStoryClick(index)}
              disabled={index >= unlockedParts}
              className={`
                px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                ${
                  index < unlockedParts
                    ? "bg-[#4CAF50] text-white hover:bg-[#45a049] cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {index < unlockedParts ? <BookOpen className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {part.title}
            </button>
            {index >= unlockedParts && (
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-red-500 text-white px-2 py-0.5 rounded text-[10px] whitespace-nowrap shadow-md">
                <Lock className="w-3 h-3" />
                LOCKED
              </div>
            )}
          </div>
        ))}

        <button
          onClick={() => foundItems.length === ITEMS.length && setShowGoodyBag(true)}
          className={`ml-2 p-3 rounded-full transition-all ${
            foundItems.length === ITEMS.length
              ? "bg-red-500 hover:bg-red-600 cursor-pointer animate-bounce"
              : "bg-gray-200 cursor-not-allowed"
          }`}
        >
          <Gift className={`w-6 h-6 ${foundItems.length === ITEMS.length ? "text-white" : "text-gray-400"}`} />
        </button>
      </div>

      {/* Hint arrow */}
      {hintItemId && hintAngle !== null && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-25 pointer-events-none">
          <div
            className="w-24 h-24 flex items-center justify-center animate-pulse"
            style={{ transform: `rotate(${hintAngle}deg)` }}
          >
            <div className="w-16 h-1 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-yellow-400 border-y-4 border-y-transparent" />
            </div>
          </div>
        </div>
      )}

      {/* Pannable container */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute w-[150%] h-[150%] transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${-panPosition.x * 0.5}%, ${-panPosition.y * 0.5}%)`,
          }}
        >
          <Image
            src="/images/background-20-20scrolling-20image.jpeg"
            alt="Empty Tomb Scene"
            fill
            className="object-cover scale-150"
            priority
            draggable={false}
          />

          {ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={(e) => handleItemClick(item.id, e)}
              className={`
                absolute transition-all duration-300 hover:scale-125 z-10
                ${foundItems.includes(item.id) ? "opacity-0 pointer-events-none scale-150" : "opacity-100 hover:brightness-110"}
                ${hintItemId === item.id ? "animate-pulse scale-125" : ""}
              `}
              style={{
                left: `${item.position.x}%`,
                top: `${item.position.y}%`,
                transform: "translate(-50%, -50%)",
                filter:
                  hintItemId === item.id ? "drop-shadow(0 0 20px #FFD700) drop-shadow(0 0 40px #FFD700)" : undefined,
              }}
              aria-label={`Find ${item.name}`}
            >
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={60}
                height={60}
                className="object-contain drop-shadow-lg pointer-events-none"
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Navigation controller */}
      <div className="absolute bottom-28 right-8 z-20 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-2">
        <div className="grid grid-cols-3 gap-1">
          <div />
          <button
            onClick={() => handlePan("up")}
            disabled={panPosition.y <= 0}
            className="bg-[#4CAF50] hover:bg-[#45a049] disabled:bg-gray-300 p-2 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <ChevronUp className="w-6 h-6 text-white" />
          </button>
          <div />
          <button
            onClick={() => handlePan("left")}
            disabled={panPosition.x <= 0}
            className="bg-[#4CAF50] hover:bg-[#45a049] disabled:bg-gray-300 p-2 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div className="bg-gray-200 p-2 rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
          </div>
          <button
            onClick={() => handlePan("right")}
            disabled={panPosition.x >= 100}
            className="bg-[#4CAF50] hover:bg-[#45a049] disabled:bg-gray-300 p-2 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          <div />
          <button
            onClick={() => handlePan("down")}
            disabled={panPosition.y >= 100}
            className="bg-[#4CAF50] hover:bg-[#45a049] disabled:bg-gray-300 p-2 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <ChevronDown className="w-6 h-6 text-white" />
          </button>
          <div />
        </div>
      </div>

      {/* Bottom item bar */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 bg-white/80 backdrop-blur-md px-8 py-4 rounded-full shadow-xl flex items-center gap-6">
        {ITEMS.map((item) => (
          <div key={item.id} className="flex flex-col items-center gap-1">
            <div
              className={`
                w-16 h-16 rounded-lg flex items-center justify-center transition-all duration-300
                ${foundItems.includes(item.id) ? "opacity-100" : "opacity-30"}
              `}
            >
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={60}
                height={60}
                className={`object-contain ${!foundItems.includes(item.id) ? "grayscale brightness-50" : ""}`}
              />
            </div>
            <span className="text-xs font-medium text-gray-700">
              {foundItems.includes(item.id) ? "Found!" : `Item ${item.id}`}
            </span>
          </div>
        ))}

        <div className="w-px h-16 bg-gray-300 mx-2" />

        <button
          onClick={handleHint}
          disabled={foundItems.length === ITEMS.length}
          className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-full font-bold text-lg hover:bg-yellow-300 transition-colors shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Lightbulb className="w-5 h-5" />
          Hint
        </button>

        <button
          onClick={() => setShowHelp(true)}
          className="bg-[#4CAF50] text-white px-6 py-3 rounded-full font-bold text-lg hover:bg-[#45a049] transition-colors shadow-md flex items-center gap-2"
        >
          <HelpCircle className="w-5 h-5" />
          Help
        </button>
      </div>

      {/* Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-4">
              <span className="bg-[#4CAF50] text-white px-4 py-1 rounded-full text-sm font-medium">
                {selectedStory.title}
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#5D4037] mb-2 text-center">{selectedStory.verse}</h3>

            <p className="text-gray-700 leading-relaxed text-lg">{selectedStory.text}</p>

            <button
              onClick={() => setSelectedStory(null)}
              className="mt-6 w-full bg-[#4CAF50] text-white py-3 rounded-xl font-bold hover:bg-[#45a049] transition-colors"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-8 h-8 text-[#4CAF50]" />
              <h3 className="text-xl font-bold text-[#5D4037]">How to Play</h3>
            </div>

            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="bg-[#4CAF50] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </span>
                <span>Use the arrows or click and drag to navigate around the scene</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-[#4CAF50] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </span>
                <span>Click on hidden objects when you find them</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-[#4CAF50] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </span>
                <span>Each object unlocks a new part of the Easter story</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-[#4CAF50] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  4
                </span>
                <span>Click on the story parts at the top to read the Bible verses</span>
              </li>
            </ul>

            <p className="mt-4 text-sm text-gray-500 text-center">
              Found: {foundItems.length} / {ITEMS.length} items
            </p>

            <button
              onClick={() => setShowHelp(false)}
              className="mt-4 w-full bg-[#4CAF50] text-white py-3 rounded-xl font-bold hover:bg-[#45a049] transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Goody Bag Modal */}
      {showGoodyBag && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowGoodyBag(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#5D4037]">Well Done!</h2>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">
                {
                  "You've heard the truth about what happened that first Easter. Here are some activities you can do together as a family!"
                }
              </p>
            </div>

            {/* Goody bag items grid */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 mb-6">
              {GOODY_BAG_ITEMS.map((item) => {
                const IconComponent = item.icon
                return (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => setActiveGoodyItem(activeGoodyItem === item.id ? null : item.id)}
                      className={`
                        w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all
                        ${
                          activeGoodyItem === item.id
                            ? "bg-[#4CAF50] text-white scale-105 shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }
                      `}
                    >
                      <IconComponent className="w-6 h-6" />
                      <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Active item content */}
            {activeGoodyItem && (
              <div className="bg-[#FFF8E7] rounded-xl p-4 mb-6 border-2 border-[#4CAF50]/20">
                {(() => {
                  const item = GOODY_BAG_ITEMS.find((i) => i.id === activeGoodyItem)
                  if (!item) return null
                  const IconComponent = item.icon
                  return (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <IconComponent className="w-5 h-5 text-[#4CAF50]" />
                        <h4 className="font-bold text-[#5D4037]">{item.label}</h4>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{item.content}</p>
                      {item.download && (
                        <button className="mt-3 bg-[#4CAF50] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#45a049] transition-colors">
                          {item.download}
                        </button>
                      )}
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                        >
                          Open Link
                        </a>
                      )}
                    </>
                  )
                })()}
              </div>
            )}

            <p className="text-center text-[#4CAF50] font-medium text-lg mb-4">{"He is not here; He has risen!"}</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowGoodyBag(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
              >
                Keep Exploring
              </button>
              <Link
                href="/"
                className="flex-1 bg-[#4CAF50] text-white py-3 rounded-xl font-bold hover:bg-[#45a049] transition-colors text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
