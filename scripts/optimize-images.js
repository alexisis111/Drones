// Скрипт для оптимизации критичных изображений
// Запуск: node scripts/optimize-images.js

import sharp from 'sharp';
import { stat, rename } from 'fs/promises';

async function optimizeImage(inputPath, maxWidth = 1920, quality = 80) {
  try {
    const metadata = await sharp(inputPath).metadata();
    const originalSize = (await stat(inputPath)).size;
    
    // Calculate new dimensions
    const newWidth = Math.min(metadata.width, maxWidth);
    const newHeight = Math.round((metadata.height / metadata.width) * newWidth);
    
    // Optimize
    const outputPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    await sharp(inputPath)
      .resize(newWidth, newHeight, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality })
      .toFile(outputPath);
    
    const newSize = (await stat(outputPath)).size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${inputPath}`);
    console.log(`   📐 ${metadata.width}x${metadata.height} → ${newWidth}x${newHeight}`);
    console.log(`   📉 ${(originalSize / 1024).toFixed(1)} KB → ${(newSize / 1024).toFixed(1)} KB (-${savings}%)\n`);
    
    return { original: originalSize, optimized: newSize };
  } catch (error) {
    console.error(`❌ ${inputPath}: ${error.message}\n`);
    return null;
  }
}

async function optimizeCriticalImages() {
  console.log('🚀 Оптимизация критичных изображений...\n');
  
  const criticalImages = [
    // Hero image (главный экран)
    { path: 'public/img/homesImg/home.jpeg', maxWidth: 1200, quality: 75 },
    
    // Background images
    { path: 'public/img/homesImg/about_comp.jpeg', maxWidth: 1200, quality: 75 },
    { path: 'public/img/homesImg/contacts.jpeg', maxWidth: 1200, quality: 75 },
    { path: 'public/img/homesImg/portfolio.jpeg', maxWidth: 1200, quality: 75 },
    { path: 'public/img/homesImg/services.jpeg', maxWidth: 1200, quality: 75 },
    { path: 'public/img/homesImg/vacancy.jpeg', maxWidth: 1200, quality: 75 },
    
    // Portfolio images
    { path: 'public/img/portfolio/img1.jpeg', maxWidth: 800, quality: 75 },
    { path: 'public/img/portfolio/img2.jpeg', maxWidth: 800, quality: 75 },
    { path: 'public/img/portfolio/img3.jpeg', maxWidth: 800, quality: 75 },
    { path: 'public/img/portfolio/img4.jpeg', maxWidth: 800, quality: 75 },
    { path: 'public/img/portfolio/img5.jpeg', maxWidth: 800, quality: 75 },
    { path: 'public/img/portfolio/img6.jpeg', maxWidth: 800, quality: 75 },
    { path: 'public/img/portfolio/img7.jpeg', maxWidth: 800, quality: 75 },
    { path: 'public/img/portfolio/img9.jpeg', maxWidth: 800, quality: 75 },
    
    // Service images
    { path: 'public/img/services/img1.jpeg', maxWidth: 600, quality: 75 },
    { path: 'public/img/services/img2.jpeg', maxWidth: 600, quality: 75 },
    { path: 'public/img/services/img3.jpeg', maxWidth: 600, quality: 75 },
    { path: 'public/img/services/img4.jpeg', maxWidth: 600, quality: 75 },
    { path: 'public/img/services/img5.jpeg', maxWidth: 600, quality: 75 },
    { path: 'public/img/services/img6.jpeg', maxWidth: 600, quality: 75 },
    { path: 'public/img/services/img7.jpeg', maxWidth: 600, quality: 75 },
    { path: 'public/img/services/img8.jpeg', maxWidth: 600, quality: 75 },
    { path: 'public/img/services/img9.jpeg', maxWidth: 600, quality: 75 },
    { path: 'public/img/services/img10.jpeg', maxWidth: 600, quality: 75 },
    { path: 'public/img/services/img11.jpeg', maxWidth: 600, quality: 75 },
    { path: 'public/img/services/img12.jpeg', maxWidth: 600, quality: 75 },
    { path: 'public/img/services/img13.jpeg', maxWidth: 600, quality: 75 },
    { path: 'public/img/services/img14.jpeg', maxWidth: 600, quality: 75 },
    { path: 'public/img/services/img15.jpeg', maxWidth: 600, quality: 75 },
    { path: 'public/img/services/img16.jpeg', maxWidth: 600, quality: 75 },
    { path: 'public/img/services/img17.jpeg', maxWidth: 600, quality: 75 },
    { path: 'public/img/services/img18.jpeg', maxWidth: 600, quality: 75 },
    { path: 'public/img/services/img19.jpeg', maxWidth: 600, quality: 75 },
  ];
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  let optimizedCount = 0;
  
  for (const img of criticalImages) {
    const result = await optimizeImage(img.path, img.maxWidth, img.quality);
    if (result) {
      totalOriginal += result.original;
      totalOptimized += result.optimized;
      optimizedCount++;
    }
  }
  
  const totalSavings = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1);
  
  console.log('='.repeat(50));
  console.log(`📊 Итоги:`);
  console.log(`   ✅ Оптимизировано: ${optimizedCount}/${criticalImages.length}`);
  console.log(`   📉 ${(totalOriginal / 1024 / 1024).toFixed(2)} MB → ${(totalOptimized / 1024 / 1024).toFixed(2)} MB (-${totalSavings}%)`);
  console.log('='.repeat(50));
}

optimizeCriticalImages().catch(console.error);
