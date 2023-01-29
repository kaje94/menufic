import type { PrismaPromise } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { env } from "src/env/server.mjs";
import { createTRPCRouter, protectedProcedure } from "src/server/api/trpc";
import { imageKit } from "src/server/imageUtil";
import { categoryInput, id, menuId } from "src/utils/validators";

export const categoryRouter = createTRPCRouter({
    /** Create a new category under a menu of a restaurant */
    create: protectedProcedure.input(categoryInput.merge(menuId)).mutation(async ({ ctx, input }) => {
        const [count, lastCategoryItem] = await ctx.prisma.$transaction([
            ctx.prisma.category.count({ where: { menuId: input.menuId } }),
            ctx.prisma.category.findFirst({
                orderBy: { position: "desc" },
                where: { menuId: input.menuId, userId: ctx.session.user.id },
            }),
        ]);

        /** Check if the maximum number of categories per menu has been reached */
        if (count >= Number(env.NEXT_PUBLIC_MAX_CATEGORIES_PER_MENU)) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Reached maximum number of categories per menu",
            });
        }

        return ctx.prisma.category.create({
            data: {
                menuId: input.menuId,
                name: input.name,
                position: lastCategoryItem ? lastCategoryItem.position + 1 : 0,
                userId: ctx.session.user.id,
            },
            include: { items: { include: { image: true } } },
        });
    }),

    /** Delete the category of a menu along with the items and images related to it */
    delete: protectedProcedure.input(id).mutation(async ({ ctx, input }) => {
        const currentItem = await ctx.prisma.category.findUniqueOrThrow({
            include: { items: true },
            where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
        });
        const promiseList = [];
        const transactions: PrismaPromise<unknown>[] = [];
        const imagePaths: string[] = [];

        currentItem.items?.forEach((item) => {
            if (item.imageId) {
                imagePaths.push(item.imageId);
            }
        });

        transactions.push(ctx.prisma.menuItem.deleteMany({ where: { categoryId: input.id } }));

        transactions.push(
            ctx.prisma.category.delete({ where: { id_userId: { id: input.id, userId: ctx.session.user.id } } })
        );

        if (imagePaths.length > 0) {
            promiseList.push(imageKit.bulkDeleteFiles(imagePaths));
            transactions.push(ctx.prisma.image.deleteMany({ where: { id: { in: imagePaths } } }));
        }

        await Promise.all([ctx.prisma.$transaction(transactions), promiseList]);

        return currentItem;
    }),

    /** Get all categories belonging to a restaurant menu along with the items and images related to it. */
    getAll: protectedProcedure.input(menuId).query(({ ctx, input }) =>
        ctx.prisma.category.findMany({
            include: { items: { include: { image: true }, orderBy: { position: "asc" } } },
            orderBy: { position: "asc" },
            where: { menuId: input.menuId, userId: ctx.session.user.id },
        })
    ),

    /** Update the details of a menu category */
    update: protectedProcedure.input(categoryInput.merge(id)).mutation(async ({ ctx, input }) => {
        return ctx.prisma.category.update({
            data: { name: input.name },
            where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
        });
    }),

    /** Update the position of the categories within a restaurant menu */
    updatePosition: protectedProcedure
        .input(z.array(id.extend({ newPosition: z.number() })))
        .mutation(async ({ ctx, input }) =>
            ctx.prisma.$transaction(
                input.map((item) =>
                    ctx.prisma.category.update({
                        data: { position: item.newPosition },
                        include: { items: { include: { image: true } } },
                        where: { id_userId: { id: item.id, userId: ctx.session.user.id } },
                    })
                )
            )
        ),
});
