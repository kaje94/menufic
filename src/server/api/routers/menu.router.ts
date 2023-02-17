import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { PrismaPromise } from "@prisma/client";

import { env } from "src/env/server.mjs";
import { createTRPCRouter, protectedProcedure } from "src/server/api/trpc";
import { imageKit } from "src/server/imageUtil";
import { id, menuInput, restaurantId } from "src/utils/validators";

export const menuRouter = createTRPCRouter({
    /** Create a new menu under a restaurant */
    create: protectedProcedure.input(menuInput.merge(restaurantId)).mutation(async ({ ctx, input }) => {
        const [count, lastMenuItem] = await ctx.prisma.$transaction([
            ctx.prisma.menu.count({ where: { restaurantId: input.restaurantId } }),
            ctx.prisma.menu.findFirst({
                orderBy: { position: "desc" },
                where: { restaurantId: input.restaurantId, userId: ctx.session.user.id },
            }),
        ]);

        /** Check whether the maximum number of menus per restaurant has been reached */
        if (count >= Number(env.NEXT_PUBLIC_MAX_MENUS_PER_RESTAURANT)) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Reached maximum number of menus per restaurant",
            });
        }

        return ctx.prisma.menu.create({
            data: {
                availableTime: input.availableTime,
                name: input.name,
                position: lastMenuItem ? lastMenuItem.position + 1 : 0,
                restaurantId: input.restaurantId,
                userId: ctx.session.user.id,
            },
        });
    }),

    /** Delete a restaurant menu along with all the categories, items and images belonging to it */
    delete: protectedProcedure.input(id).mutation(async ({ ctx, input }) => {
        const currentItem = await ctx.prisma.menu.findUniqueOrThrow({
            include: { categories: { include: { items: true } } },
            where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
        });

        const imagePaths: string[] = [];
        const promiseList = [];
        const transactions: PrismaPromise<unknown>[] = [];

        currentItem.categories.forEach((category) => {
            transactions.push(ctx.prisma.menuItem.deleteMany({ where: { categoryId: category.id } }));
            category.items.forEach((item) => {
                if (item.imageId) {
                    imagePaths.push(item.imageId);
                }
            });
        });

        transactions.push(ctx.prisma.category.deleteMany({ where: { menuId: input.id } }));

        transactions.push(
            ctx.prisma.menu.delete({ where: { id_userId: { id: input.id, userId: ctx.session.user.id } } })
        );

        if (imagePaths.length > 0) {
            promiseList.push(imageKit.bulkDeleteFiles(imagePaths));
            transactions.push(ctx.prisma.image.deleteMany({ where: { id: { in: imagePaths } } }));
        }

        await Promise.all([ctx.prisma.$transaction(transactions), promiseList]);

        return currentItem;
    }),

    /** Get all the menus belonging toa restaurant */
    getAll: protectedProcedure.input(restaurantId).query(({ ctx, input }) =>
        ctx.prisma.menu.findMany({
            orderBy: { position: "asc" },
            where: { restaurantId: input.restaurantId, userId: ctx.session.user.id },
        })
    ),

    /** Update the details of a restaurant menu */
    update: protectedProcedure.input(menuInput.merge(id)).mutation(async ({ ctx, input }) => {
        return ctx.prisma.menu.update({
            data: { availableTime: input.availableTime, name: input.name },
            where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
        });
    }),

    /** Update the position the menus of the restaurant */
    updatePosition: protectedProcedure
        .input(z.array(id.extend({ newPosition: z.number() })))
        .mutation(async ({ ctx, input }) =>
            ctx.prisma.$transaction(
                input.map((item) =>
                    ctx.prisma.menu.update({
                        data: { position: item.newPosition },
                        where: { id_userId: { id: item.id, userId: ctx.session.user.id } },
                    })
                )
            )
        ),
});
