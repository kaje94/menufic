import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { Image, MenuItem, Prisma } from "@prisma/client";

import { env } from "src/env/server.mjs";
import { createTRPCRouter, protectedProcedure } from "src/server/api/trpc";
import { encodeImageToBlurhash, getColor, imageKit, rgba2hex, uploadImage } from "src/server/imageUtil";
import { categoryId, id, menuId, menuItemInput } from "src/utils/validators";

export const menuItemRouter = createTRPCRouter({
    /** Create a new menu item under a category of a restaurant menu */
    create: protectedProcedure.input(menuItemInput.merge(categoryId).merge(menuId)).mutation(async ({ ctx, input }) => {
        const [count, lastMenuItem] = await ctx.prisma.$transaction([
            ctx.prisma.menuItem.count({ where: { categoryId: input.categoryId } }),
            ctx.prisma.menuItem.findFirst({
                orderBy: { position: "desc" },
                where: { categoryId: input.categoryId, userId: ctx.session.user.id },
            }),
        ]);

        /** Check if the maximum number of items per category has been reached */
        if (count >= Number(env.NEXT_PUBLIC_MAX_MENU_ITEMS_PER_CATEGORY)) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Reached maximum number of menu items per category",
            });
        }

        const createData: Prisma.MenuItemCreateInput = {
            category: { connect: { id_userId: { id: input.categoryId, userId: ctx.session.user.id } } },
            description: input.description,
            name: input.name,
            position: lastMenuItem ? lastMenuItem.position + 1 : 0,
            price: input.price,
            userId: ctx.session.user.id,
        };

        if (input.imageBase64) {
            const [uploadedResponse, blurHash, color] = await Promise.all([
                uploadImage(input.imageBase64, `user/${ctx.session.user.id}/restaurant/menu/${input.menuId}`),
                encodeImageToBlurhash(input.imageBase64),
                getColor(input.imageBase64),
            ]);

            createData.image = {
                create: {
                    blurHash,
                    color: rgba2hex(color[0], color[1], color[2]),
                    id: uploadedResponse.fileId,
                    path: uploadedResponse.filePath,
                },
            };
        }

        return ctx.prisma.menuItem.create({ data: createData, include: { image: true } });
    }),

    /** Delete the menu item from a menu category */
    delete: protectedProcedure.input(id).mutation(async ({ ctx, input }) => {
        const currentItem = await ctx.prisma.menuItem.findUniqueOrThrow({
            where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
        });

        const transactions: (Prisma.Prisma__MenuItemClient<MenuItem> | Prisma.Prisma__ImageClient<Image>)[] = [
            ctx.prisma.menuItem.delete({ where: { id_userId: { id: input.id, userId: ctx.session.user.id } } }),
        ];

        const promiseList = [];

        if (currentItem.imageId) {
            promiseList.push(imageKit.deleteFile(currentItem.imageId));
            transactions.push(ctx.prisma.image.delete({ where: { id: currentItem.imageId } }));
        }
        promiseList.push(ctx.prisma.$transaction(transactions));
        await Promise.all(promiseList);
        return currentItem;
    }),

    /** Update the details of a menu item */
    update: protectedProcedure.input(menuItemInput.merge(id)).mutation(async ({ ctx, input }) => {
        const currentItem = await ctx.prisma.menuItem.findUniqueOrThrow({
            where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
        });

        const updateData: Partial<MenuItem> = { description: input.description, name: input.name, price: input.price };

        const promiseList = [];
        const transactions: (Prisma.Prisma__ImageClient<Image> | Prisma.Prisma__MenuItemClient<MenuItem>)[] = [];

        /** Delete the previous image from imageKit and db, if the image is being replaced */
        if (currentItem.imageId && (!input.imagePath || input.imageBase64)) {
            promiseList.push(imageKit.deleteFile(currentItem.imageId));
            transactions.push(ctx.prisma.image.delete({ where: { id: currentItem.imageId } }));
        }

        if (input.imageBase64) {
            const [uploadedResponse, blurHash, color] = await Promise.all([
                uploadImage(input.imageBase64, "menu"),
                encodeImageToBlurhash(input.imageBase64),
                getColor(input.imageBase64),
            ]);

            transactions.push(
                ctx.prisma.image.create({
                    data: {
                        blurHash,
                        color: rgba2hex(color[0], color[1], color[2]),
                        id: uploadedResponse.fileId,
                        path: uploadedResponse.filePath,
                    },
                })
            );
            updateData.imageId = uploadedResponse.fileId;
        }

        transactions.push(
            ctx.prisma.menuItem.update({
                data: updateData,
                include: { image: true },
                where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
            })
        );
        const [transactionRes] = await Promise.all([ctx.prisma.$transaction(transactions), promiseList]);
        return transactionRes.pop() as MenuItem & { image: Image | null };
    }),
    /** Update the positions of all menu items, within the category */
    updatePosition: protectedProcedure
        .input(z.array(id.extend({ newPosition: z.number() })))
        .mutation(async ({ ctx, input }) =>
            ctx.prisma.$transaction(
                input.map((item) =>
                    ctx.prisma.menuItem.update({
                        data: { position: item.newPosition, userId: ctx.session.user.id },
                        where: { id: item.id },
                    })
                )
            )
        ),
});
