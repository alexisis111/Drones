// Скрипт для скачивания шрифтов Inter с Google Fonts
// Запуск: node scripts/download-fonts.js

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';
import https from 'https';

const FONT_DIR = 'public/fonts/inter';

// URL для скачивания шрифтов Inter (woff2 format)
const fontFiles = [
  // Regular weights
  { url: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2', name: 'Inter-Regular.woff2', weight: '400' },
  { url: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKfAZ9hjp-Ek-_EeA.woff2', name: 'Inter-500.woff2', weight: '500' },
  { url: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hjp-Ek-_EeA.woff2', name: 'Inter-600.woff2', weight: '600' },
  { url: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfAZ9hjp-Ek-_EeA.woff2', name: 'Inter-700.woff2', weight: '700' },
  { url: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfAZ9hjp-Ek-_EeA.woff2', name: 'Inter-800.woff2', weight: '800' },
  { url: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2', name: 'Inter-400.woff2', weight: '400' },
  
  // Italic weights
  { url: 'https://fonts.gstatic.com/s/inter/v20/UcCM3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMTR2Yy5Gp8_-qA.woff2', name: 'Inter-500-italic.woff2', weight: '500', style: 'italic' },
  { url: 'https://fonts.gstatic.com/s/inter/v20/UcCM3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6YMTR2Yy5Gp8_-qA.woff2', name: 'Inter-600-italic.woff2', weight: '600', style: 'italic' },
  { url: 'https://fonts.gstatic.com/s/inter/v20/UcCM3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfYy5Gp8_-qA.woff2', name: 'Inter-700-italic.woff2', weight: '700', style: 'italic' },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    // Skip if already exists
    if (existsSync(dest)) {
      console.log(`⏭️  Пропущено: ${dest} (уже существует)`);
      resolve();
      return;
    }

    const file = writeFileSync(dest, '');
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        writeFileSync(dest, Buffer.concat(chunks));
        console.log(`✅ Скачано: ${dest}`);
        resolve();
      });
    }).on('error', reject);
  });
}

async function downloadFonts() {
  console.log('🔽 Скачивание шрифтов Inter...\n');
  
  // Ensure directory exists
  if (!existsSync(FONT_DIR)) {
    mkdirSync(FONT_DIR, { recursive: true });
  }

  // Download each font file
  for (const font of fontFiles) {
    const dest = `${FONT_DIR}/${font.name}`;
    try {
      await downloadFile(font.url, dest);
    } catch (error) {
      console.error(`❌ Ошибка при скачивании ${font.name}:`, error.message);
    }
  }

  console.log('\n✅ Шрифты скачаны!');
  console.log(`📁 Папка: ${FONT_DIR}`);
  console.log(`📊 Файлов: ${fontFiles.length}`);
}

downloadFonts().catch(console.error);
