import { db } from "../server/db";
import { ingredients } from "@shared/schema";
import { eq } from "drizzle-orm";

/**
 * Script to remove test/placeholder ingredients and mixer category
 * 
 * This removes:
 * 1. All ingredients in 'mixer' category
 * 2. Test ingredients like basic juices and sodas that were created for testing
 */

const TEST_INGREDIENT_NAMES = [
  // Test juices (basic/placeholder)
  "Ананасовый сок",
  "Апельсиновый сок",
  "Грейпфрутовый сок",
  
  // Test mixers/sodas  
  "Имбирное пиво",
  "Кока-кола",
  "Содовая",
  "Тоник",
  
  // Test bitters
  "Ангостура"
];

async function removeTestIngredients() {
  try {
    console.log("🗑️  Starting removal of test ingredients...\n");

    // Step 1: Remove all mixer category ingredients
    console.log("Step 1: Removing all 'mixer' category ingredients...");
    const mixerResult = await db
      .delete(ingredients)
      .where(eq(ingredients.category, "mixer"))
      .returning();
    
    console.log(`✅ Removed ${mixerResult.length} mixer ingredients:`);
    mixerResult.forEach(ing => console.log(`   - ${ing.name}`));
    console.log();

    // Step 2: Remove specific test ingredients by name
    console.log("Step 2: Removing test ingredients by name...");
    let totalRemoved = 0;
    
    for (const name of TEST_INGREDIENT_NAMES) {
      const result = await db
        .delete(ingredients)
        .where(eq(ingredients.name, name))
        .returning();
      
      if (result.length > 0) {
        console.log(`✅ Removed: ${name}`);
        totalRemoved += result.length;
      } else {
        console.log(`ℹ️  Not found (may be already removed): ${name}`);
      }
    }
    
    console.log(`\n✅ Removed ${totalRemoved} test ingredients by name`);
    
    // Step 3: Show statistics
    console.log("\n📊 Database Statistics:");
    const remainingIngredients = await db.select().from(ingredients);
    console.log(`   Total remaining ingredients: ${remainingIngredients.length}`);
    
    const categoryCounts = remainingIngredients.reduce((acc, ing) => {
      acc[ing.category] = (acc[ing.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log("\n   Ingredients by category:");
    Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`   - ${category}: ${count}`);
      });
    
    console.log("\n✅ Test ingredients removal completed successfully!");
    
  } catch (error) {
    console.error("❌ Error removing test ingredients:", error);
    throw error;
  }
}

// Run the script
removeTestIngredients()
  .then(() => {
    console.log("\n🎉 Script completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
