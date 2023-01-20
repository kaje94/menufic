import type { ModalProps } from "@mantine/core";
import { Stack, Button, Group, Text, useMantineTheme } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "src/utils/helpers";
import { api } from "src/utils/api";
import { bannerInput } from "src/utils/validators";
import { ImageUpload } from "../ImageUpload";
import { Modal } from "../Modal";

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

    return (
        <Modal opened={opened} onClose={onClose} title="Add Banner" loading={isCreating} {...rest}>
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
                    <ImageUpload
                        width={750}
                        height={300}
                        imageUrl={imagePath}
                        error={!!errors.imageBase64}
                        imageRequired
                        disabled={isCreating}
                        onImageCrop={(imageBase64, imagePath) => {
                            setValues({ imageBase64 });
                            setImagePath(imagePath);
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
            </form>
        </Modal>
    );
};
