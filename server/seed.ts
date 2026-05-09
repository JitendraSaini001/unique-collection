import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { categories, products } from "../drizzle/schema";
import { sql } from "drizzle-orm";

const sqlite = new Database(process.env.DATABASE_URL!);
const db = drizzle(sqlite);

const sampleCategories = [
  {
    name: "Casual Luxe",
    slug: "casual-luxe",
    description: "Effortless elegance for the modern woman",
    zone: "casual" as const,
    image: "/images/casual.png"
  },
  {
    name: "Midnight Formal",
    slug: "midnight-formal",
    description: "Exquisite evening wear for gala occasions",
    zone: "formal" as const,
    image: "/images/formal.png"
  },
  {
    name: "Urban Gold Streetwear",
    slug: "urban-gold-streetwear",
    description: "Bold urban aesthetics with premium gold accents",
    zone: "streetwear" as const,
    image: "/images/streetwear.png"
  },
];

const sampleProducts = [
  // ── Casual Luxe Collection (categoryId: 1) ──
  {
    categoryId: 1,
    name: "Obsidian Silk Wrap",
    description: "A luxurious silk wrap dress in deep obsidian, featuring delicate gold thread details, a flowing silhouette, and hand-finished seams for an unmistakable premium feel.",
    price: 18900,
    color: "Obsidian Black",
    material: "silk",
    occasion: "casual",
    sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
    stock: 15,
    featured: 1,
    imageUrl: "/images/casual_silk_wrap.png"
  },
  {
    categoryId: 1,
    name: "Gilded Cotton Essential Tee",
    description: "Premium extra-long staple cotton tee with subtle gold logo embroidery on chest. Relaxed oversized fit with dropped shoulders and superior drape.",
    price: 4500,
    color: "Off White",
    material: "cotton",
    occasion: "casual",
    sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
    stock: 40,
    featured: 1,
    imageUrl: "/images/casual_cotton_tee.png"
  },
  {
    categoryId: 1,
    name: "Ivory Linen Palazzo",
    description: "Wide-leg palazzo pants in fine European linen. Naturally cooling, beautifully textured, with a high-waisted silhouette and concealed side zip.",
    price: 7900,
    color: "Ivory",
    material: "linen",
    occasion: "casual",
    sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
    stock: 22,
    featured: 0,
    imageUrl: "/images/casual_linen_palazzo.png"
  },
  {
    categoryId: 1,
    name: "Rose Gold Knit Cardigan",
    description: "Soft premium merino wool cardigan in a warm rose gold hue. Relaxed fit with ribbed cuffs, oversized buttons, and a cozy yet refined aesthetic.",
    price: 8900,
    color: "Rose Gold",
    material: "wool",
    occasion: "casual",
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    stock: 18,
    featured: 0,
    imageUrl: "/images/casual_knit_cardigan.png"
  },
  {
    categoryId: 1,
    name: "Pearl Button Blouse",
    description: "Elegant cream silk-blend blouse with genuine pearl buttons. Features a mandarin collar, French cuffs, and a tailored yet feminine fit.",
    price: 6500,
    color: "Cream Pearl",
    material: "silk",
    occasion: "casual",
    sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
    stock: 28,
    featured: 1,
    imageUrl: "/images/casual_pearl_blouse.png"
  },

  // ── Midnight Formal Collection (categoryId: 2) ──
  {
    categoryId: 2,
    name: "Gilded Midnight Gown",
    description: "The crown jewel of our collection. A stunning midnight black floor-length gown with hand-stitched gold embroidery, a fitted bodice, and a dramatic train.",
    price: 89900,
    color: "Midnight Gold",
    material: "silk",
    occasion: "formal",
    sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
    stock: 5,
    featured: 1,
    imageUrl: "/images/midnight_gown.png"
  },
  {
    categoryId: 2,
    name: "Velvet Cocktail Dress",
    description: "Deep burgundy velvet cocktail dress with elegant draping, a sweetheart neckline, and knee-length cut. Perfect for evening soirées and gallery openings.",
    price: 34900,
    color: "Burgundy",
    material: "velvet",
    occasion: "formal",
    sizes: JSON.stringify(["XS", "S", "M", "L"]),
    stock: 12,
    featured: 1,
    imageUrl: "/images/formal_velvet_dress.png"
  },
  {
    categoryId: 2,
    name: "Sapphire Sequin Maxi",
    description: "Floor-length evening gown encrusted with sapphire blue sequins. Features a thigh-high slit, open back, and built-in boning for a sculpted silhouette.",
    price: 52900,
    color: "Sapphire Blue",
    material: "polyester",
    occasion: "formal",
    sizes: JSON.stringify(["XS", "S", "M", "L"]),
    stock: 8,
    featured: 0,
    imageUrl: "/images/formal_sequin_maxi.png"
  },
  {
    categoryId: 2,
    name: "Champagne Satin Blazer",
    description: "Tailored champagne gold satin blazer with peak lapels. A power-dressing essential that transitions seamlessly from boardroom to cocktail bar.",
    price: 24900,
    color: "Champagne Gold",
    material: "satin",
    occasion: "formal",
    sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
    stock: 16,
    featured: 0,
    imageUrl: "/images/formal_satin_blazer.png"
  },
  {
    categoryId: 2,
    name: "Embroidered Obsidian Lehenga",
    description: "A magnificent lehenga choli set with intricate gold zari embroidery on obsidian black fabric. Hand-embellished with 2000+ sequins for a show-stopping look.",
    price: 129900,
    color: "Obsidian & Gold",
    material: "silk",
    occasion: "formal",
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    stock: 3,
    featured: 1,
    imageUrl: "/images/formal_lehenga.png"
  },

  // ── Urban Gold Streetwear (categoryId: 3) ──
  {
    categoryId: 3,
    name: "Gold-Stitched Urban Hoodie",
    description: "Heavyweight 380gsm premium cotton hoodie with signature gold stitching, oversized fit, kangaroo pocket, and brushed fleece interior.",
    price: 8500,
    color: "Obsidian",
    material: "cotton",
    occasion: "streetwear",
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    stock: 30,
    featured: 1,
    imageUrl: "/images/streetwear.png"
  },
  {
    categoryId: 3,
    name: "Oversized Graphic Tee",
    description: "Limited edition oversized tee with exclusive gold abstract art print. 280gsm organic cotton, boxy fit, reinforced neck, and drop shoulders.",
    price: 3900,
    color: "Charcoal Black",
    material: "cotton",
    occasion: "streetwear",
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    stock: 45,
    featured: 0,
    imageUrl: "/images/street_graphic_tee.png"
  },
  {
    categoryId: 3,
    name: "Cargo Jogger Pants",
    description: "Black utility cargo joggers with gold zipper details, multiple pockets, elastic waist with drawstring, and tapered ankle cuffs for a clean street silhouette.",
    price: 6900,
    color: "Jet Black",
    material: "cotton",
    occasion: "streetwear",
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    stock: 25,
    featured: 1,
    imageUrl: "/images/street_cargo_jogger.png"
  },
  {
    categoryId: 3,
    name: "Cropped Bomber Jacket",
    description: "Black satin-finish cropped bomber with gold hardware, YKK zippers, ribbed cuffs and hem. Quilted lining for warmth. A streetwear staple.",
    price: 12500,
    color: "Obsidian Satin",
    material: "polyester",
    occasion: "streetwear",
    sizes: JSON.stringify(["XS", "S", "M", "L"]),
    stock: 14,
    featured: 1,
    imageUrl: "/images/street_bomber_jacket.png"
  },
  {
    categoryId: 3,
    name: "Statement Sneaker Dress",
    description: "Sporty mini dress with athletic mesh panels and gold accent piping. Pairs perfectly with chunky sneakers for an effortless athleisure look.",
    price: 5900,
    color: "Black & Gold",
    material: "polyester",
    occasion: "streetwear",
    sizes: JSON.stringify(["XS", "S", "M", "L"]),
    stock: 20,
    featured: 0,
    imageUrl: "/images/street_sneaker_dress.png"
  },
  {
    categoryId: 3,
    name: "Denim Trucker Jacket",
    description: "Oversized black denim trucker jacket with gold metal buttons, distressed wash details, chest pockets, and a relaxed boyfriend fit.",
    price: 9500,
    color: "Washed Black",
    material: "denim",
    occasion: "streetwear",
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    stock: 18,
    featured: 0,
    imageUrl: "/images/street_denim_jacket.png"
  },
];

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    // Clear existing data (products first to respect FK constraints)
    console.log("🗑️  Clearing existing data...");
    db.run(sql`PRAGMA foreign_keys = OFF`);
    db.run(sql`DELETE FROM products`);
    db.run(sql`DELETE FROM categories`);
    db.run(sql`DELETE FROM sqlite_sequence WHERE name='categories' OR name='products'`);
    db.run(sql`PRAGMA foreign_keys = ON`);

    // Insert categories
    console.log("📂 Inserting categories...");
    for (const category of sampleCategories) {
      await db.insert(categories).values(category);
    }
    console.log("✅ 3 Categories inserted");

    // Insert products
    console.log("📦 Inserting products...");
    for (const product of sampleProducts) {
      await db.insert(products).values(product);
    }
    console.log(`✅ ${sampleProducts.length} Products inserted`);

    console.log("🎉 Database seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
