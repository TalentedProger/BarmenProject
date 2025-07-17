import { db } from "./db";
import { ingredients, glassTypes } from "@shared/schema";
import { InsertIngredient, InsertGlassType } from "@shared/schema";

// Sample ingredients data
const sampleIngredients: InsertIngredient[] = [
  // Alcohol
  { name: "Водка", category: "alcohol", color: "#ffffff", abv: "40", pricePerLiter: "1500", tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 10 }, unit: "ml" },
  { name: "Джин", category: "alcohol", color: "#f0f0f0", abv: "40", pricePerLiter: "2000", tasteProfile: { sweet: 0, sour: 0, bitter: 2, alcohol: 10 }, unit: "ml" },
  { name: "Ром", category: "alcohol", color: "#d4af37", abv: "40", pricePerLiter: "1800", tasteProfile: { sweet: 3, sour: 0, bitter: 0, alcohol: 10 }, unit: "ml" },
  { name: "Текила", category: "alcohol", color: "#f5f5dc", abv: "40", pricePerLiter: "2200", tasteProfile: { sweet: 0, sour: 1, bitter: 1, alcohol: 10 }, unit: "ml" },
  { name: "Виски", category: "alcohol", color: "#b8860b", abv: "40", pricePerLiter: "3000", tasteProfile: { sweet: 1, sour: 0, bitter: 3, alcohol: 10 }, unit: "ml" },
  { name: "Кокосовый ликер", category: "alcohol", color: "#f8f8ff", abv: "21", pricePerLiter: "1200", tasteProfile: { sweet: 8, sour: 0, bitter: 0, alcohol: 6 }, unit: "ml" },
  
  // Juices
  { name: "Апельсиновый сок", category: "juice", color: "#ffa500", abv: "0", pricePerLiter: "200", tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml" },
  { name: "Лимонный сок", category: "juice", color: "#fff700", abv: "0", pricePerLiter: "300", tasteProfile: { sweet: 1, sour: 9, bitter: 0, alcohol: 0 }, unit: "ml" },
  { name: "Лаймовый сок", category: "juice", color: "#32cd32", abv: "0", pricePerLiter: "350", tasteProfile: { sweet: 1, sour: 8, bitter: 0, alcohol: 0 }, unit: "ml" },
  { name: "Клюквенный сок", category: "juice", color: "#dc143c", abv: "0", pricePerLiter: "400", tasteProfile: { sweet: 5, sour: 6, bitter: 1, alcohol: 0 }, unit: "ml" },
  { name: "Ананасовый сок", category: "juice", color: "#ffff00", abv: "0", pricePerLiter: "250", tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml" },
  
  // Syrups
  { name: "Сахарный сироп", category: "syrup", color: "#ffffff", abv: "0", pricePerLiter: "150", tasteProfile: { sweet: 10, sour: 0, bitter: 0, alcohol: 0 }, unit: "ml" },
  { name: "Гренадин", category: "syrup", color: "#ff0000", abv: "0", pricePerLiter: "300", tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 }, unit: "ml" },
  { name: "Кленовый сироп", category: "syrup", color: "#d2691e", abv: "0", pricePerLiter: "800", tasteProfile: { sweet: 9, sour: 0, bitter: 0, alcohol: 0 }, unit: "ml" },
  
  // Fruits
  { name: "Лимон", category: "fruit", color: "#fff700", abv: "0", pricePerLiter: "100", tasteProfile: { sweet: 1, sour: 8, bitter: 1, alcohol: 0 }, unit: "piece" },
  { name: "Лайм", category: "fruit", color: "#32cd32", abv: "0", pricePerLiter: "120", tasteProfile: { sweet: 1, sour: 7, bitter: 0, alcohol: 0 }, unit: "piece" },
  { name: "Апельсин", category: "fruit", color: "#ffa500", abv: "0", pricePerLiter: "80", tasteProfile: { sweet: 6, sour: 3, bitter: 0, alcohol: 0 }, unit: "piece" },
  { name: "Вишня", category: "fruit", color: "#dc143c", abv: "0", pricePerLiter: "200", tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 }, unit: "piece" },
  
  // Ice
  { name: "Лед", category: "ice", color: "#e6f3ff", abv: "0", pricePerLiter: "50", tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 0 }, unit: "ml" },
  
  // Spices
  { name: "Мята", category: "spice", color: "#90ee90", abv: "0", pricePerLiter: "500", tasteProfile: { sweet: 0, sour: 0, bitter: 3, alcohol: 0 }, unit: "piece" },
  { name: "Соль", category: "spice", color: "#ffffff", abv: "0", pricePerLiter: "100", tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 0 }, unit: "g" },
];

// Sample glass types data
const sampleGlassTypes: InsertGlassType[] = [
  { name: "Олд-фэшн", capacity: 300, shape: "old-fashioned" },
  { name: "Хайбол", capacity: 350, shape: "highball" },
  { name: "Мартини", capacity: 180, shape: "martini" },
  { name: "Шот", capacity: 50, shape: "shot" },
  { name: "Коллинз", capacity: 400, shape: "collins" },
  { name: "Купе", capacity: 200, shape: "coupe" },
  { name: "Винный бокал", capacity: 250, shape: "wine" },
  { name: "Пивная кружка", capacity: 500, shape: "beer" },
];

export async function seedDatabase() {
  try {
    console.log("Seeding database...");
    
    // Check if data already exists
    const existingIngredients = await db.select().from(ingredients).limit(1);
    const existingGlassTypes = await db.select().from(glassTypes).limit(1);
    
    if (existingIngredients.length === 0) {
      console.log("Inserting ingredients...");
      await db.insert(ingredients).values(sampleIngredients);
    }
    
    if (existingGlassTypes.length === 0) {
      console.log("Inserting glass types...");
      await db.insert(glassTypes).values(sampleGlassTypes);
    }
    
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}