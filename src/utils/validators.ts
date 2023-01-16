import { z } from "zod";

export const menuId = z.object({ menuId: z.string().cuid() });
export const categoryId = z.object({ categoryId: z.string().cuid() });
export const restaurantId = z.object({ restaurantId: z.string().cuid() });
export const id = z.object({ id: z.string().cuid() });

export const categoryInput = z.object({
    name: z.string().trim().min(1, "Name is required").max(30, "Name cannot be longer than 30 characters"),
});
export const menuInput = z.object({
    name: z.string().trim().min(1, "Name is required").max(30, "Name cannot be longer than 30 characters"),
    availableTime: z.string().trim().max(20),
});
export const menuItemInput = z.object({
    name: z.string().trim().min(1, "Name is required").max(50, "Name cannot be longer than 50 characters"),
    description: z.string().trim().max(200),
    price: z.string().trim().min(1, "Price is required").max(12, "Price cannot be longer than 12 characters"),
    imageBase64: z.string().optional(),
    imagePath: z.string().optional(),
});
export const restaurantInput = z.object({
    name: z.string().trim().min(1, "Name is required").max(30, "Name cannot be longer than 30 characters"),
    location: z.string().trim().min(1, "Location is required").max(50, "Location cannot be longer than 50 characters"),
    imageBase64: z.string(),
    imagePath: z.string().min(1, "Image is required"),
});
export const bannerInput = z.object({
    restaurantId: z.string().cuid(),
    imageBase64: z.string().min(1, "Image is required"),
});
