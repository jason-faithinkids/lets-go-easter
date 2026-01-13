# Let's Go! A Family Easter Adventure

An interactive Easter story adventure game for families, built with Next.js and inspired by LEGO-style visuals.

## About

"Let's Go! A Family Easter Adventure" is an engaging, interactive web application that takes families on a journey through the Easter story. The game combines exploration, discovery, and learning as players find hidden objects to unlock different parts of the biblical Easter narrative.

## Features

### Interactive Exploration
- **Pan and Explore**: Navigate through beautifully illustrated scenes using arrow controls or click-and-drag
- **Hidden Object Hunt**: Find hidden items scattered throughout the scene
- **Progressive Story Unlocking**: Each found item unlocks a new part of the Easter story from Matthew 28:1-10

### Day 3: The Empty Tomb
The current implementation features Day 3, which focuses on the empty tomb story. Players can:
- Explore a detailed scene of the empty tomb
- Find 4 hidden objects (Cross, Green Brick, Burial Cloths, Golden Cross)
- Unlock 4 story parts with Bible verses
- Use hints when stuck
- Access a "Goody Bag" of family activities after completing the adventure

### Family Activities
After completing the adventure, families can access a variety of activities:
- **Watch**: Educational videos about the Easter story
- **Build**: LEGO building challenges
- **Colour**: Printable coloring sheets
- **Craft**: Hands-on craft projects
- **Food**: Fun food activities related to the story
- **Listen**: Podcast episodes explaining the passage
- **Discuss**: Discussion guides for family conversations

## Technology Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jason-faithinkids/lets-go-easter.git
cd lets-go-easter
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── day-3/          # Day 3: The Empty Tomb adventure
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Home page with day selection
│   └── globals.css     # Global styles
├── components/         # Reusable UI components
├── public/
│   └── images/         # Game assets (backgrounds, items, borders)
└── lib/                # Utility functions
```

## How to Play

1. Start on the home page and select "Day 3"
2. Use the arrow buttons or click and drag to explore the scene
3. Look for hidden objects and click on them when found
4. Each found object unlocks a new part of the story
5. Click on the story parts at the top to read the Bible verses
6. Use the "Hint" button if you need help finding items
7. Once all items are found, access the Goody Bag for family activities

## Future Development

- Additional days of the Easter story
- More interactive features
- Enhanced animations and transitions
- Mobile optimization improvements

## License

This project is created for Faith in Kids and is intended for educational and family use.

## Credits

Created with [v0.dev](https://v0.dev) and built for families to explore the Easter story together.

