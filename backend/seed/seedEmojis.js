import mongoose from "mongoose";
import dotenv from "dotenv";
import EmojiCatalog from "../models/EmojiCatalog.js";

import path from "path";
import { fileURLToPath } from "url";
import { emojiCatalogSeed } from "./emojiData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const emojis = emojiCatalogSeed;

const seedEmojis = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await EmojiCatalog.deleteMany();
    await EmojiCatalog.insertMany(emojis);

    console.log(`✅ Seeded ${emojis.length} emojis successfully`);
    process.exit();
  } catch (err) {
    console.error("❌ Emoji seeding failed:", err);
    process.exit(1);
  }
};

seedEmojis();
