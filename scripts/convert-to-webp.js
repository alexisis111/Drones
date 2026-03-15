// Скрипт для конвертации изображений в формат WebP
// Запуск: node scripts/convert-to-webp.js

import sharp from 'sharp';
import { globby } from 'globby';
import { dirname, extname, join } from 'path';
import { mkdir, rm, stat } from 'fs/promises';
import { existsSync } from 'fs';

const PUBLIC_DIR = 'public';
const IMG_PATTERNS = [
  `${PUBLIC_DIR}/img/**/*.jpg`,
  `${PUBLIC_DIR}/img/**/*.jpeg`,
  `${PUBLIC_DIR}/img/**/*.png`,
  `${PUBLIC_DIR}/*.jpg`,
  `${PUBLIC_DIR}/*.jpeg`,
  `${PUBLIC_DIR}/*.png`,
];

async function getFileSize(filePath) {
  const stats = await stat(filePath);
  return stats.size;
}

async function convertToWebP() {
  console.log('🔍 Поиск изображений для конвертации...\n');

  const files = await globby(IMG_PATTERNS, { ignore: ['**/*.webp'] });
  
  if (files.length === 0) {
    console.log('✅ Изображения для конвертации не найдены');
    return;
  }

  console.log(`📁 Найдено ${files.length} изображений:\n`);
  
  let converted = 0;
  let errors = 0;
  let totalSavings = 0;

  for (const file of files) {
    const outputPath = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    // Skip if original is already newer
    if (existsSync(outputPath)) {
      const inputStat = await stat(file);
      const outputStat = await stat(outputPath);
      
      if (inputStat.mtimeMs < outputStat.mtimeMs) {
        console.log(`⏭️  Пропущено: ${file} (WebP актуален)`);
        continue;
      }
    }

    try {
      // Ensure output directory exists
      const outputDir = dirname(outputPath);
      if (!existsSync(outputDir)) {
        await mkdir(outputDir, { recursive: true });
      }

      // Get input size
      const inputSize = await getFileSize(file);

      // Convert to WebP
      await sharp(file)
        .webp({ 
          quality: 85,
          effort: 6 // Максимальное сжатие (0-6)
        })
        .toFile(outputPath);

      // Get output size
      const outputSize = await getFileSize(outputPath);
      const savings = ((inputSize - outputSize) / inputSize * 100).toFixed(1);
      totalSavings += (inputSize - outputSize);

      console.log(`✅ ${file}`);
      console.log(`   → ${outputPath}`);
      console.log(`   📉 ${(inputSize / 1024).toFixed(1)} KB → ${(outputSize / 1024).toFixed(1)} KB (-${savings}%)\n`);

      converted++;
    } catch (error) {
      console.error(`❌ Ошибка при конвертации ${file}:`, error.message);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Результаты:`);
  console.log(`   ✅ Конвертировано: ${converted}`);
  console.log(`   ❌ Ошибок: ${errors}`);
  console.log(`   📁 Всего: ${files.length}`);
  console.log(`   💾 Экономия: ${(totalSavings / 1024 / 1024).toFixed(2)} MB`);
  console.log('='.repeat(50));
}

// Запуск конвертации
convertToWebP().catch(console.error);
