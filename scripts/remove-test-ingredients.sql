-- Remove test ingredients from database
-- This script removes:
-- 1. All ingredients in 'mixer' category
-- 2. Test ingredients by name

BEGIN;

-- Step 1: Remove all mixer category ingredients
DELETE FROM ingredients WHERE category = 'mixer';

-- Step 2: Remove specific test ingredients by name
DELETE FROM ingredients WHERE name IN (
  'Ананасовый сок',
  'Апельсиновый сок',
  'Грейпфрутовый сок',
  'Имбирное пиво',
  'Кока-кола',
  'Содовая',
  'Тоник',
  'Ангостура'
);

-- Show remaining ingredients count
SELECT 
  category, 
  COUNT(*) as count 
FROM ingredients 
GROUP BY category 
ORDER BY count DESC;

COMMIT;

-- To run this script:
-- sqlite3 dev.db < scripts/remove-test-ingredients.sql
