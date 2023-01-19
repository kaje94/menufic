import type { Prisma, Restaurant, Image, PrismaPromise } from "@prisma/client";
import { bannerInput, id, restaurantInput, restaurantId } from "src/utils/validators";
import { uploadImage, encodeImageToBlurhash, imageKit, rgba2hex, getColor } from "src/server/imageUtil";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "src/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { env } from "src/env/server.mjs";

export const restaurantRouter = createTRPCRouter({
    create: protectedProcedure.input(restaurantInput).mutation(async ({ ctx, input }) => {
        const count = await ctx.prisma.restaurant.count({ where: { userId: ctx.session.user.id } });
        if (count >= Number(env.NEXT_PUBLIC_MAX_RESTAURANTS_PER_USER)) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Maximum number of restaurants reached",
            });
        }

        const [uploadedResponse, blurHash, color] = await Promise.all([
            uploadImage(input.imageBase64, `user/${ctx.session.user.id}/restaurant`),
            encodeImageToBlurhash(input.imageBase64),
            getColor(input.imageBase64),
        ]);

        return ctx.prisma.restaurant.create({
            data: {
                name: input.name,
                location: input.location,
                image: {
                    create: {
                        id: uploadedResponse.fileId,
                        path: uploadedResponse.filePath,
                        blurHash,
                        color: rgba2hex(color[0], color[1], color[2]),
                    },
                },
                isPublished: false,
                userId: ctx.session.user.id,
            },
            include: { image: true },
        });
    }),
    update: protectedProcedure.input(restaurantInput.merge(id)).mutation(async ({ ctx, input }) => {
        const currentItem = await ctx.prisma.restaurant.findUniqueOrThrow({
            where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
        });

        const updateData: Partial<Restaurant> = { name: input.name, location: input.location };

        const promiseList = [];
        const transactions: (Prisma.Prisma__ImageClient<Image> | Prisma.Prisma__RestaurantClient<Restaurant>)[] = [];

        if (currentItem.imageId && input.imageBase64) {
            promiseList.push(imageKit.deleteFile(currentItem.imageId));
            transactions.push(ctx.prisma.image.delete({ where: { id: currentItem.imageId } }));
        }

        if (input.imageBase64) {
            const [uploadedResponse, blurHash, color] = await Promise.all([
                uploadImage(input.imageBase64, "restaurant"),
                encodeImageToBlurhash(input.imageBase64),
                getColor(input.imageBase64),
            ]);

            transactions.push(
                ctx.prisma.image.create({
                    data: {
                        id: uploadedResponse.fileId,
                        path: uploadedResponse.filePath,
                        blurHash,
                        color: rgba2hex(color[0], color[1], color[2]),
                    },
                })
            );
            updateData.imageId = uploadedResponse.fileId;
        }

        transactions.push(
            ctx.prisma.restaurant.update({
                data: updateData,
                where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
                include: { image: true },
            })
        );
        const [transactionRes] = await Promise.all([ctx.prisma.$transaction(transactions), promiseList]);

        return transactionRes.pop() as Restaurant & { image: Image | null };
    }),
    delete: protectedProcedure.input(id).mutation(async ({ ctx, input }) => {
        const currentItem = await ctx.prisma.restaurant.findUniqueOrThrow({
            where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
            include: { menus: { include: { categories: { include: { items: true } } } }, banners: true },
        });

        const transactions: PrismaPromise<unknown>[] = [];

        const imagePaths: string[] = [];
        if (currentItem.imageId) {
            imagePaths.push(currentItem.imageId);
        }

        currentItem?.banners?.forEach((banner) => {
            imagePaths.push(banner.id);
        });

        currentItem?.menus?.forEach((menu) => {
            menu.categories?.forEach((category) => {
                transactions.push(ctx.prisma.menuItem.deleteMany({ where: { categoryId: category.id } }));
                category.items?.forEach((item) => {
                    if (item.imageId) {
                        imagePaths.push(item.imageId);
                    }
                });
            });

            transactions.push(ctx.prisma.category.deleteMany({ where: { menuId: menu.id } }));
        });

        transactions.push(ctx.prisma.menu.deleteMany({ where: { restaurantId: input.id } }));

        transactions.push(
            ctx.prisma.restaurant.delete({ where: { id_userId: { id: input.id, userId: ctx.session.user.id } } })
        );

        transactions.push(ctx.prisma.image.deleteMany({ where: { id: { in: imagePaths } } }));

        await Promise.all([imageKit.bulkDeleteFiles(imagePaths), ctx.prisma.$transaction(transactions)]);

        return currentItem;
    }),
    get: protectedProcedure.input(id).query(({ ctx, input }) =>
        ctx.prisma.restaurant.findUniqueOrThrow({
            where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
        })
    ),
    getBanners: protectedProcedure.input(id).query(async ({ ctx, input }) => {
        const restaurant = await ctx.prisma.restaurant.findUniqueOrThrow({
            where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
            select: { banners: true },
        });
        return restaurant.banners;
    }),
    getAll: protectedProcedure.query(({ ctx }) =>
        ctx.prisma.restaurant.findMany({ where: { userId: ctx.session.user.id }, include: { image: true } })
    ),
    getAllPublished: protectedProcedure.query(({ ctx }) =>
        ctx.prisma.restaurant.findMany({ where: { isPublished: true }, include: { image: true } })
    ),
    getDetails: publicProcedure.input(id).query(({ ctx, input }) =>
        ctx.prisma.restaurant.findFirstOrThrow({
            where: { id: input.id },
            include: {
                menus: {
                    include: {
                        categories: {
                            include: { items: { orderBy: { position: "asc" }, include: { image: true } } },
                            orderBy: { position: "asc" },
                        },
                    },
                    orderBy: { position: "asc" },
                },
                image: true,
                banners: true,
            },
        })
    ),
    setPublished: protectedProcedure.input(id.extend({ isPublished: z.boolean() })).mutation(async ({ ctx, input }) => {
        const restaurant = await ctx.prisma.restaurant.update({
            where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
            data: { isPublished: input.isPublished },
        });
        await ctx.res?.revalidate(`/restaurant/${input.id}/menu`);
        return restaurant;
    }),
    addBanner: protectedProcedure.input(bannerInput).mutation(async ({ ctx, input }) => {
        const restaurant = await ctx.prisma.restaurant.findUniqueOrThrow({
            where: { id_userId: { id: input.restaurantId, userId: ctx.session.user.id } },
            select: { banners: true },
        });
        if (restaurant?.banners.length >= Number(env.NEXT_PUBLIC_MAX_BANNERS_PER_RESTAURANT)) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Maximum number of banners reached",
            });
        }

        const [uploadedResponse, blurHash, color] = await Promise.all([
            uploadImage(input.imageBase64, `user/${ctx.session.user.id}/restaurant/banners`),
            encodeImageToBlurhash(input.imageBase64),
            getColor(input.imageBase64),
        ]);

        return ctx.prisma.image.create({
            data: {
                id: uploadedResponse.fileId,
                path: uploadedResponse.filePath,
                blurHash,
                color: rgba2hex(color[0], color[1], color[2]),
                restaurantBanner: { connect: { id_userId: { id: input.restaurantId, userId: ctx.session.user.id } } },
            },
        });
    }),
    deleteBanner: protectedProcedure.input(restaurantId.extend({ id: z.string() })).mutation(async ({ ctx, input }) => {
        const restaurant = await ctx.prisma.restaurant.findUniqueOrThrow({
            where: { id_userId: { id: input.restaurantId, userId: ctx.session.user.id } },
            include: { banners: true },
        });
        if (restaurant.banners.find((item) => item.id === input.id)) {
            const [, deletedImage] = await Promise.all([
                imageKit.deleteFile(input.id),
                ctx.prisma.image.delete({ where: { id: input.id } }),
            ]);
            return deletedImage;
        }
        throw new TRPCError({ code: "FORBIDDEN" });
    }),
});
