import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME } from "@shared/const";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getCategories,
  getCategoryByZone,
  getCategoryById,
  getCartItems,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearUserCart,
  createOrder,
  getUserOrders,
  getOrderById,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  /**
   * Product procedures
   */
  products: router({
    list: publicProcedure
      .input(
        z.object({
          categoryId: z.number().optional(),
          color: z.string().optional(),
          occasion: z.string().optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        return await getProducts(input);
      }),

    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await getProductById(input);
      }),

    featured: publicProcedure
      .input(z.number().optional())
      .query(async ({ input }) => {
        return await getFeaturedProducts(input || 6);
      }),
  }),

  /**
   * Category procedures
   */
  categories: router({
    list: publicProcedure.query(async () => {
      return await getCategories();
    }),

    getByZone: publicProcedure
      .input(z.enum(["casual", "formal", "streetwear"]))
      .query(async ({ input }) => {
        return await getCategoryByZone(input);
      }),

    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await getCategoryById(input);
      }),
  }),

  /**
   * Cart procedures
   */
  cart: router({
    getItems: protectedProcedure.query(async ({ ctx }) => {
      const items = await getCartItems(ctx.user.id);
      
      // Enrich cart items with product details
      const enrichedItems = await Promise.all(
        items.map(async (item) => {
          const product = await getProductById(item.productId);
          return {
            ...item,
            product,
          };
        })
      );

      return enrichedItems;
    }),

    addItem: protectedProcedure
      .input(
        z.object({
          productId: z.number(),
          size: z.string(),
          quantity: z.number().default(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return await addToCart(ctx.user.id, input.productId, input.size, input.quantity);
      }),

    removeItem: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await removeFromCart(input);
      }),

    updateQuantity: protectedProcedure
      .input(
        z.object({
          cartItemId: z.number(),
          quantity: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        return await updateCartItemQuantity(input.cartItemId, input.quantity);
      }),

    clear: protectedProcedure.mutation(async ({ ctx }) => {
      return await clearUserCart(ctx.user.id);
    }),
  }),

  /**
   * Order procedures
   */
  orders: router({
    create: protectedProcedure
      .input(
        z.object({
          items: z.array(z.any()),
          totalPrice: z.number(),
          shippingAddress: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const order = await createOrder(
          ctx.user.id,
          input.totalPrice,
          input.items,
          input.shippingAddress
        );

        // Clear cart after order
        await clearUserCart(ctx.user.id);

        return order;
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserOrders(ctx.user.id);
    }),

    getById: protectedProcedure
      .input(z.number())
      .query(async ({ input, ctx }) => {
        const order = await getOrderById(input);
        
        // Verify order belongs to user
        if (order && order.userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        return order;
      }),
  }),
});

export type AppRouter = typeof appRouter;
