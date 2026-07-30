import { removeBackground } from '@imgly/background-removal-node';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processImages() {
  const publicDir = path.join(__dirname, 'public');
  
  const inputPath = path.join(publicDir, `pixel_hero.jpg`);
  const outputPath = path.join(publicDir, `pixel_hero.png`);
  
  if (fs.existsSync(inputPath)) {
    console.log(`Processing pixel_hero.jpg...`);
    try {
      const imageBuffer = fs.readFileSync(inputPath);
      const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
      
      const resultBlob = await removeBackground(blob);
      
      const resultBuffer = Buffer.from(await resultBlob.arrayBuffer());
      fs.writeFileSync(outputPath, resultBuffer);
      
      console.log(`Saved transparent PNG to pixel_hero.png`);
    } catch (err) {
      console.error(`Error processing pixel_hero.jpg:`, err);
    }
  }
}

processImages();
