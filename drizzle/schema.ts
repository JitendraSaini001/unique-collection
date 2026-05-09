import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = sqliteTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("loginMethod"),
  role: text("role").default("user").notNull(), // "user" | "admin"
  createdAt: integer("createdAt", { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).defaultNow().notNull(),
  lastSignedIn: integer("lastSignedIn", { mode: 'timestamp' }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Product categories for the collection zones: Casual, Formal, Streetwear
 */
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  zone: text("zone").notNull(), // "casual" | "formal" | "streetwear"
  image: text("image"),
  createdAt: integer("createdAt", { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Products with detailed information including materials, colors, and stock
 */
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("categoryId").notNull().references(() => categories.id),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // Price in cents
  color: text("color").notNull(),
  material: text("material").notNull(), // "silk" | "denim" | "cotton" | "wool" | "linen" | "polyester"
  occasion: text("occasion").notNull(), // e.g., "casual", "formal", "party"
  sizes: text("sizes").notNull(), // JSON array: ["XS", "S", "M", "L", "XL"]
  stock: integer("stock").notNull().default(0),
  modelUrl: text("modelUrl"), // URL to GLTF/GLB 3D model
  imageUrl: text("imageUrl"), // Thumbnail image
  featured: integer("featured").notNull().default(0), // Boolean as int
  createdAt: integer("createdAt", { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Shopping cart items for authenticated users
 */
export const cartItems = sqliteTable("cartItems", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => users.id),
  productId: integer("productId").notNull().references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  size: text("size").notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).defaultNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

/**
 * Orders placed by users
 */
export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => users.id),
  totalPrice: integer("totalPrice").notNull(), // Total in cents
  status: text("status").default("pending").notNull(), // "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  items: text("items"), // JSON array of order items
  shippingAddress: text("shippingAddress"),
  createdAt: integer("createdAt", { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;