/**
 * Generate Easter story audio files using ElevenLabs API.
 * Requires .env.local with ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID.
 * Run: node scripts/generate-easter-audio.js
 */

const fs = require("fs");
const path = require("path");

// Load .env.local
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      process.env[key] = value;
    }
  });
}

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

if (!API_KEY || !VOICE_ID) {
  console.error("Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID in .env.local");
  process.exit(1);
}

const OUT_DIR = path.join(__dirname, "..", "public", "audio");
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Story text from "Story text for Digital Family Easter.md"
const STORY_PARTS = {
  day1: [
    "Jesus and his followers were coming closer to Jerusalem. But first they stopped at Bethphage at the hill called the Mount of Olives. From there Jesus sent two of his followers into the town.",
    'He said to them, "Go to the town you can see there. When you enter it, you will find a donkey tied there with its colt. Untie them and bring them to me. If anyone asks you why you are taking the donkeys, tell him, \'The Master needs them. He will send them back soon.\'"',
    'This was to make clear the full meaning of what the prophet said: "Tell the people of Jerusalem, \'Your king is coming to you. He is gentle and riding on a donkey. He is on the colt of a donkey.\'"',
    "The followers went and did what Jesus told them to do. They brought the donkey and the colt to Jesus. They laid their coats on the donkeys, and Jesus sat on them. Many people spread their coats on the road before Jesus. Others cut branches from the trees and spread them on the road. Some of the people were walking ahead of Jesus. Others were walking behind him.",
    '"Praise to the Son of David! God bless the One who comes in the name of the Lord! Praise to God in heaven!" Then Jesus went into Jerusalem. The city was filled with excitement. The people asked, "Who is this man?" The crowd answered, "This man is Jesus. He is the prophet from the town of Nazareth in Galilee."',
  ],
  day2: [
    'The soldiers nailed Jesus to a cross. They threw lots to decide who would get his clothes. The soldiers sat there and continued watching him. They put a sign above Jesus\' head with the charge against him written on it. The sign read: "THIS IS JESUS THE KING OF THE JEWS." Two robbers were nailed to crosses beside Jesus, one on the right and the other on the left.',
    'People walked by and insulted Jesus. They shook their heads, saying, "You said you could destroy the Temple and build it again in three days. So save yourself! Come down from that cross, if you are really the Son of God!"',
    'The leading priests, the teachers of the law, and the Jewish elders were also there. These men made fun of Jesus and said, "He saved other people, but he can\'t save himself! People say he is the King of Israel! If he is the King, then let him come down now from the cross. Then we will believe in him. He trusts in God. So let God save him now, if God really wants him. He himself said, \'I am the Son of God.\'"',
    "Again Jesus cried out in a loud voice. Then he died. Then the curtain in the Temple split into two pieces. The tear started at the top and tore all the way down to the bottom. Also, the earth shook and rocks broke apart.",
    'The army officer and the soldiers guarding Jesus saw this earthquake and everything else that happened. They were very frightened and said, "He really was the Son of God!"',
  ],
  day3: [
    "The day after the Sabbath day was the first day of the week. At dawn on the first day, Mary Magdalene and another woman named Mary went to look at the tomb.",
    "At that time there was a strong earthquake. An angel of the Lord came down from heaven. The angel went to the tomb and rolled the stone away from the entrance. Then he sat on the stone. He was shining as bright as lightning. His clothes were white as snow. The soldiers guarding the tomb were very frightened of the angel. They shook with fear and then became like dead men.",
    'The angel said to the women, "Don\'t be afraid. I know that you are looking for Jesus, the one who was killed on the cross. But he is not here. He has risen from death as he said he would. Come and see the place where his body was. And go quickly and tell his followers. Say to them: \'Jesus has risen from death. He is going into Galilee. He will be there before you. You will see him there.\'" Then the angel said, "Now I have told you."',
    'The women left the tomb quickly. They were afraid, but they were also very happy. They ran to tell Jesus\' followers what had happened. Suddenly, Jesus met them and said, "Greetings." The women came up to Jesus, took hold of his feet, and worshiped him. Then Jesus said to them, "Don\'t be afraid. Go and tell my brothers to go on to Galilee. They will see me there."',
  ],
};

async function generateAudio(text, outputPath) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs API error ${res.status}: ${err}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
}

async function main() {
  const tasks = [];
  for (const [day, parts] of Object.entries(STORY_PARTS)) {
    const dayLabel = day === "day1" ? "Day 1" : day === "day2" ? "Day 2" : "Day 3";
    for (let i = 0; i < parts.length; i++) {
      const filename = `${dayLabel} - p${i + 1}.mp3`;
      const outPath = path.join(OUT_DIR, filename);
      tasks.push({ dayLabel, part: i + 1, text: parts[i], outPath });
    }
  }
  for (const { dayLabel, part, text, outPath } of tasks) {
    process.stdout.write(`${dayLabel} part ${part}... `);
    try {
      await generateAudio(text, outPath);
      console.log("OK");
    } catch (e) {
      console.log("FAIL:", e.message);
    }
  }
  console.log("Done.");
}

main();
