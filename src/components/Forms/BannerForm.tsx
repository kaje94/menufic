import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Button, Group, Text, useMantineTheme } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import imageCompression from "browser-image-compression";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { toBase64, showErrorToast, showSuccessToast } from "src/utils/helpers";
import { api } from "src/utils/api";
import { bannerInput } from "src/utils/validators";
import { ImageUpload } from "../ImageUpload";
import { CropModal } from "./CropModal";

interface Props extends ModalProps {
    /** Id of the restaurant for the the banner needs to be attached to */
    restaurantId: string;
}

/** Form to be used when allowing users to upload banners for restaurant */
export const BannerForm: FC<Props> = ({ opened, onClose, restaurantId, ...rest }) => {
    const trpcCtx = api.useContext();
    const theme = useMantineTheme();
    const [imagePath, setImagePath] = useState("");

    const { mutate: addBanner, isLoading: isCreating } = api.restaurant.addBanner.useMutation({
        onSuccess: (data) => {
            onClose();
            trpcCtx.restaurant.getBanners.setData({ id: restaurantId }, (banners = []) => [...banners, data]);
            showSuccessToast("Successfully created", `Successfully created new banner for the restaurant`);
        },
        onError: (err) => showErrorToast("Failed to create banner for restaurant", err),
    });

    const { onSubmit, setValues, isDirty, resetDirty, errors } = useForm({
        initialValues: { restaurantId: restaurantId, imageBase64: "" },
        validate: zodResolver(bannerInput),
    });

    useEffect(() => {
        if (opened) {
            setImagePath("");
            const values = { restaurantId: restaurantId, imageBase64: "" };
            setValues(values);
            resetDirty(values);
        }
    }, [restaurantId, opened]);

    const [imageCropModalOpen, setImageCropModalOpen] = useState(false);
    const [newUploadedImageUrl, setNewUploadedImageUrl] = useState("");

    const onCropComplete = useCallback(
        async (croppedImageBlob: Blob) => {
            setImageCropModalOpen(false);
            setNewUploadedImageUrl("");

            const compressedFile = await imageCompression(
                new File([croppedImageBlob], "menu-item.jpeg", { type: croppedImageBlob.type }),
                { maxWidthOrHeight: 900, useWebWorker: true, initialQuality: 0.75 }
            );
            const base64File = await toBase64(compressedFile);
            setValues({ imageBase64: base64File as string });
            setImagePath(URL.createObjectURL(compressedFile));
        },
        [setValues, setImageCropModalOpen]
    );

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Text size="lg">Add Banner</Text>}
            overlayOpacity={0.1}
            overlayBlur={5}
            {...rest}
        >
            <form
                onSubmit={onSubmit((values) => {
                    if (isDirty()) {
                        addBanner(values);
                    } else {
                        onClose();
                    }
                })}
            >
                <Stack spacing="sm">
                    <Text size="md" mt="md">
                        Image
                        <Text component="span" color="red">
                            *
                        </Text>
                    </Text>
                    <ImageUpload
                        width={750}
                        height={300}
                        imageUrl={imagePath}
                        error={!!errors.imageBase64}
                        onImageDrop={(file) => {
                            setNewUploadedImageUrl(URL.createObjectURL(file));
                            setImageCropModalOpen(true);
                        }}
                        onImageDeleteClick={() => {
                            setValues({ imageBase64: "" });
                            setImagePath("");
                        }}
                    />
                    <Text color={theme.colors.red[7]} size="xs">
                        {errors.imageBase64}
                    </Text>
                    <Group position="right" mt="md">
                        <Button type="submit" loading={isCreating} px="xl">
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
