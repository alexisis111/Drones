// Скрипт для генерации списка URL страниц услуг для пререндера
// Запускается перед сборкой через node scripts/generate-prerender-urls.js

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Импортируем услуги
const servicesPath = join(rootDir, 'app', 'data', 'services.ts');
const servicesContent = readFileSync(servicesPath, 'utf-8');

// Парсим slug из services.ts
const slugMatches = servicesContent.matchAll(/slug:\s*["']([^"']+)["']/g);
const slugs = [...slugMatches].map(m => m[1]);

// Генерируем конфиг
const prerenderUrls = [
  '/',
  '/drone-defense',
  '/services',
  '/contacts',
  '/company',
  '/portfolio',
  '/vacancies',
  ...slugs.map(slug => `/service/${slug}`)
];

// Записываем JSON файл для использования в react-router.config.ts
const outputPath = join(rootDir, 'prerender-urls.json');
writeFileSync(outputPath, JSON.stringify(prerenderUrls, null, 2), 'utf-8');

console.log(`✅ Сгенерировано ${prerenderUrls.length} URL для пререндера:`);
prerenderUrls.forEach(url => console.log(`   ${url}`));
console.log(`\n📁 Файл сохранён: ${outputPath}`);
