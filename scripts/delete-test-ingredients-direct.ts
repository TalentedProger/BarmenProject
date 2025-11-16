import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', 'dev.db');

console.log(`🗑️  Connecting to database: ${dbPath}\n`);

const db = new Database(dbPath);

try {
  console.log("Step 1: Removing all 'mixer' category ingredients...");
  
  // Remove mixer ingredients
  const mixerStmt = db.prepare("DELETE FROM ingredients WHERE category = 'mixer'");
  const mixerResult = mixerStmt.run();
  console.log(`✅ Removed ${mixerResult.changes} mixer ingredients\n`);

  console.log("Step 2: Removing test ingredients by name...");
  
  // Test ingredient names to remove
  const testNames = [
    'Ананасовый сок',
    'Апельсиновый сок',
    'Грейпфрутовый сок',
    'Имбирное пиво',
    'Кока-кола',
    'Содовая',
    'Тоник',
    'Ангостура'
  ];

  let totalRemoved = 0;
  const deleteStmt = db.prepare("DELETE FROM ingredients WHERE name = ?");
  
  for (const name of testNames) {
    const result = deleteStmt.run(name);
    if (result.changes > 0) {
      console.log(`✅ Removed: ${name}`);
      totalRemoved += result.changes;
    } else {
      console.log(`ℹ️  Not found: ${name}`);
    }
  }
  
  console.log(`\n✅ Removed ${totalRemoved} test ingredients by name\n`);

  // Show statistics
  console.log("📊 Database Statistics:");
  const countStmt = db.prepare("SELECT COUNT(*) as count FROM ingredients");
  const totalCount = countStmt.get() as { count: number };
  console.log(`   Total remaining ingredients: ${totalCount.count}`);

  const categoryStmt = db.prepare(`
    SELECT category, COUNT(*) as count 
    FROM ingredients 
    GROUP BY category 
    ORDER BY count DESC
  `);
  const categories = categoryStmt.all() as { category: string; count: number }[];
  
  console.log("\n   Ingredients by category:");
  categories.forEach(({ category, count }) => {
    console.log(`   - ${category}: ${count}`);
  });

  console.log("\n✅ Test ingredients removal completed successfully!");

} catch (error) {
  console.error("❌ Error:", error);
  process.exit(1);
} finally {
  db.close();
}

console.log("\n🎉 Script completed!");
