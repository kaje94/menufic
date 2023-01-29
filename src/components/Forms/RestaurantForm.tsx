import type { FC } from "react";
import { useEffect } from "react";

import type { ModalProps } from "@mantine/core";
import { Button, Group, Stack, Text, TextInput, useMantineTheme } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import type { Image, Restaurant } from "@prisma/client";
import { IconMapPin, IconPhone } from "@tabler/icons";

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

    const { mutate: createRestaurant, isLoading: isCreating } = api.restaurant.create.useMutation({
        onError: (err) => showErrorToast("Failed to create restaurant", err),
        onSuccess: (data) => {
            onClose();
            trpcCtx.restaurant.getAll.setData(undefined, (restaurants) => [...(restaurants || []), data]);
            showSuccessToast("Successfully created", `Created new ${data.name} restaurant successfully`);
        },
    });

    const { mutate: updatedRestaurant, isLoading: isUpdating } = api.restaurant.update.useMutation({
        onError: (err) => showErrorToast("Failed to update restaurant", err),
        onSuccess: (data) => {
            onClose();
            trpcCtx.restaurant.getAll.setData(undefined, (restaurants) =>
                restaurants?.map((item) => (item.id === data.id ? { ...item, ...data } : item))
            );
            showSuccessToast("Successfully updated", `Created restaurant ${data.name}, successfully`);
        },
    });

    const { getInputProps, onSubmit, setValues, isDirty, resetDirty, values, errors } = useForm({
        initialValues: {
            contactNo: restaurant?.contactNo || "",
            imageBase64: "",
            imagePath: restaurant?.image?.path || "",
            location: restaurant?.location || "",
            name: restaurant?.name || "",
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
            title={restaurant ? "Edit Restaurant" : "Add Restaurant"}
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
                        label="Name"
                        placeholder="Restaurant Name"
                        withAsterisk
                        {...getInputProps("name")}
                        autoFocus
                    />
                    <TextInput
                        disabled={loading}
                        icon={<IconMapPin color={theme.colors.dark[4]} />}
                        label="Location"
                        placeholder="No 05, Road Name, City"
                        withAsterisk
                        {...getInputProps("location")}
                    />
                    <TextInput
                        disabled={loading}
                        icon={<IconPhone color={theme.colors.dark[4]} />}
                        label="Contact Number"
                        placeholder="+919367788755"
                        {...getInputProps("contactNo")}
                    />
                    <ImageUpload
                        disabled={loading}
                        error={!!errors.imagePath}
                        height={300}
                        imageHash={restaurant?.image?.blurHash}
                        imageRequired
                        imageUrl={values?.imagePath}
                        onImageCrop={(imageBase64, imagePath) => setValues({ imageBase64, imagePath })}
                        onImageDeleteClick={() => setValues({ imageBase64: "", imagePath: "" })}
                        width={750}
                    />
                    <Text color={theme.colors.red[7]} size="xs">
                        {errors.imagePath}
                    </Text>
                    <Group mt="md" position="right">
                        <Button loading={loading} px="xl" type="submit">
                            Save
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
};
