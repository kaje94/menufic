import type { FC } from "react";
import { useEffect } from "react";

import { Button, Group, Stack, Text, TextInput, useMantineTheme } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconMapPin, IconPhone } from "@tabler/icons";
import { useTranslations } from "next-intl";

import type { ModalProps } from "@mantine/core";
import type { Image, Restaurant } from "@prisma/client";

import { api } from "src/utils/api";
import { showErrorToast, showSuccessToast } from "src/utils/helpers";
import { restaurantInput } from "src/utils/validators";

import { ImageUpload } from "../ImageUpload";
import { Modal } from "../Modal";

interface Props extends ModalProps {
    /** Restaurant to be edited */
    restaurant?: Restaurant & { image: Image | null };
}

/** Form to be used when allowing users to add or edit restaurants */
export const RestaurantForm: FC<Props> = ({ opened, onClose, restaurant, ...rest }) => {
    const trpcCtx = api.useContext();
    const theme = useMantineTheme();
    const t = useTranslations("dashboard.restaurant");
    const tCommon = useTranslations("common");

    const { mutate: createRestaurant, isLoading: isCreating } = api.restaurant.create.useMutation({
        onError: (err) => showErrorToast(t("createError"), err),
        onSuccess: (data) => {
            onClose();
            trpcCtx.restaurant.getAll.setData(undefined, (restaurants) => [...(restaurants || []), data]);
            showSuccessToast(tCommon("createSuccess"), t("createSuccessDesc", { name: data.name }));
        },
    });

    const { mutate: updatedRestaurant, isLoading: isUpdating } = api.restaurant.update.useMutation({
        onError: (err) => showErrorToast(t("updateError"), err),
        onSuccess: (data) => {
            onClose();
            trpcCtx.restaurant.getAll.setData(undefined, (restaurants) =>
                restaurants?.map((item) => (item.id === data.id ? { ...item, ...data } : item))
            );
            showSuccessToast(tCommon("updateSuccess"), t("updateSuccessDesc", { name: data.name }));
        },
    });

    const { getInputProps, onSubmit, setValues, isDirty, resetDirty, values, errors } = useForm({
        initialValues: {
            contactNo: restaurant?.contactNo || "",
            imageBase64: "",
            imagePath: restaurant?.image?.path || "",
            location: restaurant?.location || "",
            name: restaurant?.name || "",
            openingTimes: restaurant?.openingTimes || "",
        },
        validate: zodResolver(restaurantInput),
    });

    useEffect(() => {
        if (opened) {
            const formValues = {
                contactNo: restaurant?.contactNo || "",
                imageBase64: "",
                imagePath: restaurant?.image?.path || "",
                location: restaurant?.location || "",
                name: restaurant?.name || "",
                openingTimes: restaurant?.openingTimes || "",
            };
            setValues(formValues);
            resetDirty(formValues);
        }
    }, [restaurant, opened]);

    const loading = isCreating || isUpdating;

    return (
        <Modal
            loading={loading}
            onClose={onClose}
            opened={opened}
            title={restaurant ? t("updateModalTitle") : t("createModalTitle")}
            {...rest}
        >
            <form
                onSubmit={onSubmit((formValues) => {
                    if (isDirty()) {
                        if (restaurant) {
                            updatedRestaurant({ ...formValues, id: restaurant?.id });
                        } else {
                            createRestaurant(formValues);
                        }
                    } else {
                        onClose();
                    }
                })}
            >
                <Stack spacing="sm">
                    <TextInput
                        disabled={loading}
                        label={t("inputNameLabel")}
                        placeholder={t("inputNamePlaceholder")}
                        withAsterisk
                        {...getInputProps("name")}
                        autoFocus
                    />
                    <TextInput
                        disabled={loading}
                        icon={<IconMapPin color={theme.colors.dark[4]} />}
                        label={t("inputLocationLabel")}
                        placeholder={t("inputLocationPlaceholder")}
                        withAsterisk
                        {...getInputProps("location")}
                    />
                    <TextInput
                        disabled={loading}
                        icon={<IconPhone color={theme.colors.dark[4]} />}
                        label={t("inputContactNoLabel")}
                        placeholder={t("inputContactNoPlaceholder")}
                        {...getInputProps("contactNo")}
                    />
                    <TextInput
                        disabled={loading}
                        icon={<IconSun color={theme.colors.dark[4]} />}
                        label={t("inputOpeningTimesLabel")}
                        placeholder={t("inputOpeningTimesPlaceholder")}
                        withAsterisk
                        {...getInputProps("openingTimes")}
                    />
                    <ImageUpload
                        disabled={loading}
                        error={!!errors.imagePath}
                        height={400}
                        imageHash={restaurant?.image?.blurHash}
                        imageRequired
                        imageUrl={values?.imagePath}
                        onImageCrop={(imageBase64, imagePath) => setValues({ imageBase64, imagePath })}
                        onImageDeleteClick={() => setValues({ imageBase64: "", imagePath: "" })}
                        width={1000}
                    />
                    <Text color={theme.colors.red[7]} size="xs">
                        {errors.imagePath}
                    </Text>
                    <Group mt="md" position="right">
                        <Button data-testid="save-restaurant-form" loading={loading} px="xl" type="submit">
                            {tCommon("save")}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
};
