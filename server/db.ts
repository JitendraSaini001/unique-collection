import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { InsertUser, users, products, categories, cartItems, orders } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const sqlite = new Database(process.env.DATABASE_URL);
      _db = drizzle(sqlite);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Product queries
 */
export async function getProducts(filters?: {
  categoryId?: number;
  color?: string;
  occasion?: string;
}) {
  const db = await getDb();
  if (!db) return [];

  let conditions = [];
  
  if (filters?.categoryId) {
    conditions.push(eq(products.categoryId, filters.categoryId));
  }
  if (filters?.color) {
    conditions.push(eq(products.color, filters.color));
  }
  if (filters?.occasion) {
    conditions.push(eq(products.occasion, filters.occasion));
  }

  const query = conditions.length > 0 
    ? db.select().from(products).where(and(...conditions))
    : db.select().from(products);

  return await query;
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getFeaturedProducts(limit: number = 6) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(products).where(eq(products.featured, 1)).limit(limit);
}

/**
 * Category queries
 */
export async function getCategories() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(categories);
}

export async function getCategoryByZone(zone: "casual" | "formal" | "streetwear") {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(categories).where(eq(categories.zone, zone)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Cart queries
 */
export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
}

export async function addToCart(userId: number, productId: number, size: string, quantity: number = 1) {
  const db = await getDb();
  if (!db) return undefined;

  return await db.insert(cartItems).values({
    userId,
    productId,
    size,
    quantity,
  });
}

export async function removeFromCart(cartItemId: number) {
  const db = await getDb();
  if (!db) return undefined;

  return await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
}

export async function updateCartItemQuantity(cartItemId: number, quantity: number) {
  const db = await getDb();
  if (!db) return undefined;

  return await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, cartItemId));
}

export async function clearUserCart(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  return await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

/**
 * Order queries
 */
export async function createOrder(userId: number, totalPrice: number, items: unknown, shippingAddress: string) {
  const db = await getDb();
  if (!db) return undefined;

  return await db.insert(orders).values({
    userId,
    totalPrice,
    items: JSON.stringify(items),
    shippingAddress,
  });
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(orders).where(eq(orders.userId, userId));
}

export async function getOrderById(orderId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
