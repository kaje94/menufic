import { z } from "zod";
import { categoryInput, menuId, id } from "src/utils/validators";
import { imageKit } from "src/server/imageUtil";
import { TRPCError } from "@trpc/server";
import { env } from "src/env/server.mjs";
import { createTRPCRouter, protectedProcedure } from "src/server/api/trpc";
import type { PrismaPromise } from "@prisma/client";

export const categoryRouter = createTRPCRouter({
    create: protectedProcedure.input(categoryInput.merge(menuId)).mutation(async ({ ctx, input }) => {
        const [count, lastCategoryItem] = await ctx.prisma.$transaction([
            ctx.prisma.category.count({ where: { menuId: input.menuId } }),
            ctx.prisma.category.findFirst({
                where: { menuId: input.menuId, userId: ctx.session.user.id },
                orderBy: { position: "desc" },
            }),
        ]);
        if (count >= Number(env.NEXT_PUBLIC_MAX_CATEGORIES_PER_MENU)) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Reached maximum number of categories per menu",
            });
        }

        return ctx.prisma.category.create({
            data: {
                name: input.name,
                position: lastCategoryItem ? lastCategoryItem.position + 1 : 0,
                userId: ctx.session.user.id,
                menuId: input.menuId,
            },
            include: { items: { include: { image: true } } },
        });
    }),
    update: protectedProcedure.input(categoryInput.merge(id)).mutation(async ({ ctx, input }) => {
        return ctx.prisma.category.update({
            data: { name: input.name },
            where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
        });
    }),
    delete: protectedProcedure.input(id).mutation(async ({ ctx, input }) => {
        const currentItem = await ctx.prisma.category.findUniqueOrThrow({
            where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
            include: { items: true },
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
    updatePosition: protectedProcedure
        .input(z.array(id.extend({ newPosition: z.number() })))
        .mutation(async ({ ctx, input }) =>
            ctx.prisma.$transaction(
                input.map((item) =>
                    ctx.prisma.category.update({
                        data: { position: item.newPosition },
                        where: { id_userId: { id: item.id, userId: ctx.session.user.id } },
                        include: { items: { include: { image: true } } },
                    })
                )
            )
        ),
    getAll: protectedProcedure.input(menuId).query(({ ctx, input }) =>
        ctx.prisma.category.findMany({
            where: { menuId: input.menuId, userId: ctx.session.user.id },
            orderBy: { position: "asc" },
            include: { items: { orderBy: { position: "asc" }, include: { image: true } } },
        })
    ),
});
