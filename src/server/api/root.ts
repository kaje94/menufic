import { createTRPCRouter } from "./trpc";
import { restaurantRouter } from "./routers/restaurant.router";
import { menuRouter } from "./routers/menu.router";
import { categoryRouter } from "./routers/category.router";
import { menuItemRouter } from "./routers/menuItem.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
    restaurant: restaurantRouter,
    menu: menuRouter,
    category: categoryRouter,
    menuItem: menuItemRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
