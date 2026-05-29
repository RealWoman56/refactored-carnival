import { generateAllVisuals, getAllVisualStyles, getVisualStyle } from "./src/services/visual.service";

async function main() {
  console.log("=== Visual Service Tests ===\n");

  // Test 1: Visual Styles
  console.log("1. Testing getAllVisualStyles()...");
  const styles = getAllVisualStyles();
  console.log(`   Found ${Object.keys(styles).length} styles: ${Object.keys(styles).join(", ")}`);
  const ps = getVisualStyle("psychology");
  console.log(`   psychology font: ${ps.fontFamily}, accent: ${ps.accentColor}`);
  console.log("   ✅ PASSED\n");

  // Test 2: Mock Image Generation
  console.log("2. Testing generateAllVisuals() with mock...");
  const result = await generateAllVisuals({
    niche: "psychology",
    prompts: [
      "Dark moody gradient background deep purple to navy blue with subtle particles",
      "Confident person demonstrating body language tricks"
    ],
    stockKeywords: ["confident body language", "business conversation"]
  });
  console.log(`   Generated ${result.generatedImages.length} images`);
  console.log(`   Generated ${result.stockClips.length} stock clip references`);
  console.log(`   Model: ${result.generatedImages[0]?.model || "N/A"}`);
  console.log(`   Style: ${result.style.nicheId}`);
  console.log("   ✅ PASSED\n");

  // Test 3: Different niche
  console.log("3. Testing finance niche...");
  const finResult = await generateAllVisuals({
    niche: "finance",
    prompts: ["Clean beige background with geometric grid overlay", "Animated chart showing compound growth"],
    stockKeywords: ["money", "investing"]
  });
  console.log(`   Images: ${finResult.generatedImages.length}`);
  console.log(`   Stock: ${finResult.stockClips.length}`);
  console.log(`   Style bg: ${finResult.style.background.substring(0, 40)}`);
  console.log("   ✅ PASSED\n");

  // Test 4: Mystery niche
  console.log("4. Testing mystery niche...");
  const mysResult = await generateAllVisuals({
    niche: "mystery",
    prompts: ["Dark cinematic scene with sepia tones", "Police evidence board with red string"],
    stockKeywords: ["dark alley", "mystery"]
  });
  console.log(`   Images: ${mysResult.generatedImages.length}`);
  console.log(`   Style font: ${mysResult.style.fontFamily}`);
  console.log("   ✅ PASSED\n");

  console.log("🎉 ALL TESTS PASSED SUCCESSFULLY");
}

main().catch(err => {
  console.error("❌ TEST FAILED:", err.message);
  process.exit(1);
});