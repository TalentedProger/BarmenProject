// Скрипт для исправления цен фруктов
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../client/src/lib/pyaterochka-fruits.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Список всех цен которые нужно поправить (разделить на 10)
const prices = [
  { from: 'pricePerLiter: 179000', to: 'pricePerLiter: 17900' },
  { from: 'pricePerLiter: 169000', to: 'pricePerLiter: 16900' },
  { from: 'pricePerLiter: 149000', to: 'pricePerLiter: 14900' },
  { from: 'pricePerLiter: 219000', to: 'pricePerLiter: 21900' },
  { from: 'pricePerLiter: 249000', to: 'pricePerLiter: 24900' },
  { from: 'pricePerLiter: 649000', to: 'pricePerLiter: 64900' },
  { from: 'pricePerLiter: 195000', to: 'pricePerLiter: 19500' },
  { from: 'pricePerLiter: 199000', to: 'pricePerLiter: 19900' },
  { from: 'pricePerLiter: 189000', to: 'pricePerLiter: 18900' },
  { from: 'pricePerLiter: 229000', to: 'pricePerLiter: 22900' },
  { from: 'pricePerLiter: 399000', to: 'pricePerLiter: 39900' },
  { from: 'pricePerLiter: 1592000', to: 'pricePerLiter: 159200' },
  { from: 'pricePerLiter: 1995000', to: 'pricePerLiter: 199500' },
  { from: 'pricePerLiter: 2660000', to: 'pricePerLiter: 266000' },
  { from: 'pricePerLiter: 479000', to: 'pricePerLiter: 47900' },
  { from: 'pricePerLiter: 129000', to: 'pricePerLiter: 12900' },
  { from: 'pricePerLiter: 139000', to: 'pricePerLiter: 13900' },
  { from: 'pricePerLiter: 469000', to: 'pricePerLiter: 46900' },
  { from: 'pricePerLiter: 279000', to: 'pricePerLiter: 27900' },
  { from: 'pricePerLiter: 135000', to: 'pricePerLiter: 13500' },
  { from: 'pricePerLiter: 369000', to: 'pricePerLiter: 36900' },
  { from: 'pricePerLiter: 319000', to: 'pricePerLiter: 31900' },
  { from: 'pricePerLiter: 239000', to: 'pricePerLiter: 23900' },
];

prices.forEach(({ from, to }) => {
  content = content.replace(new RegExp(from, 'g'), to);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Цены фруктов исправлены!');
