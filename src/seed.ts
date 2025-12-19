import * as fs from "fs";
import * as path from "path";
import { Tag } from "./entities/tag";
import { Position } from "./entities/Position";
import { Message } from "./entities/Message";
import { Image } from "./entities/Image";

const DATA_DIR = "./data";
const DB_PATH = path.join(DATA_DIR, "db.sqlite");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

// Path to bundled seed images (copied into container via Dockerfile)
// Use relative path from project root since __dirname points to dist/ at runtime
const SEED_IMAGES_DIR = "./src/assets/seed-images";

// Target filenames matching Multer/router regex: yyyy-MM-dd_HH-mm-ss.ext
const SEED_IMAGE_NAMES = [
  "2025-01-01_10-00-00.jpg",
  "2025-01-01_10-00-01.jpg",
  "2025-01-01_10-00-02.jpg",
];

/**
 * Copies images from src/assets/seed-images/ to data/uploads/
 * Images in seed-images/ can have any name - they'll be renamed to match the expected format
 */
function copySeedImages(): string[] {
  const copiedFiles: string[] = [];

  if (!fs.existsSync(SEED_IMAGES_DIR)) {
    console.log(`   ⚠️  No seed-images folder found at ${SEED_IMAGES_DIR}`);
    console.log(`   ⚠️  Add your images to src/assets/seed-images/ and rebuild`);
    return copiedFiles;
  }

  // Get all image files from the seed folder
  const sourceFiles = fs.readdirSync(SEED_IMAGES_DIR).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
  });

  if (sourceFiles.length === 0) {
    console.log(`   ⚠️  No images found in ${SEED_IMAGES_DIR}`);
    return copiedFiles;
  }

  // Copy each source file, renaming to match expected format
  for (let i = 0; i < sourceFiles.length && i < SEED_IMAGE_NAMES.length; i++) {
    const sourceFile = sourceFiles[i];
    const sourceExt = path.extname(sourceFile).toLowerCase();
    
    // Use the predefined name but keep original extension
    const targetName = SEED_IMAGE_NAMES[i].replace(/\.[^.]+$/, sourceExt);
    const sourcePath = path.join(SEED_IMAGES_DIR, sourceFile);
    const targetPath = path.join(UPLOADS_DIR, targetName);

    fs.copyFileSync(sourcePath, targetPath);
    copiedFiles.push(targetName);
  }

  console.log(`   Copied ${copiedFiles.length} images from seed-images/`);
  return copiedFiles;
}

/**
 * Resets the data directory: removes db.sqlite and clears/recreates uploads folder
 */
export function resetDataDir(): void {
  console.log("🗑️  Resetting data directory...");

  // Remove SQLite database if it exists
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
    console.log("   Deleted db.sqlite");
  }

  // Clear and recreate uploads directory
  if (fs.existsSync(UPLOADS_DIR)) {
    fs.rmSync(UPLOADS_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log("   Cleared uploads directory");

  // Copy real images from assets/seed-images/
  const copiedImages = copySeedImages();

  // Store for use in seeding
  (global as any).__seedImages = copiedImages;
}

/**
 * Seeds the database with mock data for all entities
 */
export async function seedDatabase(): Promise<void> {
  console.log("🌱 Seeding database...");

  // Get copied image filenames (or empty array if none)
  const seedImages: string[] = (global as any).__seedImages || [];

  // Seed Tags (exactly one boolean field true per tag)
  const tags = [
    { isOrgin: true, isLevel: false, isPrice: false },
    { isOrgin: false, isLevel: true, isPrice: false },
    { isOrgin: false, isLevel: false, isPrice: true },
  ];

  for (const tagData of tags) {
    const tag = new Tag();
    Object.assign(tag, tagData);
    await tag.save();
  }
  console.log(`   Inserted ${tags.length} tags`);

  // Seed Positions
  const positions = [
    {
      name: "Eiffel Tower",
      description: "Famous landmark in Paris",
      lat: 48.8584,
      lng: 2.2945,
      author: "admin",
      ...(seedImages[0] && {
        imagePath: path.join(UPLOADS_DIR, seedImages[0]),
        imageUri: `/images/${seedImages[0]}`,
      }),
      tags: ["landmark", "tourism"],
    },
    {
      name: "Central Park",
      description: "Urban park in New York City",
      lat: 40.7829,
      lng: -73.9654,
      author: "admin",
      ...(seedImages[1] && {
        imagePath: path.join(UPLOADS_DIR, seedImages[1]),
        imageUri: `/images/${seedImages[1]}`,
      }),
      tags: ["park", "nature"],
    },
    {
      name: "Tokyo Station",
      description: "Major railway station in Tokyo",
      lat: 35.6812,
      lng: 139.7671,
      author: "user1",
      ...(seedImages[2] && {
        imagePath: path.join(UPLOADS_DIR, seedImages[2]),
        imageUri: `/images/${seedImages[2]}`,
      }),
      tags: ["transport", "architecture"],
    },
  ];

  for (const posData of positions) {
    const position = new Position();
    Object.assign(position, posData);
    await position.save();
  }
  console.log(`   Inserted ${positions.length} positions`);

  // Seed Messages
  const messages = [
    {
      channel: "general",
      message: "Welcome to the app!",
      author: "admin",
      lat: 48.8566,
      lng: 2.3522,
    },
    {
      channel: "general",
      message: "Hello everyone!",
      author: "user1",
      lat: 40.7128,
      lng: -74.006,
    },
    {
      channel: "support",
      message: "How can I help you today?",
      author: "support_bot",
    },
    {
      channel: "announcements",
      message: "New features coming soon!",
      author: "admin",
      ...(seedImages[2] && {
        imagePath: path.join(UPLOADS_DIR, seedImages[2]),
        imageUri: `/images/${seedImages[2]}`,
      }),
    },
  ];

  for (const msgData of messages) {
    const message = new Message();
    Object.assign(message, msgData);
    await message.save();
  }
  console.log(`   Inserted ${messages.length} messages`);

  // Seed Images
  const images = [
    {
      name: "Sunset Photo",
      description: "Beautiful sunset over the ocean",
      lat: 34.0195,
      lng: -118.4912,
      author: "photographer1",
      ...(seedImages[0] && {
        imagePath: path.join(UPLOADS_DIR, seedImages[0]),
        imageUri: `/images/${seedImages[0]}`,
      }),
    },
    {
      name: "Mountain View",
      description: "Snowy mountain peaks",
      lat: 46.8523,
      lng: 9.531,
      author: "photographer2",
      ...(seedImages[1] && {
        imagePath: path.join(UPLOADS_DIR, seedImages[1]),
        imageUri: `/images/${seedImages[1]}`,
      }),
    },
    {
      name: "City Lights",
      description: "Night cityscape with lights",
      lat: 35.6762,
      lng: 139.6503,
      author: "photographer1",
      ...(seedImages[2] && {
        imagePath: path.join(UPLOADS_DIR, seedImages[2]),
        imageUri: `/images/${seedImages[2]}`,
      }),
    },
  ];

  for (const imgData of images) {
    const image = new Image();
    Object.assign(image, imgData);
    await image.save();
  }
  console.log(`   Inserted ${images.length} images`);

  console.log("✅ Database seeding complete!");
}
