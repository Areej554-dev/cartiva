import mongoose from "mongoose";

const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb://localhost:27017/cartiva";

const products = [
    // =========================================
    // CLOTHING
    // =========================================

    {
        name: "Classic Linen Shirt",
        category: "Clothing",
        price: 39.99,
        description:
            "A lightweight linen shirt designed for effortless everyday style.",
        stock: 18,
    },
    {
        name: "Relaxed Cotton T-Shirt",
        category: "Clothing",
        price: 24.99,
        description:
            "A comfortable cotton t-shirt with a clean relaxed fit.",
        stock: 25,
    },
    {
        name: "Oversized Casual Hoodie",
        category: "Clothing",
        price: 49.99,
        description:
            "A soft oversized hoodie made for comfortable everyday wear.",
        stock: 14,
    },
    {
        name: "Tailored Blazer",
        category: "Clothing",
        price: 89.99,
        description:
            "A refined tailored blazer that works for both smart and casual outfits.",
        stock: 8,
    },
    {
        name: "Wide Leg Trousers",
        category: "Clothing",
        price: 54.99,
        description:
            "Modern wide-leg trousers with an elegant and versatile silhouette.",
        stock: 12,
    },
    {
        name: "Classic Knit Cardigan",
        category: "Clothing",
        price: 59.99,
        description:
            "A timeless knit cardigan perfect for layering through the seasons.",
        stock: 10,
    },

    // =========================================
    // SHOES
    // =========================================

    {
        name: "Urban Runner Sneakers",
        category: "Shoes",
        price: 79.99,
        description:
            "Lightweight everyday sneakers designed for comfort and movement.",
        stock: 16,
    },
    {
        name: "Classic White Sneakers",
        category: "Shoes",
        price: 69.99,
        description:
            "Minimal white sneakers that pair easily with almost any outfit.",
        stock: 22,
    },
    {
        name: "Leather Chelsea Boots",
        category: "Shoes",
        price: 109.99,
        description:
            "Classic leather Chelsea boots with a sleek everyday silhouette.",
        stock: 7,
    },
    {
        name: "Everyday Canvas Sneakers",
        category: "Shoes",
        price: 44.99,
        description:
            "Simple canvas sneakers made for casual everyday styling.",
        stock: 20,
    },
    {
        name: "Minimal Slip-On Shoes",
        category: "Shoes",
        price: 54.99,
        description:
            "Clean slip-on shoes combining convenience with modern style.",
        stock: 13,
    },

    // =========================================
    // BAGS
    // =========================================

    {
        name: "Premium Backpack",
        category: "Bags",
        price: 74.99,
        description:
            "A spacious everyday backpack designed for work, travel, and study.",
        stock: 15,
    },
    {
        name: "Structured Leather Tote",
        category: "Bags",
        price: 94.99,
        description:
            "A structured tote with a polished look and generous everyday storage.",
        stock: 9,
    },
    {
        name: "Classic Crossbody Bag",
        category: "Bags",
        price: 49.99,
        description:
            "A compact crossbody bag for carrying your everyday essentials.",
        stock: 17,
    },
    {
        name: "Travel Weekender Bag",
        category: "Bags",
        price: 84.99,
        description:
            "A spacious weekender bag designed for short trips and getaways.",
        stock: 8,
    },
    {
        name: "Minimal Shoulder Bag",
        category: "Bags",
        price: 64.99,
        description:
            "A refined shoulder bag with a clean and minimal silhouette.",
        stock: 13,
    },
    {
        name: "Compact Evening Clutch",
        category: "Bags",
        price: 44.99,
        description:
            "A compact clutch designed to add an elegant finishing touch.",
        stock: 10,
    },

    // =========================================
    // WATCHES
    // =========================================

    {
        name: "Minimal Steel Watch",
        category: "Watches",
        price: 129.99,
        description:
            "A minimal steel watch with a timeless everyday design.",
        stock: 8,
    },
    {
        name: "Classic Leather Watch",
        category: "Watches",
        price: 99.99,
        description:
            "A classic leather-strap watch designed for understated elegance.",
        stock: 12,
    },
    {
        name: "Modern Chronograph",
        category: "Watches",
        price: 159.99,
        description:
            "A contemporary chronograph-inspired design with a bold presence.",
        stock: 6,
    },
    {
        name: "Everyday Mesh Watch",
        category: "Watches",
        price: 89.99,
        description:
            "A lightweight mesh watch combining clean design with versatility.",
        stock: 14,
    },
    {
        name: "Rose Detail Watch",
        category: "Watches",
        price: 119.99,
        description:
            "A refined watch featuring elegant rose-toned details.",
        stock: 9,
    },
    {
        name: "Classic Black Dial Watch",
        category: "Watches",
        price: 109.99,
        description:
            "A sophisticated black-dial watch with a timeless appearance.",
        stock: 11,
    },

    // =========================================
    // ACCESSORIES
    // =========================================

    {
        name: "Leather Wallet",
        category: "Accessories",
        price: 45.00,
        description:
            "A compact leather wallet with practical everyday storage.",
        stock: 18,
    },
    {
        name: "Classic Sunglasses",
        category: "Accessories",
        price: 34.99,
        description:
            "Classic sunglasses designed to complement everyday outfits.",
        stock: 20,
    },
    {
        name: "Minimal Belt",
        category: "Accessories",
        price: 29.99,
        description:
            "A clean and versatile belt designed for everyday styling.",
        stock: 16,
    },
    {
        name: "Silk Finish Scarf",
        category: "Accessories",
        price: 32.99,
        description:
            "A lightweight scarf that adds a refined finishing touch.",
        stock: 14,
    },
    {
        name: "Everyday Cap",
        category: "Accessories",
        price: 22.99,
        description:
            "A simple everyday cap with a clean modern silhouette.",
        stock: 24,
    },
    {
        name: "Classic Card Holder",
        category: "Accessories",
        price: 24.99,
        description:
            "A slim card holder designed for simple everyday carrying.",
        stock: 19,
    },

    // =========================================
    // BEAUTY
    // =========================================

    {
        name: "Hydrating Face Moisturizer",
        category: "Beauty",
        price: 28.99,
        description:
            "A lightweight daily moisturizer designed for a comfortable hydrated feel.",
        stock: 20,
    },
    {
        name: "Gentle Facial Cleanser",
        category: "Beauty",
        price: 22.99,
        description:
            "A gentle cleanser designed for a simple everyday skincare routine.",
        stock: 17,
    },
    {
        name: "Nourishing Lip Care",
        category: "Beauty",
        price: 12.99,
        description:
            "A nourishing lip care essential for daily moisture and comfort.",
        stock: 30,
    },
    {
        name: "Daily Glow Serum",
        category: "Beauty",
        price: 34.99,
        description:
            "A lightweight facial serum designed to complement a daily skincare routine.",
        stock: 13,
    },
    {
        name: "Rose Body Mist",
        category: "Beauty",
        price: 24.99,
        description:
            "A fresh floral body mist with a soft everyday fragrance.",
        stock: 16,
    },
    {
        name: "Velvet Hand Cream",
        category: "Beauty",
        price: 16.99,
        description:
            "A rich but lightweight hand cream for everyday care.",
        stock: 22,
    },
];

// =========================================
// IMPORT PRODUCT MODEL
// =========================================

import Product from "../models/Product.js";

// =========================================
// SEED DATABASE
// =========================================

async function seedProducts() {
    try {
        console.log("Connecting to MongoDB...");

        await mongoose.connect(MONGODB_URI);

        console.log("MongoDB connected.");

        let inserted = 0;
        let updated = 0;

        for (const product of products) {
            const result =
                await Product.updateOne(
                    {
                        name: product.name,
                        category: product.category,
                    },
                    {
                        $set: {
                            name: product.name,
                            category: product.category,
                            price: product.price,
                            description: product.description,
                            stock: product.stock,
                        },
                        $setOnInsert: {
                            image: "",
                        },
                    },
                    {
                        upsert: true,
                    }
                );

            if (result.upsertedCount > 0) {
                inserted++;
            } else {
                updated++;
            }
        }

        console.log("");
        console.log("=================================");
        console.log("Cartiva product seed completed");
        console.log("=================================");
        console.log(`New products: ${inserted}`);
        console.log(`Updated products: ${updated}`);
        console.log(`Total seed products: ${products.length}`);
        console.log("=================================");
        console.log("");
    } catch (error) {
        console.error(
            "PRODUCT SEED ERROR:",
            error
        );

        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");
    }
}

seedProducts();