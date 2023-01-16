import { z } from "zod";
import { restaurantId, menuInput, id } from "src/utils/validators";
import { imageKit } from "src/server/imageUtil";
import { TRPCError } from "@trpc/server";
import { env } from "src/env/server.mjs";
import { createTRPCRouter, protectedProcedure } from "src/server/api/trpc";
import type { PrismaPromise } from "@prisma/client";

export const menuRouter = createTRPCRouter({
    create: protectedProcedure.input(menuInput.merge(restaurantId)).mutation(async ({ ctx, input }) => {
        const [count, lastMenuItem] = await ctx.prisma.$transaction([
            ctx.prisma.menu.count({ where: { restaurantId: input.restaurantId } }),
            ctx.prisma.menu.findFirst({
                where: { restaurantId: input.restaurantId, userId: ctx.session.user.id },
                orderBy: { position: "desc" },
            }),
        ]);
        if (count >= Number(env.NEXT_PUBLIC_MAX_MENUS_PER_RESTAURANT)) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Reached maximum number of menus per restaurant",
            });
        }

        return ctx.prisma.menu.create({
            data: {
                name: input.name,
                availableTime: input.availableTime,
                position: lastMenuItem ? lastMenuItem.position + 1 : 0,
                userId: ctx.session.user.id,
                restaurantId: input.restaurantId,
            },
        });
    }),
    update: protectedProcedure.input(menuInput.merge(id)).mutation(async ({ ctx, input }) => {
        return ctx.prisma.menu.update({
            data: { name: input.name, availableTime: input.availableTime },
            where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
        });
    }),
    delete: protectedProcedure.input(id).mutation(async ({ ctx, input }) => {
        const currentItem = await ctx.prisma.menu.findUniqueOrThrow({
            where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
            include: { categories: { include: { items: true } } },
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
    getAll: protectedProcedure.input(restaurantId).query(({ ctx, input }) =>
        ctx.prisma.menu.findMany({
            where: { restaurantId: input.restaurantId, userId: ctx.session.user.id },
            orderBy: { position: "asc" },
        })
    ),
});
