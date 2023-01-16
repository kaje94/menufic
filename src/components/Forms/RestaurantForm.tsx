import type { ModalProps } from "@mantine/core";
import { Modal, TextInput, Stack, Button, Group, Text, useMantineTheme } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import type { Restaurant, Image } from "@prisma/client";
import imageCompression from "browser-image-compression";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { showErrorToast, toBase64, showSuccessToast } from "src/utils/helpers";
import { api } from "src/utils/api";
import { restaurantInput } from "src/utils/validators";
import { ImageUpload } from "../ImageUpload";
import { CropModal } from "./CropModal";

interface Props extends ModalProps {
    /** Restaurant to be edited */
    restaurant?: Restaurant & { image: Image | null };
}

/** Form to be used when allowing users to add or edit restaurants */
export const RestaurantForm: FC<Props> = ({ opened, onClose, restaurant, ...rest }) => {
    const trpcCtx = api.useContext();
    const theme = useMantineTheme();

    const { mutate: createRestaurant, isLoading: isCreating } = api.restaurant.create.useMutation({
        onSuccess: (data) => {
            onClose();
            trpcCtx.restaurant.getAll.setData(undefined, (restaurants) => [...(restaurants || []), data]);
            showSuccessToast("Successfully created", `Created new ${data.name} restaurant successfully`);
        },
        onError: (err) => showErrorToast("Failed to create restaurant", err),
    });

    const { mutate: updatedRestaurant, isLoading: isUpdating } = api.restaurant.update.useMutation({
        onSuccess: (data) => {
            onClose();
            trpcCtx.restaurant.getAll.setData(undefined, (restaurants) =>
                restaurants?.map((item) => (item.id === data.id ? { ...item, ...data } : item))
            );
            showSuccessToast("Successfully updated", `Created restaurant ${data.name}, successfully`);
        },
        onError: (err) => showErrorToast("Failed to update restaurant", err),
    });

    const { getInputProps, onSubmit, setValues, isDirty, resetDirty, values, errors } = useForm({
        initialValues: {
            name: restaurant?.name || "",
            location: restaurant?.location || "",
            imageBase64: "",
            imagePath: restaurant?.image?.path || "",
        },
        validate: zodResolver(restaurantInput),
    });

    useEffect(() => {
        if (opened) {
            const values = {
                name: restaurant?.name || "",
                location: restaurant?.location || "",
                imageBase64: "",
                imagePath: restaurant?.image?.path || "",
            };
            setValues(values);
            resetDirty(values);
        }
    }, [restaurant, opened]);

    const [imageCropModalOpen, setImageCropModalOpen] = useState(false);
    const [newUploadedImageUrl, setNewUploadedImageUrl] = useState("");

    const onCropComplete = useCallback(
        async (croppedImageBlob: Blob) => {
            setImageCropModalOpen(false);
            setNewUploadedImageUrl("");

            const compressedFile = await imageCompression(
                new File([croppedImageBlob], "menu-item.jpeg", {
                    type: croppedImageBlob.type,
                }),
                { maxWidthOrHeight: 900, useWebWorker: true, initialQuality: 0.75 }
            );
            const base64File = await toBase64(compressedFile);
            setValues({ imageBase64: base64File as string, imagePath: URL.createObjectURL(compressedFile) });
        },
        [setValues, setImageCropModalOpen]
    );

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Text size="lg">{restaurant ? "Edit Restaurant" : "Add Restaurant"}</Text>}
            overlayOpacity={0.1}
            overlayBlur={5}
            {...rest}
        >
            <form
                onSubmit={onSubmit((values) => {
                    if (isDirty()) {
                        if (restaurant) {
                            updatedRestaurant({ ...values, id: restaurant?.id });
                        } else {
                            createRestaurant(values);
                        }
                    } else {
                        onClose();
                    }
                })}
            >
                <Stack spacing="sm">
                    <TextInput
                        withAsterisk
                        label="Name"
                        placeholder="Restaurant Name"
                        {...getInputProps("name")}
                        autoFocus={true}
                    />
                    <TextInput
                        withAsterisk
                        label="Location"
                        placeholder="No 05, Road Name, City"
                        {...getInputProps("location")}
                    />
                    <Text size="md" mt="md">
                        Image
                        <Text component="span" color="red">
                            *
                        </Text>
                    </Text>
                    <ImageUpload
                        width={750}
                        height={300}
                        imageUrl={values?.imagePath}
                        imageHash={restaurant?.image?.blurHash}
                        error={!!errors.imagePath}
                        onImageDrop={(file) => {
                            setNewUploadedImageUrl(URL.createObjectURL(file));
                            setImageCropModalOpen(true);
                        }}
                        onImageDeleteClick={() => setValues({ imageBase64: "", imagePath: "" })}
                    />
                    <Text color={theme.colors.red[7]} size="xs">
                        {errors.imagePath}
                    </Text>
                    <Group position="right" mt="md">
                        <Button type="submit" loading={isCreating || isUpdating} px="xl">
                            Save
                        </Button>
                    </Group>
                </Stack>

                <CropModal
                    opened={imageCropModalOpen}
                    onClose={() => setImageCropModalOpen(false)}
                    onCrop={onCropComplete}
                    imageUrl={newUploadedImageUrl}
                    aspect={2.5 / 1}
                />
            </form>
        </Modal>
    );
};
