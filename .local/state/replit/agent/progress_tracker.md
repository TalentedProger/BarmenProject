[x] 1. Install the required packages
[x] 2. Restart the workflow to see if the project is working
[x] 3. Verify the project is working using the feedback tool
[x] 4. Inform user the import is completed and they can start building, mark the import as completed using the complete_project_import tool
[x] 5. Updated generator page design as requested by user
[x] 6. Fixed volume management system in cocktail constructor
[x] 7. Implemented proper security practices and client/server separation
[x] 8. Fixed cocktail recipe detail page navigation - restored static Mojito page
[x] 9. Updated recipe page design:
  - Replaced background image with looping video (no sound)
  - Removed central photo container
  - Kept tags below title
  - Fixed "Пошаговый рецепт" heading positioning with proper margins
  - Fixed "Хорошее настроение" card text centering
  - Fixed jumping icons in "В избранное" and "Поделиться" buttons (added flex-shrink-0)
  - Made step cards square shape (aspect-square)
[x] 10. Reorganized recipe page layout:
  - Removed "Видео приготовления" section
  - Moved "Пошаговый рецепт" to the position of removed video section
  - Made step-by-step card compact to match "Что потребуется?" container dimensions
  - Removed "Посетить магазин" button from "Что потребуется?" section
[x] 11. Re-installed packages and restarted workflow successfully
[x] 12. Verified application is running correctly on port 5000
[x] 13. Confirmed frontend is displaying properly with all features working
[x] 14. Updated main page design:
  - Removed "Магазин барного инвентаря" and "Сообщество" cards from features section
  - Updated "Популярные рецепты коктейлей" heading - smaller font and neon turquoise color
  - Removed neon underline from popular recipes heading
  - Increased vertical spacing in newsletter section
  - Changed "Cocktailo — теперь" to "Cocktailo — скоро в твоём кармане"
  - Added modal dialog for App Store/Google Play buttons with development notice
[x] 15. Updated recipe page design:
  - Removed dark background from "Пошаговый рецепт" card (line 288: rounded-2xl p-6 h-full without bg-black/40)
  - Fixed vertical spacing to prevent overlap with "Анализ вкуса" heading (mb-8 on section line 267)
[x] 16. Code verification completed:
  - Landing page features: 4 cards confirmed (Martini, Dice2, BookOpen, GraduationCap)
  - Popular recipes heading: text-4xl text-[#00FFF0] confirmed (line 384)
  - Newsletter spacing: mb-16 confirmed (line 484)
  - Mobile app heading: "скоро в твоём кармане" confirmed (lines 554, 606)
  - Modal dialog: DialogTitle and DialogDescription for accessibility (lines 892-897)
  - Recipe page step card: Dark background removed, proper spacing added
  - Browser console: Clean, no accessibility warnings or errors