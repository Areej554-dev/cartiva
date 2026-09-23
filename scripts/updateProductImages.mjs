import mongoose from "mongoose";
import Product from "../models/Product.js";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/cartiva";

// =========================================
// EXACT PRODUCT → IMAGE MAPPING
// =========================================

const imageMap = {
  // CLOTHING
  "Classic Linen Shirt":
    "classic-linen-shirt.png",

  "Relaxed Cotton T-Shirt":
    "relaxed-cotton-tshirt.png",

  "Oversized Casual Hoodie":
    "oversized-casual-hoodie.png",

  "Tailored Blazer":
    "tailored-blazer.png",

  "Wide Leg Trousers":
    "wide-leg-trouser.png",

  "Classic Knit Cardigan":
    "classic-knit-cardigan.png",

  // SHOES
  "Running Sneakers":
    "running-sneakers.png",

  "Urban Runner Sneakers":
    "urban-runner-sneakers.png",

  "Classic White Sneakers":
    "classic-white-sneakers.png",

  "Leather Chelsea Boots":
    "leather-chelsea-boots.png",

  "Everyday Canvas Sneakers":
    "everyday-canvas-sneakers.png",

  "Minimal Slip-On Shoes":
    "minimal-slip-on-shoes.png",

  // BAGS
  "Premium Backpack":
    "premium-backpack.png",

  "Travel Backpack":
    "travel-backpack.png",

  "Leather Bag":
    "leather-bag.png",

  "Classic Crossbody Bag":
    "crossbody-bag.png",

  "Structured Leather Tote":
    "leather-tote.png",

  "Travel Weekender Bag":
    "travel-weekender-bag.png",

  "Minimal Shoulder Bag":
    "minimal-shoulder-bag.png",

  "Compact Evening Clutch":
    "compact-evening-clutch.png",

  // WATCHES
  "Classic Watch":
    "Watches.png",

  "Minimal Steel Watch":
    "minimal-steel-watch.png",

  "Classic Leather Watch":
    "classic-leather-watch.png",

  "Modern Chronograph":
    "modern-chronograph.png",

  "Everyday Mesh Watch":
    "mesh-watch.png",

  "Rose Detail Watch":
    "rose-detail-watch.png",

  "Classic Black Dial Watch":
    "black-dial-watch.png",

  // ACCESSORIES
  "Leather Wallet":
    "leather-wallet.png",

  "Classic Card Holder":
    "classic-card-holder.png",

  "Classic Sunglasses":
    "classic-sunglasses.png",

  "Minimal Belt":
    "minimal-belt.png",

  "Silk Finish Scarf":
    "silk-finish-scarf.png",

  "Everyday Cap":
    "everyday-cap.png",

  // BEAUTY
  "Hydrating Face Moisturizer":
    "hydrating-face-moisturizer.png",

  "Gentle Facial Cleanser":
    "facial-cleanser.png",

  "Nourishing Lip Care":
    "nourishing-lip-care.png",

  "Daily Glow Serum":
    "daily-glow-serum.png",

  "Rose Body Mist":
    "rose-body-mist.png",

  "Velvet Hand Cream":
    "velvet-hand-cream.png",

  // OTHER EXISTING PRODUCT
  "Nike Air Max":
    "nike-air-max.png",

  "T-Shirt":
    "t-shirt.png",
};

// =========================================
// UPDATE
// =========================================

async function updateProductImages() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected.");
    console.log("");

    let updated = 0;
    let notFound = 0;

    for (const [productName, filename] of Object.entries(
      imageMap
    )) {
      const product = await Product.findOne({
        name: productName,
      });

      if (!product) {
        console.log(
          `PRODUCT NOT FOUND IN DB: ${productName}`
        );
        notFound++;
        continue;
      }

      const imagePath = `/products/${filename}`;

      product.image = imagePath;

      await product.save();

      console.log(
        `UPDATED: ${productName} → ${imagePath}`
      );

      updated++;
    }

    console.log("");
    console.log(
      "========================================"
    );
    console.log(
      "PRODUCT IMAGE UPDATE COMPLETE"
    );
    console.log(
      "========================================"
    );
    console.log(`Updated: ${updated}`);
    console.log(
      `Products not found: ${notFound}`
    );
    console.log(
      `Mappings: ${Object.keys(imageMap).length}`
    );
    console.log(
      "========================================"
    );
  } catch (error) {
    console.error(
      "IMAGE UPDATE ERROR:",
      error
    );

    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
}

updateProductImages();