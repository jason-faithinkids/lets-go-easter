# Let's Go! A Family Easter Adventure

An interactive Easter story adventure game for families, built with Next.js and inspired by LEGO-style visuals.

## About

"Let's Go! A Family Easter Adventure" is an engaging, interactive web application that takes families on a journey through the Easter story. The game combines exploration, discovery, and learning as players find hidden objects to unlock different parts of the biblical Easter narrative across three days.

## Features

### Interactive Exploration
- **Pan and Explore**: Navigate through illustrated scenes using arrow controls or click-and-drag (and touch on mobile)
- **Hidden Object Hunt**: Find hidden items scattered throughout each day’s scene
- **Progressive Story Unlocking**: Each found item unlocks a new part of the Easter story with Bible verses
- **Audio**: Listen to narrated story parts; continue exploring once the audio has finished (Day 3; Days 1 & 2 when audio files are added)

### Day 1: Jesus Arrives in Jerusalem
- Explore a scene of Jesus’ arrival in Jerusalem
- Find 5 hidden objects (Palm Branch, Donkey, Crown, Crowd, Cloaks)
- Unlock 5 story parts with Bible verses (Matthew 21)
- Use hints, then open the Goody Bag for family activities

### Day 2: The Cross
- Explore a scene focused on the cross
- Find 5 hidden objects
- Unlock 5 story parts with Bible verses
- Use hints, then open the Goody Bag for family activities

### Day 3: The Empty Tomb
- Explore a scene of the empty tomb
- Find 4 hidden objects (Cross, Green Brick, Burial Cloths, Golden Cross)
- Unlock 4 story parts with Bible verses (Matthew 28:1–10)
- Use hints, then open the Goody Bag for family activities

### Family Activities (Goody Bag)
After completing each day’s adventure, families can choose from:
- **Watch**: Short LEGO Easter story video clips
- **Build**: LEGO building challenges
- **Colour**: Printable colouring sheets (PDFs)
- **Craft**: Craft projects with printable instructions
- **Food**: Simple food activities linked to the story
- **Listen**: Faith in Kids for Kids podcast episodes
- **Discuss**: Discussion guides with a verse and questions

## Technology Stack

- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics (optional)

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
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

### Deployment (Vercel + GitHub)

1. **Connect to Vercel**: In the [Vercel dashboard](https://vercel.com), import the GitHub repo `jason-faithinkids/lets-go-easter`. Use the default settings (Next.js, `npm run build`, `npm start`).
2. **Deploy**: Pushing to `main` triggers a new deployment. Your production URL will be something like `https://lets-go-easter.vercel.app`.
3. **Production behaviour**: The game works in production. **Admin config is editable in production** when you use Vercel Blob for storage:
   - In the [Vercel dashboard](https://vercel.com) go to your project → **Storage** → **Create Database** → choose **Blob**.
   - Create a Blob store and link it to the project. Vercel will add `BLOB_READ_WRITE_TOKEN` automatically.
   - Redeploy (or push a commit). After that, `/admin` saves (backgrounds, listen URLs, image credits, item positions) are stored in Blob and persist across deployments.
   - Locally, without the token, config is still read/written to `data/site-config.json`. Image uploads in production still require external hosting (e.g. paste image URLs in admin); for file uploads you’d need a separate solution (e.g. upload to Blob and store the blob URL).

### Generating story audio (optional)

To generate narrated story audio with ElevenLabs (e.g. for Days 1 and 2):

1. Add `.env.local` with `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID`.
2. Run: `node scripts/generate-easter-audio.js`
3. Generated MP3s are saved under `public/audio/`.

A paid ElevenLabs plan (or a free-eligible voice) may be required.

## Project Structure

```
├── app/
│   ├── day-1/          # Day 1: Jesus arrives in Jerusalem
│   ├── day-2/          # Day 2: The Cross
│   ├── day-3/          # Day 3: The Empty Tomb
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Home page with day selection
│   └── globals.css     # Global styles
├── components/
│   ├── GoodyBagModal.tsx  # Shared Goody Bag modal
│   └── ui/                # Reusable UI components
├── lib/
│   ├── types.ts        # GoodyBagItem and shared types
│   └── utils.ts        # Utility functions
├── public/
│   ├── audio/          # Story narration (MP3)
│   └── images/         # Backgrounds, items, PDFs
├── scripts/
│   └── generate-easter-audio.js  # ElevenLabs TTS script
└── README.md
```

## How to Play

1. **Home**: Open the app and choose **Day 1**, **Day 2**, or **Day 3**.
2. **Explore**: Use the arrow buttons or click-and-drag (or touch) to move around the scene.
3. **Find objects**: Look for hidden objects and click/tap them when you find them.
4. **Story**: Each object unlocks the next part of the story. Tap a part at the top to read (and listen, when audio is available).
5. **Hints**: Use the “Hint” button if you need help locating an item.
6. **Goody Bag**: When all items are found, open the Goody Bag to see Watch, Build, Colour, Craft, Food, Listen, and Discuss activities for that day.

## License

This project is created for Faith in Kids and is intended for educational and family use.

## Credits

Created with [v0.dev](https://v0.dev) and built for families to explore the Easter story together.
