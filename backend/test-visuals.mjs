// Quick test script for Visual Asset Service
import { createServer } from 'http';

const PORT = 3099;

// Minimal Express-like server for testing visual service
async function run() {
  // Test that the module compiles
  const { generateAllVisuals, getAllVisualStyles, getVisualStyle } = await import('./src/services/visual.service.js');
  
  // Test VISUAL STYLES
  console.log('=== VISUAL STYLES ===');
  const styles = getAllVisualStyles();
  for (const [key, style] of Object.entries(styles)) {
    console.log(`  ${key}: font=${style.fontFamily}, accent=${style.accentColor}`);
  }
  
  // Test getVisualStyle
  const psychStyle = getVisualStyle('psychology');
  console.log(`\n  Psychology background: ${psychStyle.background.substring(0, 50)}`);
  
  // Test MOCK image generation
  console.log('\n=== GENERATE VISUALS (mock) ===');
  const result = await generateAllVisuals({
    niche: 'psychology',
    prompts: ['Dark moody gradient background deep purple to navy blue', 'Confident person body language'],
    stockKeywords: ['confident person', 'business meeting']
  });
  
  console.log(`  Niche: ${result.niche}`);
  console.log(`  Images generated: ${result.generatedImages.length}`);
  console.log(`  Stock clips: ${result.stockClips.length}`);
  console.log(`  Style: ${result.style.nicheId}`);
  
  for (const img of result.generatedImages) {
    console.log(`  - Image: ${img.imageUrl} (${img.model})`);
  }
  
  for (const clip of result.stockClips) {
    console.log(`  - Stock: ${clip.keywords.join(', ')} (${clip.source})`);
  }
  
  console.log('\n✅ ALL TESTS PASSED');
}

run().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});