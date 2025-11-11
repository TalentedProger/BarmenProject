// Удаляем все imageUrl из фруктов
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../client/src/lib/pyaterochka-fruits.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Удаляем все строки с imageUrl (включая запятую перед ними)
content = content.replace(/,\s*\n\s*imageUrl:.*$/gm, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Все imageUrl удалены из фруктов!');
