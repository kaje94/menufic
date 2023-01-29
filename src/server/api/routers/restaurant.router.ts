import type { Image, Prisma, PrismaPromise, Restaurant } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { env } from "src/env/server.mjs";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "src/server/api/trpc";
import { encodeImageToBlurhash, getColor, imageKit, rgba2hex, uploadImage } from "src/server/imageUtil";
import { bannerInput, id, restaurantId, restaurantInput } from "src/utils/validators";

export const restaurantRouter = createTRPCRouter({
    /** Add a banner to a restaurant */
    addBanner: protectedProcedure.input(bannerInput).mutation(async ({ ctx, input }) => {
        const restaurant = await ctx.prisma.restaurant.findUniqueOrThrow({
            select: { banners: true },
            where: { id_userId: { id: input.restaurantId, userId: ctx.session.user.id } },
        });

        // Check if the maximum banner count of the restaurant has been reached
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
                blurHash,
                color: rgba2hex(color[0], color[1], color[2]),
                id: uploadedResponse.fileId,
                path: uploadedResponse.filePath,
                restaurantBanner: { connect: { id_userId: { id: input.restaurantId, userId: ctx.session.user.id } } },
            },
        });
    }),

    /** Create a new restaurant for the user */
    create: protectedProcedure.input(restaurantInput).mutation(async ({ ctx, input }) => {
        const count = await ctx.prisma.restaurant.count({ where: { userId: ctx.session.user.id } });

        // Check if user has reached the maximum number of restaurants that he/she can create
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
                contactNo: input.contactNo,
                image: {
                    create: {
                        blurHash,
                        color: rgba2hex(color[0], color[1], color[2]),
                        id: uploadedResponse.fileId,
                        path: uploadedResponse.filePath,
                    },
                },
                isPublished: false,
                location: input.location,
                name: input.name,
                userId: ctx.session.user.id,
            },
            include: { image: true },
        });
    }),

    /** Delete restaurant along with all the menus, categories, items and images */
    delete: protectedProcedure.input(id).mutation(async ({ ctx, input }) => {
        const currentItem = await ctx.prisma.restaurant.findUniqueOrThrow({
            include: { banners: true, menus: { include: { categories: { include: { items: true } } } } },
            where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
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

    /** Delete a banner from the user's restaurant */
    deleteBanner: protectedProcedure.input(restaurantId.extend({ id: z.string() })).mutation(async ({ ctx, input }) => {
        const restaurant = await ctx.prisma.restaurant.findUniqueOrThrow({
            include: { banners: true },
            where: { id_userId: { id: input.restaurantId, userId: ctx.session.user.id } },
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

    /** Get basic info of a restaurant */
    get: protectedProcedure.input(id).query(({ ctx, input }) =>
        ctx.prisma.restaurant.findUniqueOrThrow({
            where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
        })
    ),

    /** Get all the restaurants belonging to a user */
    getAll: protectedProcedure.query(({ ctx }) =>
        ctx.prisma.restaurant.findMany({ include: { image: true }, where: { userId: ctx.session.user.id } })
    ),

    /** Get all the restaurants that have been published by all users */
    getAllPublished: protectedProcedure.query(({ ctx }) =>
        ctx.prisma.restaurant.findMany({ include: { image: true }, where: { isPublished: true } })
    ),

    /** Get banner images belonging to a restaurant */
    getBanners: protectedProcedure.input(id).query(async ({ ctx, input }) => {
        const restaurant = await ctx.prisma.restaurant.findUniqueOrThrow({
            select: { banners: true },
            where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
        });
        return restaurant.banners;
    }),

    /** Get all the details including items and images, for a given restaurant ID */
    getDetails: publicProcedure.input(id).query(({ ctx, input }) =>
        ctx.prisma.restaurant.findFirstOrThrow({
            include: {
                banners: true,
                image: true,
                menus: {
                    include: {
                        categories: {
                            include: { items: { include: { image: true }, orderBy: { position: "asc" } } },
                            orderBy: { position: "asc" },
                        },
                    },
                    orderBy: { position: "asc" },
                },
            },
            where: { id: input.id },
        })
    ),

    /** Update the published status of the restaurant */
    setPublished: protectedProcedure.input(id.extend({ isPublished: z.boolean() })).mutation(async ({ ctx, input }) => {
        const restaurant = await ctx.prisma.restaurant.update({
            data: { isPublished: input.isPublished },
            where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
        });
        /** Revalidate the published menu page */
        await ctx.res?.revalidate(`/restaurant/${input.id}/menu`);
        return restaurant;
    }),

    /** Update the restaurant details */
    update: protectedProcedure.input(restaurantInput.merge(id)).mutation(async ({ ctx, input }) => {
        const currentItem = await ctx.prisma.restaurant.findUniqueOrThrow({
            where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
        });

        const updateData: Partial<Restaurant> = {
            contactNo: input.contactNo,
            location: input.location,
            name: input.name,
        };

        const promiseList = [];
        const transactions: (Prisma.Prisma__ImageClient<Image> | Prisma.Prisma__RestaurantClient<Restaurant>)[] = [];

        // If image is being changed, then delete the previous image from imageKit and database
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
            ctx.prisma.restaurant.update({
                data: updateData,
                include: { image: true },
                where: { id_userId: { id: input.id, userId: ctx.session.user.id } },
            })
        );
        const [transactionRes] = await Promise.all([ctx.prisma.$transaction(transactions), promiseList]);

        return transactionRes.pop() as Restaurant & { image: Image | null };
    }),
});
