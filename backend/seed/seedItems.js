import mongoose from "mongoose";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";
import ItemCatalog from "../models/ItemCatalog.js";
import { itemCatalogSeed } from "./itemData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const items = itemCatalogSeed;

const seedItems = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await ItemCatalog.deleteMany();
    await ItemCatalog.insertMany(items);

    console.log(`✅ Seeded ${items.length} items successfully`);
    process.exit();
  } catch (err) {
    console.error("❌ Item seeding failed:", err);
    process.exit(1);
  }
};

seedItems();
