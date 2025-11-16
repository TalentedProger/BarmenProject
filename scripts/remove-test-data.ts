/**
 * Universal script to remove test ingredients
 * Works with the server's storage interface
 */

import { storage } from '../server/storage';

const TEST_INGREDIENT_NAMES = [
  // Test juices
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
  console.log("🗑️  Starting removal of test ingredients...\n");

  try {
    // Get all ingredients
    const allIngredients = await storage.getIngredients();
    console.log(`📊 Total ingredients before: ${allIngredients.length}\n`);

    // Step 1: Remove all mixer category ingredients
    console.log("Step 1: Removing 'mixer' category ingredients...");
    const mixerIngredients = allIngredients.filter(ing => ing.category === 'mixer');
    
    for (const ingredient of mixerIngredients) {
      try {
        await storage.deleteIngredient(ingredient.id);
        console.log(`✅ Removed mixer: ${ingredient.name}`);
      } catch (error) {
        console.log(`❌ Failed to remove ${ingredient.name}:`, error);
      }
    }
    console.log(`\n✅ Removed ${mixerIngredients.length} mixer ingredients\n`);

    // Step 2: Remove test ingredients by name
    console.log("Step 2: Removing test ingredients by name...");
    let removedCount = 0;

    for (const name of TEST_INGREDIENT_NAMES) {
      const ingredient = allIngredients.find(ing => ing.name === name);
      if (ingredient) {
        try {
          await storage.deleteIngredient(ingredient.id);
          console.log(`✅ Removed: ${name}`);
          removedCount++;
        } catch (error) {
          console.log(`❌ Failed to remove ${name}:`, error);
        }
      } else {
        console.log(`ℹ️  Not found: ${name}`);
      }
    }
    
    console.log(`\n✅ Removed ${removedCount} test ingredients by name\n`);

    // Step 3: Show final statistics
    const remainingIngredients = await storage.getIngredients();
    console.log("📊 Final Database Statistics:");
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
    console.error("❌ Error:", error);
    process.exit(1);
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
