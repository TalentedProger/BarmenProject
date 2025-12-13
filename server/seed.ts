import { db } from "./db";
import { ingredients, glassTypes } from "@shared/schema";
import { InsertIngredient, InsertGlassType } from "@shared/schema";
import { SAMPLE_INGREDIENTS, GLASS_TYPES } from "../client/src/lib/ingredients-data";

// Transform SAMPLE_INGREDIENTS to InsertIngredient format
const allIngredients: InsertIngredient[] = SAMPLE_INGREDIENTS.map(ing => ({
  name: ing.name!,
  category: ing.category!,
  subtype: ing.subtype || null,
  color: ing.color!,
  abv: String(ing.abv || 0),
  pricePerLiter: String(ing.pricePerLiter || 0),
  tasteProfile: ing.tasteProfile!,
  unit: ing.unit!,
  sourceUrl: ing.sourceUrl || null,
  sourceName: ing.sourceName || null,
  sourceIcon: ing.sourceIcon || null,
  imageUrl: ing.imageUrl || null,
  volume: ing.volume || null
}));

// Sample glass types data
const sampleGlassTypes: InsertGlassType[] = [
  { name: "Шот", capacity: 50, shape: "shot" },
  { name: "Олд Фэшн", capacity: 300, shape: "old-fashioned" },
  { name: "Хайбол", capacity: 270, shape: "highball" },
  { name: "Коктейльная рюмка", capacity: 150, shape: "martini" },
  { name: "Маргарита", capacity: 250, shape: "margarita" },
  { name: "Харрикейн", capacity: 450, shape: "hurricane" },
  { name: "Тумблер", capacity: 300, shape: "tumbler" },
  { name: "Коньячный бокал", capacity: 350, shape: "snifter" },
  { name: "Фужер для шампанского", capacity: 170, shape: "champagne-flute" },
  { name: "Пивная кружка", capacity: 500, shape: "beer-mug" },
  { name: "Бокал для красного вина", capacity: 300, shape: "red-wine" },
  { name: "Бокал для белого вина", capacity: 260, shape: "white-wine" },
  { name: "Бокал сауэр", capacity: 120, shape: "sour" },
  { name: "Чаша для шампанского", capacity: 180, shape: "champagne-saucer" }
];

export async function seedDatabase() {
  try {
    if (!process.env.DATABASE_URL) {
      console.log("Running in memory storage mode - database seeding skipped (data preloaded in MemoryStorage)");
      return;
    }
    
    console.log("🌱 Seeding database with full ingredients data...");
    console.log(`📦 Total ingredients to seed: ${allIngredients.length}`);
    
    // Check if data already exists
    const existingIngredients = await db.select().from(ingredients).limit(1);
    const existingGlassTypes = await db.select().from(glassTypes).limit(1);
    
    if (existingIngredients.length === 0) {
      console.log("📥 Inserting ingredients...");
      // Insert in batches of 100 to avoid issues with large inserts
      const batchSize = 100;
      for (let i = 0; i < allIngredients.length; i += batchSize) {
        const batch = allIngredients.slice(i, i + batchSize);
        await db.insert(ingredients).values(batch);
        console.log(`  ✓ Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allIngredients.length/batchSize)} (${batch.length} items)`);
      }
      console.log(`✅ Inserted ${allIngredients.length} ingredients`);
    } else {
      console.log(`⏭️  Ingredients already exist (${existingIngredients.length}+ found), skipping...`);
    }
    
    if (existingGlassTypes.length === 0) {
      console.log("📥 Inserting glass types...");
      await db.insert(glassTypes).values(sampleGlassTypes);
      console.log(`✅ Inserted ${sampleGlassTypes.length} glass types`);
    } else {
      console.log("⏭️  Glass types already exist, skipping...");
    }
    
    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Force re-seed function (clears and repopulates ingredients)
export async function forceSeedIngredients() {
  if (!process.env.DATABASE_URL) {
    console.log("No DATABASE_URL - cannot force seed");
    return;
  }
  
  console.log("🔄 Force re-seeding ingredients...");
  
  // Delete all existing ingredients
  await db.delete(ingredients);
  console.log("🗑️  Cleared existing ingredients");
  
  // Insert all ingredients in batches
  const batchSize = 100;
  for (let i = 0; i < allIngredients.length; i += batchSize) {
    const batch = allIngredients.slice(i, i + batchSize);
    await db.insert(ingredients).values(batch);
    console.log(`  ✓ Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allIngredients.length/batchSize)}`);
  }
  
  console.log(`✅ Force seeded ${allIngredients.length} ingredients!`);
}

// Run seed if this file is called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}