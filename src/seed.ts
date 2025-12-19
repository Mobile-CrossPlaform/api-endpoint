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

// Original image filenames (alphabetical order when read from directory)
const SEED_IMAGE_NAMES = [
  "Chinese_Traditional.jpg",
  "French_FineDinning.jpg",
  "Greece_Cuisine.jpg",
  "Italian_Western.jpg",
];

/**
 * Copies images from src/assets/seed-images/ to data/uploads/
 * Keeps original filenames
 */
function copySeedImages(): string[] {
  const copiedFiles: string[] = [];

  if (!fs.existsSync(SEED_IMAGES_DIR)) {
    console.log(`   ⚠️  No seed-images folder found at ${SEED_IMAGES_DIR}`);
    console.log(`   ⚠️  Add your images to src/assets/seed-images/ and rebuild`);
    return copiedFiles;
  }

  // Copy each expected seed image
  for (const filename of SEED_IMAGE_NAMES) {
    const sourcePath = path.join(SEED_IMAGES_DIR, filename);
    const targetPath = path.join(UPLOADS_DIR, filename);

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      copiedFiles.push(filename);
    } else {
      console.log(`   ⚠️  Image not found: ${filename}`);
    }
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

  // Seed Positions - Restaurants in Paris
  const positions = [
    {
      name: "Le Dragon d'Or",
      description: "Restaurant chinois traditionnel proposant des dim sum faits maison et des spécialités cantonaises dans un cadre authentique. Réputé pour son canard laqué et ses nouilles sautées.",
      lat: 48.8720,
      lng: 2.3650,
      author: "admin",
      ...(seedImages[0] && {
        imagePath: path.join(UPLOADS_DIR, seedImages[0]),
        imageUri: `/images/${seedImages[0]}`,
      }),
      tags: ["chinese", "traditional", "dim-sum"],
    },
    {
      name: "La Belle Époque",
      description: "Restaurant gastronomique français offrant une cuisine raffinée dans un décor Belle Époque. Menu dégustation avec accords mets-vins et service impeccable.",
      lat: 48.8650,
      lng: 2.3280,
      author: "admin",
      ...(seedImages[1] && {
        imagePath: path.join(UPLOADS_DIR, seedImages[1]),
        imageUri: `/images/${seedImages[1]}`,
      }),
      tags: ["french", "fine-dining", "gastronomic"],
    },
    {
      name: "Ouzeria Athena",
      description: "Taverne grecque conviviale servant des mezze, grillades et poissons frais. Ambiance méditerranéenne avec musique live le weekend et terrasse ensoleillée.",
      lat: 48.8530,
      lng: 2.3490,
      author: "admin",
      ...(seedImages[2] && {
        imagePath: path.join(UPLOADS_DIR, seedImages[2]),
        imageUri: `/images/${seedImages[2]}`,
      }),
      tags: ["greek", "mediterranean", "seafood"],
    },
    {
      name: "Trattoria da Luigi",
      description: "Trattoria italienne familiale proposant des pâtes fraîches, pizzas au feu de bois et antipasti. Carte des vins italiens sélectionnés et tiramisu maison.",
      lat: 48.8580,
      lng: 2.3400,
      author: "user1",
      ...(seedImages[3] && {
        imagePath: path.join(UPLOADS_DIR, seedImages[3]),
        imageUri: `/images/${seedImages[3]}`,
      }),
      tags: ["italian", "pasta", "pizza"],
    },
  ];

  for (const posData of positions) {
    const position = new Position();
    Object.assign(position, posData);
    await position.save();
  }
  console.log(`   Inserted ${positions.length} positions`);

  // Seed Messages - Restaurant-related
  const messages = [
    {
      channel: "general",
      message: "Bienvenue sur l'application de découverte de restaurants!",
      author: "admin",
      lat: 48.8566,
      lng: 2.3522,
    },
    {
      channel: "general",
      message: "N'hésitez pas à partager vos découvertes culinaires!",
      author: "user1",
      lat: 48.8600,
      lng: 2.3500,
    },
    {
      channel: "recommendations",
      message: "Le Dragon d'Or a les meilleurs dim sum de Paris!",
      author: "foodie_paris",
      lat: 48.8720,
      lng: 2.3650,
    },
    {
      channel: "recommendations",
      message: "La Belle Époque vaut vraiment le détour pour une occasion spéciale.",
      author: "gourmet_lover",
      lat: 48.8650,
      lng: 2.3280,
    },
  ];

  for (const msgData of messages) {
    const message = new Message();
    Object.assign(message, msgData);
    await message.save();
  }
  console.log(`   Inserted ${messages.length} messages`);

  // Seed Images - Restaurant photos
  const images = [
    {
      name: "Intérieur Le Dragon d'Or",
      description: "Décoration traditionnelle chinoise avec lanternes rouges",
      lat: 48.8720,
      lng: 2.3650,
      author: "admin",
      ...(seedImages[0] && {
        imagePath: path.join(UPLOADS_DIR, seedImages[0]),
        imageUri: `/images/${seedImages[0]}`,
      }),
    },
    {
      name: "Plat signature La Belle Époque",
      description: "Foie gras poêlé aux figues et réduction de porto",
      lat: 48.8650,
      lng: 2.3280,
      author: "admin",
      ...(seedImages[1] && {
        imagePath: path.join(UPLOADS_DIR, seedImages[1]),
        imageUri: `/images/${seedImages[1]}`,
      }),
    },
    {
      name: "Mezze Ouzeria Athena",
      description: "Assortiment de spécialités grecques: tzatziki, tarama, dolmas",
      lat: 48.8530,
      lng: 2.3490,
      author: "foodie_paris",
      ...(seedImages[2] && {
        imagePath: path.join(UPLOADS_DIR, seedImages[2]),
        imageUri: `/images/${seedImages[2]}`,
      }),
    },
    {
      name: "Pizza Trattoria da Luigi",
      description: "Pizza margherita au feu de bois avec mozzarella di bufala",
      lat: 48.8580,
      lng: 2.3400,
      author: "gourmet_lover",
      ...(seedImages[3] && {
        imagePath: path.join(UPLOADS_DIR, seedImages[3]),
        imageUri: `/images/${seedImages[3]}`,
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
